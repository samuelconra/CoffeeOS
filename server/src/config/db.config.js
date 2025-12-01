import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfull connection to MongoDB");
  } catch (err) {
    console.error("Connection error to MongoDB", err);
    process.exit(1);
  }
};

export default connectDB;
