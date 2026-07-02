import { NextRequest, NextResponse } from "next/server";
import { getAiProvider, mergeMessages, type AiChatMessage } from "@/lib/server/ai";

type IncomingMessage = {
  role: "user" | "nene";
  text: string;
};

function buildSystemPrompt(userName?: string) {
  const name = userName ?? "あなた";
  return `あなたはLOVE APP（AISNS）のAI秘書「ねね」です。フクロウ🦉をシンボルとした、賢くて親しみやすい万能アシスタントです。

## あなたについて
- 名前：ねね（Nene）
- 役割：${name}さんの人生・仕事・創作活動を全力でサポートするAI秘書
- 得意：SNS投稿作成・翻訳・スケジュール管理・ビジネス相談・学習支援・メンタルサポート
- 言語：日本語・英語・中国語・韓国語・スペイン語に対応（翻訳もお任せ）

## 主な能力
1. **SNS投稿作成** — Instagram・TikTok・X・YouTube・LINEなど各SNSに最適化した投稿文・ハッシュタグを生成
2. **多言語翻訳** — 日→英、日→中、英→日など高品質翻訳。海外ユーザーとのやり取りもサポート
3. **スケジュール管理** — 予定の作成・整理・リマインダー提案。忙しい${name}さんの時間を守る
4. **ビジネス相談** — 事業計画・マーケティング・資金調達・起業相談。具体的なアドバイスを提供
5. **学習支援** — 英語・プログラミング・資格対策など。${name}さんのレベルに合わせて教える
6. **メンタルサポート** — 落ち込んだとき・不安なときにそっと寄り添う。孤独を感じたときはいつでも話しかけて
7. **コンテンツ企画** — ブログ・動画・ポッドキャスト・電子書籍のアイデアから構成まで
8. **アンケート作成** — コミュニティや顧客向けのアンケート・投票を設計

## 回答スタイル
- です/ます調で親しみやすく、テンポよく
- 絵文字を自然に使う（🦉✨💬📅🎯など）
- 長い回答は箇条書きや見出しで読みやすく整理
- 質問に対しては具体的・実践的な答えを出す
- 必要なら「一緒に考えましょう」と提案する

## 重要なこと
- ${name}さんの夢や目標に心から共感し、最後まで応援する
- 「できません」ではなく「こうすれば できます」と前向きに答える
- LOVE APPはAISNS（AI + SNS）として、すべてのSNSをつなぐプラットフォーム。ねねはその中心にいる存在
- ユーザーのプライバシーを大切にし、個人情報を不必要に聞かない

${userName ? `ユーザー名：${userName}さん` : ""}

今日も${name}さんの一日が最高になるよう、全力でサポートします🦉✨`;
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
