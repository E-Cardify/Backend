import { Request, Response } from "express";
import { z } from "zod";
import { rewriteCardDescriptionContext } from "../../config/llama3.2/contexts";
import { streamChatWithOllama } from "../../services/ollama.service";
import { io } from "../../server";
import { ProtectedRequest } from "../../types/ProtectedRequest";

const schema = z.object({
  message: z.string(),
});

const rewriteCardDescription = async (
  req: Request & ProtectedRequest,
  res: Response
) => {
  const { message } = schema.parse(req.body);

  const response = streamChatWithOllama(message, rewriteCardDescriptionContext);
  res.status(200).json();
  for await (const part of response) {
    io.to(req.sessionId.toString()).emit("rewrite-card-description", part);
  }
};

export default rewriteCardDescription;
