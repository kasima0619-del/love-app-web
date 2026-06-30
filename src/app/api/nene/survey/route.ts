import { NextRequest, NextResponse } from "next/server";
import { extractJson, getAiProvider } from "@/lib/server/ai";

type SurveyResult = { question: string; options: string[] };

function buildSystemPrompt() {
  return `あなたはLOVE PLATFORMのAI秘書「ねね」です。ユーザーが会員やコミュニティに向けて配信するアンケートを作成します。

出力は必ず次のJSON形式のみで返してください。説明文やコードブロックは付けないこと。
{"question": "アンケートの質問文", "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"]}

選択肢は3〜5個、回答者が選びやすい簡潔な表現にしてください。`;
}

export async function POST(req: NextRequest) {
  const provider = getAiProvider();
  if (!provider) {
    return NextResponse.json({ error: "AI provider is not configured" }, { status: 503 });
  }

  const { topic } = (await req.json()) as { topic?: string };
  if (!topic || !topic.trim()) {
    return NextResponse.json({ error: "topic は必須です" }, { status: 400 });
  }

  try {
    const raw = await provider.complete({
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: `アンケートのテーマ: ${topic.trim()}` }],
    });
    const result = extractJson<SurveyResult>(raw);
    if (!result?.question || !Array.isArray(result.options) || result.options.length === 0) {
      return NextResponse.json({ error: "AI応答の解析に失敗しました" }, { status: 502 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: `${provider.name} API request failed` }, { status: 502 });
  }
}
