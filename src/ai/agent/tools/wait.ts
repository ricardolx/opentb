import { ChatCompletionTool } from "openai/resources";

export const waitTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "wait",
    description:
      "Wait for a specified number of seconds. " +
      "If there is a timer that denotes time remaining, wait for it to complete. " +
      "Otherwise default to 1-3 seconds",
    parameters: {
      type: "object",
      properties: {
        seconds: {
          type: "number",
          description: "The number of seconds to wait",
        },
      },
    },
  },
};
