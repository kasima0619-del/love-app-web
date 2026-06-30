import type { AiCompletionInput, AiProvider } from "./types";

const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_TIMEOUT_MS = 45000;

export class OpenAiProvider implements AiProvider {
  readonly name = "openai";

  constructor(
    private readonly apiKey: string,
    private readonly model: string = process.env.OPENAI_MODEL || DEFAULT_MODEL,
    private readonly timeoutMs: number = Number(process.env.AI_REQUEST_TIMEOUT_MS ?? "") || DEFAULT_TIMEOUT_MS
  ) {}

  async complete({ system, messages, maxTokens = 1024 }: AiCompletionInput): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: maxTokens,
          messages: [{ role: "system", content: system }, ...messages],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`OpenAI API request failed: ${detail}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? "";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`OpenAI API request timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
