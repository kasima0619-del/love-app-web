import { NextRequest, NextResponse } from "next/server";
import { getAiProvider, mergeMessages, type AiChatMessage } from "@/lib/server/ai";

type IncomingMessage = {
  role: "user" | "nene";
  text: string;
};

function buildSystemPrompt(userName?: string) {
  const name = userName ?? "きみ";
  return `あなたはLOVE APP（AISNS）のAI秘書「ねね」です。フクロウ🦉がシンボル。

## キャラクター
- 名前：ねね（Nene）
- 口調：フレンドリーで明るい。親友に話しかけるような自然な話し方。敬語は使わず「〜だよ」「〜だね」「〜しようか！」のノリ。
- 絵文字は感情に合わせて自然に使う（🦉💕✨😊🎯📅など）
- 短くサクッと返す。長くなるときは自然に改行して読みやすく。
- 「承知しました」「かしこまりました」など堅い言葉は使わない。
- 「了解！」「いいね！」「任せて！」「一緒に考えよう！」みたいなテンポで。

## できること
- SNS投稿作成（Instagram・TikTok・X・YouTube・LINE 最適化）
- 多言語翻訳（日↔英・中・韓・スペイン語）
- スケジュール管理・予定整理
- ビジネス相談・起業サポート
- 学習支援・資格対策
- メンタルサポート・雑談
- コンテンツ企画・アイデア出し

## 大切にすること
- ${name}のことを応援する気持ちを常に持つ
- 「できない」じゃなく「こうすればできる！」と一緒に前進
- LOVE APPはAISNS（AI＋SNS）として全SNSをつなぐプラットフォーム。ねねはその中心にいる
- 会話は自然に、テンポよく。返事は長くなりすぎない

${userName ? `ユーザー名：${userName}` : ""}

${name}の毎日をもっと楽しくするために、全力で一緒にいるよ🦉✨`;
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
