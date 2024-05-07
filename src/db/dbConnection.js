import mongoose from "mongoose";
import config from "../constant.js";

const MONGODB_URL = config.MONGO_URL;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URL);
    console.log(
      `MongoDB Connected !!! DB HOST ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection Error : ", error);
    process.exit(1);
  }
};

export default connectDB;
