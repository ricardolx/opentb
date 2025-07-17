import { ElementAction } from "../tools/elementAction";
import { elementActionToolCall } from "../tools/toolCalls";
import {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources";
import { logger } from "../../../utils/logger";

/**
 * Execute the webdriver function call loop
 * @param functionCalls
 * @param contents
 * @param driver
 * @param actionSteps
 * @returns
 */
export const executeWebDriverLoop = async (
  functionCalls: ChatCompletionMessageToolCall[],
  contents: ChatCompletionMessageParam[],
  driver: WebdriverIO.Browser,
  actionSteps: string[]
) => {
  logger.debug(
    "[ executeWebDriverLoop ] with",
    functionCalls.length,
    "function calls"
  );
  for (const functionCall of functionCalls) {
    logger.debug(
      "[ executeWebDriverLoop ] function call",
      functionCall.function.name
    );
    if (functionCall.function.name === "element_action") {
      const response = await elementActionToolCall(
        JSON.parse(functionCall.function.arguments) as ElementAction,
        driver
      );

      contents.push({
        role: "tool",
        tool_call_id: functionCall.id,
        content: response?.message ?? "",
      });

      actionSteps.push(response?.message ?? "");

      logger.log("[ executeWebDriverLoop ] actions taken", actionSteps.length);
    } else if (functionCall.function.name === "write_error") {
      logger.error(functionCall.function.arguments);

      contents.push({
        role: "tool",
        tool_call_id: functionCall.id,
        content: "Error written to log",
      });

      actionSteps.push(functionCall.function.arguments);
    } else if (functionCall.function.name === "write_test_result") {
      const { success, message } = JSON.parse(
        functionCall.function.arguments
      ) as { success: boolean; message: string };

      logger.info(`[ TEST RESULT ][ ${success ? "✅" : "❌"} ]`, message);

      contents.push({
        role: "tool",
        tool_call_id: functionCall.id,
        content: `Result written to log, test is ${
          success ? "✅" : "❌"
        }. End the test now.`,
      });

      actionSteps.push(message);
    } else if (functionCall.function.name === "wait") {
      await new Promise(resolve => setTimeout(resolve, 1000));

      contents.push({
        role: "tool",
        tool_call_id: functionCall.id,
        content: `Waited for ${functionCall.function.arguments} seconds`,
      });

      actionSteps.push(functionCall.function.arguments);
    } else {
      actionSteps.push("tool call not found:", functionCall.function.arguments);
      contents.push({
        role: "tool",
        tool_call_id: functionCall.id,
        content: `Tool call not found: ${functionCall.function.arguments}`,
      });
    }
  }
  await new Promise(resolve => setTimeout(resolve, 1000));

  const currentPageSource = await driver.getPageSource();

  contents.push({
    role: "user",
    content: currentPageSource,
  });
  addScreenshotToContents(contents, driver);

  logger.debug("[ added contents tool results ]", contents.length);
  await driver.waitUntil(
    async () => {
      const currentPageSource = await driver.getPageSource();
      return currentPageSource.length > 0;
    },
    { timeout: 1000, timeoutMsg: "Page source is not ready" }
  );

  logger.debug("[ added contents page source ]", contents.length);
  logger.debug("[ action steps taken ]", actionSteps.length);

  return contents;
};

/**
 * The jury is out on whether screenshots help or not
 * @param contents - the contents of the message
 * @param driver - the driver to use to take the screenshot
 */
const addScreenshotToContents = async (
  contents: ChatCompletionMessageParam[],
  driver: WebdriverIO.Browser
) => {
  return;
  const currentPageScreenshot = await driver.saveScreenshot(
    `screen-${Date.now()}.png`
  );
  const base64Screenshot = currentPageScreenshot.toString("base64");
  contents.push({
    role: "user",
    content: [
      {
        type: "text",
        text: "Current screenshot of the page:",
      },
      {
        type: "image_url",
        image_url: {
          url: `data:image/png;base64,${base64Screenshot}`,
        },
      },
    ],
  });
};
