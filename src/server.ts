/**
 * Main server entry point
 * Initializes environment variables, database connection and Express server
 */
import { Server } from "socket.io";
import app from "./app";
import connectDB from "./config/db";
import { transporter } from "./config/nodemailer";
import http from "http";
import { streamChatWithOllama } from "./services/ollama.service";
import {
  CONSOLE_LOG_DIVIDER,
  ENVIRONMENT,
  ORIGIN_URL,
  PORT,
} from "./constants/env";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ORIGIN_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  if (ENVIRONMENT === "development") {
    socket.on("ask", async ({ message }: { message: string }) => {
      console.log(message);

      const response = streamChatWithOllama(message);

      for await (const part of response) {
        socket.emit("response", part);
      }
    });
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Initialize database connection and start server
// Using Promise chain for clear error handling
connectDB()
  .then(() => {
    transporter
      .verify()
      .then(() => {
        CONSOLE_LOG_DIVIDER();
        console.log("Server is ready to take our messages");
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
