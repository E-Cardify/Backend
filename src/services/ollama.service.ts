import ollama from "ollama";

const MODEL = "llama3.2";

const streamChatWithOllama = async function* (message: string) {
  const prompt = { role: "user", content: message };

  const response = await ollama.chat({
    model: MODEL,
    messages: [prompt],
    stream: true,
  });

  let text = "";

  for await (const part of response) {
    const content = part.message.content;
    text += content;
    yield content;

    console.log(text);
  }
};

const getEmbeddingFromOllama = async function (text: string) {
  const response = await ollama.embed({
    model: MODEL,
    input: text,
  });

  return response.embeddings;
};

export { streamChatWithOllama, getEmbeddingFromOllama };
