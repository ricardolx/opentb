import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";
import { callLlm } from "../../providers/openRouter";
import { TestTools } from "../tools";
import { executeWebDriverLoop } from "./webDriverLoop";
import { GeminiModel, LLMModel } from "../../providers/models";
import { logger } from "../../../utils/logger";

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
  actionSteps: string[] = [],
  model: LLMModel = GeminiModel.GEMINI_2_5_PRO
): Promise<ChatCompletionMessage> => {
  logger.debug("[ callLlmAgentLoop ] with", contents.length, "contents");

  const response = await callLlm(contents, model, TestTools);

  const toolCalls = response.tool_calls;

  if (toolCalls && toolCalls.length > 0) {
    contents[contents.length - 1].content = "Old Page Source";
    contents.push({
      role: "assistant",
      tool_calls: toolCalls,
    });

    logger.debug(
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

    logger.debug("[ callLlmAgentLoop ] calls executed, recursing");
    return await callLlmAgentLoop(newContents, driver, actionSteps, model);
  }

  logger.info(
    "[ Action steps taken ]",
    actionSteps.map(step => `[${step}]`).join("\n")
  );

  logger.debug("[ callLlmAgentLoop ] no function calls, returning");
  return response;
};
