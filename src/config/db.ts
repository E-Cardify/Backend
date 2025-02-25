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
    // Get MongoDB URI from environment variables
    const mongoUri = process.env["MONGO_URI"];

    // Check if MONGO_URI is configured, warn if not found
    if (!mongoUri) {
      console.warn(
        "MONGO_URI not found in environment variables, using default local connection"
      );
    }

    // Use provided URI or fallback to local MongoDB instance
    const connectionString = mongoUri || "mongodb://localhost:27017/Cardify";

    // Attempt to establish MongoDB connection
    await mongoose.connect(connectionString, {});

    // Log successful connection
    console.log(`MongoDB connected successfully to ${mongoUri || "localhost"}`);
    return true;
  } catch (error) {
    // Log connection error details
    console.error("Failed to establish MongoDB connection:");
    console.error(`Error details: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
