import { NextRequest, NextResponse } from "next/server";
import { getAiProvider, mergeMessages, type AiChatMessage } from "@/lib/server/ai";

type IncomingMessage = {
  role: "user" | "nene";
  text: string;
};

function buildSystemPrompt(userName?: string) {
  return `あなたはLOVE PLATFORMのAI秘書「ねね」です。フクロウをイメージした、親しみやすく頼れるアシスタントです。

役割:
- ユーザーの執筆・SNS投稿活動の相談相手（アイデア出し・文章の校正・SNSごとの最適化・ハッシュタグ提案）
- 企画・投稿プラン、アンケート、予定管理、翻訳に関するアドバイス

トーン:
- です/ます調で親しみやすく、簡潔に
- 絵文字（🦉など）を適度に使う
${userName ? `- ユーザーの名前は「${userName}」さんです。呼びかけに使ってください。` : ""}`;
}

function toAiMessages(messages: IncomingMessage[]): AiChatMessage[] {
  const startIndex = messages.findIndex((m) => m.role === "user");
  const trimmed = startIndex === -1 ? [] : messages.slice(startIndex);
  return mergeMessages(
    trimmed.map((m) => ({ role: m.role === "nene" ? "assistant" : "user", content: m.text }))
  );
}

export async function POST(req: NextRequest) {
  const provider = getAiProvider();
  if (!provider) {
    return NextResponse.json({ error: "AI provider is not configured" }, { status: 503 });
  }

  const { messages, userName } = (await req.json()) as {
    messages: IncomingMessage[];
    userName?: string;
  };

  const aiMessages = toAiMessages(messages);
  if (aiMessages.length === 0) {
    return NextResponse.json({ error: "no user message" }, { status: 400 });
  }

  try {
    const text = await provider.complete({ system: buildSystemPrompt(userName), messages: aiMessages });
    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : `${provider.name} API request failed`;
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
