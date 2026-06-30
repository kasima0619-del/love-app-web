export type AiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AiCompletionInput = {
  system: string;
  messages: AiChatMessage[];
  maxTokens?: number;
};

export interface AiProvider {
  readonly name: string;
  complete(input: AiCompletionInput): Promise<string>;
}
