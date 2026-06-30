import { NextRequest, NextResponse } from "next/server";
import { extractJson, getAiProvider } from "@/lib/server/ai";
import { postCategories } from "@/lib/mock-data";

type PostResult = { text: string };

function buildSystemPrompt() {
  return `あなたはLOVE PLATFORMのAI秘書「ねね」です。ユーザーのコミュニティ投稿文を作成します。

出力は必ず次のJSON形式のみで返してください。説明文やコードブロックは付けないこと。
{"text": "投稿本文（最後に関連ハッシュタグを2〜4個含める）"}

投稿カテゴリーの例: ${postCategories.join("、")}
トーン: です/ます調、絵文字を適度に使い、読み手が共感しやすい文章にしてください。`;
}

export async function POST(req: NextRequest) {
  const provider = getAiProvider();
  if (!provider) {
    return NextResponse.json({ error: "AI provider is not configured" }, { status: 503 });
  }

  const { topic, category } = (await req.json()) as { topic?: string; category?: string };
  if (!topic || !topic.trim()) {
    return NextResponse.json({ error: "topic は必須です" }, { status: 400 });
  }

  const userPrompt = `投稿のテーマ: ${topic.trim()}${category ? `\nカテゴリー: ${category}` : ""}`;

  try {
    const raw = await provider.complete({
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: userPrompt }],
    });
    const result = extractJson<PostResult>(raw);
    if (!result?.text) {
      return NextResponse.json({ error: "AI応答の解析に失敗しました" }, { status: 502 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: `${provider.name} API request failed` }, { status: 502 });
  }
}
