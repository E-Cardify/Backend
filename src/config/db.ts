import mongoose from "mongoose";
import { CONSOLE_LOG_DIVIDER, MONGO_URI } from "../constants/env";

/**
 * Establishes a connection to MongoDB using mongoose.
 *
 * Attempts to connect using the MONGO_URI environment variable.
 * Falls back to a local MongoDB instance at mongodb://localhost:27017/Cardify
 * if MONGO_URI is not configured.
 *
 * @returns Promise<boolean> Returns true on successful connection
 * @throws Exits process with code 1 if connection fails
 */
const connectDB = async (): Promise<boolean> => {
  try {
    await mongoose.connect(MONGO_URI, {});

    CONSOLE_LOG_DIVIDER();
    console.log(`MongoDB connected successfully`);
    return true;
  } catch (error) {
    // Log connection error details
    CONSOLE_LOG_DIVIDER();
    console.error("Failed to establish MongoDB connection:");
    CONSOLE_LOG_DIVIDER();
    console.error(`Error details: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
