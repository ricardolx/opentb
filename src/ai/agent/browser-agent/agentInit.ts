import { callLlmAgentLoop } from "./";
import { GeminiModel, LLMModel } from "../../providers/models";
import { ChatCompletionMessageParam } from "openai/resources";
import { logger } from "../../../utils/logger";

/**
 * Initiate the agent
 * @param prompt
 * @param systemPrompt
 * @param driver
 * @param model
 * @returns
 */
export const callAgentInit = async (
  prompt: string,
  systemPrompt: string,
  driver: WebdriverIO.Browser,
  model: LLMModel = GeminiModel.GEMINI_2_5_PRO
) => {
  logger.debug("[ callAgentInit ] with", prompt.substring(0, 30), "...");

  const content: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const pageSource = await driver.getPageSource();
  // const base64Screenshot = await driver.saveScreenshot(`screen-first.png`);
  // const base64PageSource = base64Screenshot.toString("base64");

  content.push({
    role: "user",
    content: `Here is the page source: ${pageSource}`,
  });
  const actionSteps: string[] = [];

  const time = Date.now();
  const response = await callLlmAgentLoop(content, driver, actionSteps, model);
  const duration = Date.now() - time;

  logger.info("[ callLlmAgentLoop ] ✅ complete");
  logger.info(
    "[ Duration ] 🕒 ",
    duration > 60000 ? `${duration / 60000}m` : `${duration}ms`
  );

  return response;
};
