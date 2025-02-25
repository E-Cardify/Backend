import mongoose from "mongoose";

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
    // Retrieve MongoDB connection string from environment
    const mongoUri = process.env["MONGO_URI"];
    if (!mongoUri) {
      console.warn(
        "MONGO_URI not found in environment variables, using default local connection"
      );
    }

    // Establish database connection
    await mongoose.connect(mongoUri || "mongodb://localhost:27017/Cardify");

    // Connection successful
    console.log(`MongoDB connected successfully to ${mongoUri || "localhost"}`);
    return true;
  } catch (error) {
    // Fatal error - cannot proceed without database
    console.error(`MongoDB connection error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
