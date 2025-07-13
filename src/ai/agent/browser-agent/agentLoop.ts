import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";
import { callLlm } from "../../providers/openRouter";
import { TestTools } from "../tools";
import { executeWebDriverLoop } from "./webDriverLoop";
import { GeminiModel, LLMModel } from "../../providers/models";

/**
 * Initiate the agents recursive loop
 * @param contents 
 * @param driver 
 * @param model 
 * @returns 
 */
export const callLlmAgentLoop = async (
  contents: ChatCompletionMessageParam[],
  driver: WebdriverIO.Browser,
  model: LLMModel = GeminiModel.GEMINI_2_5_PRO
): Promise<ChatCompletionMessage> => {
  console.log("[ callLlmAgentLoop ] with", contents.length, "contents");
  const actionSteps: string[] = [];

  const response = await callLlm(contents, model, TestTools);

  const toolCalls = response.tool_calls;

  if (toolCalls && toolCalls.length > 0) {
    console.log(
      "[ callLlmAgentLoop ] with",
      toolCalls.length,
      "function calls"
    );
    const newContents = await executeWebDriverLoop(
      toolCalls,
      contents,
      driver,
      actionSteps
    );

    console.log("[ callLlmAgentLoop ] calls executed, recursing");
    return await callLlmAgentLoop(newContents, driver, model);
  }
  console.log("[ callLlmAgentLoop ] no function calls, returning");
  return response;
};
