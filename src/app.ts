/**
 * Main Express application configuration
 * Sets up middleware, routes and application settings
 */
import express, { Application } from "express";
import cors from "cors";
import cardInfo from "./routes/cardInfo";
import auth from "./routes/auth";
import user from "./routes/user";
import cookieParser from "cookie-parser";

// Initialize Express application
const app: Application = express();

// Configure middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser());

// Register API routes
app.use("/api/v1/card-info", cardInfo); // Card information endpoints
app.use("/api/v1/auth", auth); // User management endpoints
app.use("/api/v1/user", user); // User management endpoints

// Trust proxy headers (useful when behind reverse proxy like nginx)
app.set("trust proxy", true);

export default app;
