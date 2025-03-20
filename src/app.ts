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
import { errorHandler } from "./middleware/errorHandler";
import { catchErrors } from "./utils/catchErrors";
import { authenticate } from "./middleware/authenticate";
import { NOT_FOUND } from "./constants/http";
import ollama from "./routes/ollama";
import { ORIGIN_URL } from "./constants/env";

// Initialize Express application
const app: Application = express();

// Configure middleware
app.use(
  cors({
    origin: ORIGIN_URL,
    credentials: true,
  })
); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser());

app.get(
  "/test-error",
  catchErrors(async () => {
    throw new Error("Test error");
  })
);

app.use("/api/v1/ollama", ollama);
app.use("/api/v1/card-info", cardInfo);
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", catchErrors(authenticate), user);
app.all("*", (_, res) => {
  res.status(NOT_FOUND).json({ message: "Not found" });
});

app.use(errorHandler);

export default app;
