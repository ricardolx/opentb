import { OpenAI } from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import { LLMModel } from "./models";
import { logger } from "../../utils/logger";

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
  logger.debug("[ callLlm ] with", model);
  const response = await openAI.chat.completions.create({
    model,
    messages: contents,
    tools,
  });

  logger.debug("[ callLlm ] completion tokens", response.usage?.completion_tokens);
  logger.debug("[ callLlm ] prompt tokens", response.usage?.prompt_tokens);
  logger.debug("[ callLlm ] total tokens", response.usage?.total_tokens);

  return response.choices[0].message;
};
