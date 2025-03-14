import socketio from "socket.io";
import { parse } from "cookie";
import { verifyToken } from "./utils/jwt";
// import { CONSOLE_LOG_DIVIDER, ENVIRONMENT } from "./constants/env";
// import { streamChatWithOllama } from "./services/ollama.service";
// import { rewriteCardDescriptionContext } from "./config/llama3.2/contexts";

const setupSocketIoRoutes = (
  io: socketio.Server<
    socketio.DefaultEventsMap,
    socketio.DefaultEventsMap,
    socketio.DefaultEventsMap,
    any
  >
) => {
  io.on("connection", (socket) => {
    console.log("A user connected");
    const cookies = parse(socket.handshake.headers.cookie || "");

    if (!cookies["accessToken"]) {
      return;
    }

    const { payload } = verifyToken(cookies["accessToken"]);

    if (!payload) {
      return;
    }

    socket.join(payload.sessionId.toString());

    // if (ENVIRONMENT === "development") {
    //   socket.on("ask", async ({ message }: { message: string }) => {
    //     console.log(message);

    //     const response = streamChatWithOllama(message);

    //     for await (const part of response) {
    //       socket.emit("response", part);
    //     }
    //   });
    // }

    // socket.on(
    //   "rewrite-card-description",
    //   async ({ message }: { message: string }) => {
    //     CONSOLE_LOG_DIVIDER();
    //     console.log("message " + message);
    //     CONSOLE_LOG_DIVIDER();

    //     const response = streamChatWithOllama(
    //       message,
    //       rewriteCardDescriptionContext
    //     );

    //     for await (const part of response) {
    //       socket.emit("rewrite-card-description", part);
    //     }

    //     socket.emit("terminate");
    //   }
    // );

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

export default setupSocketIoRoutes;
