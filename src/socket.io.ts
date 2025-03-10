import { io } from "./server";
import { streamChatWithOllama } from "./services/ollama.service";

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("ask", async (message: string) => {
    console.log(message);

    const response = streamChatWithOllama(message);

    for await (const part of response) {
      socket.emit("response", part);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
