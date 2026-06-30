import { ClaudeProvider } from "./claude-provider";
import { OpenAiProvider } from "./openai-provider";
import type { AiChatMessage, AiProvider } from "./types";

export type { AiChatMessage, AiCompletionInput, AiProvider } from "./types";

/**
 * 使用するAIプロバイダーを選択します。
 * AI_PROVIDER=openai（デフォルト）/ claude を環境変数で切り替え可能。
 * 対応するAPIキーが未設定の場合は null を返し、呼び出し側でフォールバック応答を行います。
 */
export function getAiProvider(): AiProvider | null {
  const providerName = (process.env.AI_PROVIDER || "openai").toLowerCase();

  if (providerName === "claude" || providerName === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    return apiKey ? new ClaudeProvider(apiKey) : null;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  return apiKey ? new OpenAiProvider(apiKey) : null;
}

/** 連続する同じroleのメッセージを結合する（Claude APIの role 交互制約に対応） */
export function mergeMessages(messages: AiChatMessage[]): AiChatMessage[] {
  const merged: AiChatMessage[] = [];
  for (const m of messages) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) {
      last.content += `\n${m.content}`;
    } else {
      merged.push({ ...m });
    }
  }
  return merged;
}

/** モデル応答からJSONオブジェクトを抽出する（コードブロックや前後の説明文に対応） */
export function extractJson<T>(text: string): T | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}
