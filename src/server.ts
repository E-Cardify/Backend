/**
 * Main server entry point
 * Initializes environment variables, database connection and Express server
 */
import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Default port is 5000 if not specified in environment variables
// Parse as number since process.env values are strings
const PORT = parseInt(process.env["PORT"] || "5000", 10);

// Initialize database connection and start server
// Using Promise chain for clear error handling
connectDB()
  .then(() => {
    // Start Express server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("Press CTRL+C to stop the server");
    });
  })
  .catch((err: Error) => {
    // Log database connection error and exit process
    console.error("Failed to connect to the database:", err);
    console.error("Server cannot start without database connection");
    process.exit(1); // Exit with error code
  });
