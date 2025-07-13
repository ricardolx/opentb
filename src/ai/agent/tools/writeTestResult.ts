import { ChatCompletionTool } from "openai/resources";

export const writeTestResultTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "write_test_result",
    description: "Write a test result message to the console",
    parameters: {
      type: "object",
      properties: {
        message: { type: "string", description: "The test result message" },
        success: {
          type: "boolean",
          description: "Whether the test was successful",
        },
      },
    },
  },
};
