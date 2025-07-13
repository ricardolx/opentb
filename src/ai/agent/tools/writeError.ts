import { ChatCompletionTool } from "openai/resources";

export const writeErrorTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "write_error",
    description: "Write an error message to the console",
    parameters: {
      type: "object",
      properties: {
        message: { type: "string", description: "The error message" },
      },
    },
  },
};
