import app from "./app";
import connectDB from "./config/db";

// Default port is 5000 if not specified in environment variables
const PORT = process?.env?.["PORT"] || 5000;

// Initialize database connection and start server
connectDB()
  .then(() => {
    // Start Express server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    // Properly type the error parameter
    console.error("Failed to connect to the database:", err);
    // Server cannot start without DB connection, process will exit
  });
