import type { AiCompletionInput, AiProvider } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";
const DEFAULT_TIMEOUT_MS = 45000;

export class ClaudeProvider implements AiProvider {
  readonly name = "claude";

  constructor(
    private readonly apiKey: string,
    private readonly model: string = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
    private readonly timeoutMs: number = Number(process.env.AI_REQUEST_TIMEOUT_MS ?? "") || DEFAULT_TIMEOUT_MS
  ) {}

  async complete({ system, messages, maxTokens = 1024 }: AiCompletionInput): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: maxTokens,
          system,
          messages,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Claude API request failed: ${detail}`);
      }

      const data = await response.json();
      return data.content?.find((block: { type: string }) => block.type === "text")?.text ?? "";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Claude API request timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
