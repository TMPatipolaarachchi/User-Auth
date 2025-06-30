import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/usermodel.js";

const router = express.Router();


const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains: { id: user._id, iat, exp }

    next(); // <-- Important to continue to the next middleware or route
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};



router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({
      success: true,
      msg: "User registered successfully",
    });
  } catch (e) {
    return res.status(500).json({ success: false, msg: e.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
});


router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, msg: "Logged out" });
  } catch (e) {
    res.status(500).json({ success: false, msg: "Couldn't logout" });
  }
});


router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Profile Route Error:", error);
    res.status(500).json({ msg: "Server error!" });
  }
});


export default router;
