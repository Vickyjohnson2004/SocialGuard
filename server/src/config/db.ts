import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log(`Connected to MONGODB: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("MONGODB connection error:", message);
    process.exit(1);
  }
};

export default connectDB;
