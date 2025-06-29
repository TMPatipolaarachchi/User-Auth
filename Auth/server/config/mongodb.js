import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const MONGODB_URI = "mongodb+srv://tmpatipolaarachchi:2455455@cluster0.vlbkjqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" ;

const connectdb = async () =>{

    await mongoose.connect(MONGODB_URI);
    console.log("db conected")

}

export default connectdb