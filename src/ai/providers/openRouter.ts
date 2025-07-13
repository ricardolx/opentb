import { OpenAI } from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import { LLMModel } from "./models";

const openAI = new OpenAI({
  baseURL: process.env.LLM_BASE_URL,
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export const openRouter = {
  openAI,
};

export const callLlm = async (
  contents: ChatCompletionMessageParam[],
  model: LLMModel,
  tools: ChatCompletionTool[]
) => {
  const response = await openAI.chat.completions.create({
    model,
    messages: contents,
    tools,
  });

  return response.choices[0].message;
};
