import { Request, Response } from "express";
import { z } from "zod";
import { getEmbeddingFromOllama } from "../../services/ollama.service";

const schema = z.object({
  text: z.string(),
});

const embed = async (req: Request, res: Response) => {
  const { text } = schema.parse(req.body);

  const embeddings = await getEmbeddingFromOllama(text);
  res.status(200).json(embeddings);
};

export default embed;
