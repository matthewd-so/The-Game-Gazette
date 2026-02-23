import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AiResponse {
  content: string;
  promptTokens: number;
  completionTokens: number;
  model: string;
}

export async function askClaude(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<AiResponse> {
  const {
    model = "claude-sonnet-4-20250514",
    maxTokens = 4096,
    temperature = 0.7,
  } = options;

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textContent = response.content.find((c) => c.type === "text");

  return {
    content: textContent?.text || "",
    promptTokens: response.usage.input_tokens,
    completionTokens: response.usage.output_tokens,
    model,
  };
}

export { anthropic };
