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
  console.log("[ callLlm ] with", model);
  const response = await openAI.chat.completions.create({
    model,
    messages: contents,
    tools,
  });

  console.log("[ callLlm ] completion tokens", response.usage?.completion_tokens);
  console.log("[ callLlm ] prompt tokens", response.usage?.prompt_tokens);
  console.log("[ callLlm ] total tokens", response.usage?.total_tokens);

  return response.choices[0].message;
};
