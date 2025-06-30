import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectdb from "./config/mongodb.js";
import routes from "./route/userroute.js";


const app = express();
const PORT = process.env.PORT || 4000;


connectdb();


app.use(cors({ origin: 'http://localhost:5174', credentials: true }));


app.use(express.json());  
app.use(cookieParser());

app.get("/", (req, res) => res.send("Server is running..."));


app.use("/api/user", routes)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
