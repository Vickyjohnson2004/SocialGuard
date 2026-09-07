import mongoose from "mongoose";
import { ENV } from "./env";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose.connect(ENV.DB_URL);
  try {
    const conn = await connectionPromise;
    console.log(`Connected to MONGODB: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    connectionPromise = null;
    const message = error instanceof Error ? error.message : String(error);
    console.error("MONGODB connection error:", message);
    throw error;
  }
};

export default connectDB;
