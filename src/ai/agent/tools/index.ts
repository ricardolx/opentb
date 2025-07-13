import { elementActionTool } from "./elementAction";
import { waitTool } from "./wait";
import { writeErrorTool } from "./writeError";
import { writeTestResultTool } from "./writeTestResult";
import { ChatCompletionTool } from "openai/resources";

export const TestTools: ChatCompletionTool[] = [
  elementActionTool,
  waitTool,
  writeErrorTool,
  writeTestResultTool,
];
