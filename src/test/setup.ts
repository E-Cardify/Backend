/**
 * Test setup configuration for MongoDB
 *
 * This file configures an in-memory MongoDB server for testing purposes.
 * It handles:
 * - Creating and connecting to an in-memory MongoDB instance before tests
 * - Clearing all collections before each test for clean state
 * - Cleaning up connections and stopping the server after tests complete
 */

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Instance of in-memory MongoDB server
let mongo: MongoMemoryServer;

// Before all tests, create and connect to in-memory MongoDB instance
beforeAll(async () => {
  // Create new MongoDB memory server
  mongo = await MongoMemoryServer.create();
  // Get the URI to connect to the in-memory database
  const mongoUri = mongo.getUri();
  // Connect mongoose to the in-memory database
  await mongoose.connect(mongoUri);
});

// Before each test, clear all collections to ensure clean test state
beforeEach(async () => {
  // Get all collections in the database
  const collections = await mongoose!.connection!.db!.collections();
  // Delete all documents from each collection
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// After all tests complete, cleanup database connections
afterAll(async () => {
  // Close mongoose connection
  await mongoose.connection.close();
  // Stop the in-memory MongoDB server
  await mongo.stop();
});
