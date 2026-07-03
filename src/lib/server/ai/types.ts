export type AiImageBlock = {
  type: "image";
  source: { type: "base64"; media_type: string; data: string };
};

export type AiTextBlock = { type: "text"; text: string };

export type AiChatMessage = {
  role: "user" | "assistant";
  content: string | (AiImageBlock | AiTextBlock)[];
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
