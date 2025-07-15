import { callLlmAgentLoop } from "./";
import { GeminiModel, LLMModel } from "../../providers/models";
import { ChatCompletionMessageParam } from "openai/resources";

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
  console.log("[ callAgentInit ] with", prompt.substring(0, 30), "...");

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

  const time = Date.now();
  const response = await callLlmAgentLoop(content, driver, model);
  const duration = Date.now() - time;

  console.log("[ callLlmAgentLoop ] ✅ complete");
  console.log(
    "[ Duration ] 🕒 ",
    duration > 60000 ? `${duration / 60000}m` : `${duration}ms`
  );

  return response;
};
