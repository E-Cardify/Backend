import { Server, IncomingMessage, ServerResponse } from "http";
import io from "socket.io";
import { ENVIRONMENT, ORIGIN_URL } from "./constants/env";
import { streamChatWithOllama } from "./services/ollama.service";

const SocketIO = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  const ioServer = new io.Server(server, {
    cors: {
      origin: ORIGIN_URL,
      credentials: true,
    },
  });

  ioServer.on("connection", (socket) => {
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

  return ioServer;
};

export { SocketIO };
