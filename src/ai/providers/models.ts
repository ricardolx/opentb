export enum GeminiModel {
  GEMINI_2_5_FLASH = "google/gemini-2.5-flash",
  GEMINI_2_5_PRO = "google/gemini-2.5-pro",
}
export enum OpenAIModel {
  GPT_4o = "openai/gpt-4o",
  GPT_4o_MINI = "openai/gpt-4o-mini",
  GPT_o3 = "openai/o3",
  GPT_o4_MINI_HIGH = "openai/o4-mini-high",
}

export enum AnthropicModel {
  CLAUDE_4_SONNET = "anthropic/claude-4-sonnet",
  CLAUDE_4_OPUS = "anthropic/claude-4-opus",
}

export enum GrokModel {
  GROK_3 = "xai/grok-3",
  GROK_4 = "xai/grok-4",
}

export type LLMModel = GeminiModel | OpenAIModel | AnthropicModel | GrokModel;