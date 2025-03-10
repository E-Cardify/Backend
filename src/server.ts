/**
 * Main server entry point
 * Initializes environment variables, database connection and Express server
 */
import app from "./app";
import connectDB from "./config/db";
import { transporter } from "./config/nodemailer";
import http from "http";
import { CONSOLE_LOG_DIVIDER, PORT } from "./constants/env";
import { SocketIO } from "./socket.io";

// Initialize database connection and start server
// Using Promise chain for clear error handling
connectDB()
  .then(() => {
    transporter
      .verify()
      .then(() => {
        CONSOLE_LOG_DIVIDER();
        console.log("Server is ready to take our messages");
        const server = http.createServer(app);

        SocketIO(server);
        // Start Express server after successful DB connection
        server.listen(PORT, () => {
          CONSOLE_LOG_DIVIDER();
          console.log(`Server running at :${PORT}`);
          CONSOLE_LOG_DIVIDER();
          console.log("Press CTRL+C to stop the server");
        });
      })
      .catch((err: unknown) => {
        CONSOLE_LOG_DIVIDER();
        console.log("Nodemailer failed to start");
        CONSOLE_LOG_DIVIDER();
        console.log(err);
      });
  })
  .catch((err: Error) => {
    // Log database connection error and exit process
    CONSOLE_LOG_DIVIDER();
    console.error("Failed to connect to the database:", err);
    CONSOLE_LOG_DIVIDER();
    console.error("Server cannot start without database connection");
    process.exit(1); // Exit with error code
  });
