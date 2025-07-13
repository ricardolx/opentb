import { ChatCompletionTool } from "openai/resources";

export const elementActionTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "element_action",
    description:
      "Perform an action on an element in the mobile app. " +
      "Prioritize BUTTONS, INPUTS, and TEXT FIELDS when possible. " +
      "Follow the element identification hierarchy below for best results.",
    parameters: {
      type: "object",
      properties: {
        element_identifier: {
          type: "string",
          description:
            "Element selector following this priority order:\n" +
            "1. PREFERRED: Use testID if available (e.g., '~login-button')\n" +
            "2. GOOD: Use accessibility labels with XPath (e.g., '//*[contains(@label, \"Login\")]')\n" +
            "3. GOOD: Use element values with XPath (e.g., '//*[contains(@value, \"Submit\")]')\n" +
            "4. LAST RESORT: Use @name attribute or complex XPath selectors\n\n" +
            "IMPORTANT: Extract 1-2 key words from visible text, never use long text strings as identifiers.",
        },
        action: {
          type: "string",
          description: "The action to perform on the element",
          enum: [
            "click",
            "set_text",
            "clear_text",
            "scroll_into_view",
            "scroll_until_visible",
          ],
        },
        value: {
          type: "string",
          description: "The value to set on the element (required for set_text action)",
        },
      },
    },
  },
};

export type ElementAction = {
  element_identifier: string;
  action:
    | "click"
    | "set_text"
    | "clear_text"
    | "scroll_into_view"
    | "scroll_until_visible";
  value?: string;
};
