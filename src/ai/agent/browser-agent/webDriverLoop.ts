import { ElementAction } from "../tools/elementAction";
import { elementActionToolCall } from "../tools/toolCalls";
import {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources";

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
  console.log(
    "[ executeWebDriverLoop ] with",
    functionCalls.length,
    "function calls"
  );
  for (const functionCall of functionCalls) {
    console.log(
      "[ executeWebDriverLoop ] function call",
      functionCall.function.name,
      functionCall.function.arguments
    );
    let functionResponse: ChatCompletionMessageToolCall;
    if (functionCall.function.name === "element_action") {
      const response = await elementActionToolCall(
        JSON.parse(functionCall.function.arguments) as ElementAction,
        driver
      );
      actionSteps.push(response?.message ?? "");
      console.log("[ executeWebDriverLoop ] actions taken", actionSteps.length);

      functionResponse = {
        id: functionCall.id,
        function: functionCall.function,
        type: functionCall.type,
      };
      console.log(
        "[ executeWebDriverLoop ] function response",
        functionResponse.function.arguments
      );

      const currentPageSource = await driver.getPageSource();
      contents = [
        contents[0],
        contents[1],
        {
          role: "tool",
          tool_call_id: functionCall.id,
          content: response?.message ?? "",
        },
      ];

      contents.push({
        role: "user",
        content: currentPageSource,
      });
      await addScreenshotToContents(contents, driver);
    } else if (functionCall.function.name === "write_error") {
      console.error(functionCall.function.arguments);
      contents.push({
        role: "tool",
        tool_call_id: functionCall.id,
        content: functionCall.function.arguments,
      });
      contents.push({
        role: "tool",
        tool_call_id: functionCall.id,
        content: functionCall.function.arguments,
      });
    } else if (functionCall.function.name === "write_test_result") {
      const { success, message } = JSON.parse(
        functionCall.function.arguments
      ) as { success: boolean; message: string };
      console.log(`[ TEST RESULT ][ ${success ? "✅" : "❌"} ]`, message);

      contents.push({
        role: "tool",
        tool_call_id: functionCall.id,
        content: functionCall.function.arguments,
      });
      contents.push({
        role: "tool",
        tool_call_id: functionCall.id,
        content: functionCall.function.arguments,
      });
    } else if (functionCall.function.name === "wait") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      contents = [
        contents[0],
        {
          role: "tool",
          tool_call_id: functionCall.id,
          content: `Steps taken: ${actionSteps.join("\n")}`,
        },
      ];
      const currentPageSource = await driver.getPageSource();

      contents.push({
        role: "user",
        content: currentPageSource,
      });

      await addScreenshotToContents(contents, driver);
    } else {
      functionResponse = {
        id: functionCall.id,
        function: functionCall.function,
        type: functionCall.type,
      };
    }

    console.log("[ added contents tool results ]", contents.length);
    await driver.waitUntil(
      async () => {
        const currentPageSource = await driver.getPageSource();
        return currentPageSource.length > 0;
      },
      { timeout: 1000, timeoutMsg: "Page source is not ready" }
    );
  }

  console.log("[ added contents page source ]", contents.length);

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
    content: base64Screenshot,
  });
};
