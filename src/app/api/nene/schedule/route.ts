import { NextRequest, NextResponse } from "next/server";
import { extractJson, getAiProvider } from "@/lib/server/ai";
import { scheduleWeekDays } from "@/lib/mock-data";

type ScheduleResult = {
  title: string;
  day: number;
  startHour: number;
  endHour: number;
  color: "pink" | "navy" | "gold";
  reminder: boolean;
  note: string;
};

const COLORS = ["pink", "navy", "gold"];

function buildSystemPrompt() {
  return `あなたはLOVE PLATFORMのAI秘書「ねね」です。ユーザーの要望から週間スケジュールに追加する予定を1件作成します。

出力は必ず次のJSON形式のみで返してください。説明文やコードブロックは付けないこと。
{"title": "予定タイトル", "day": 0-6の整数, "startHour": 0-23の整数, "endHour": 0-23の整数, "color": "pink"|"navy"|"gold", "reminder": true|false, "note": "ねねからの一言アドバイス"}

day は 0=月曜 ... 6=日曜 とします（対応表: ${scheduleWeekDays
    .map((d, i) => `${i}=${d.label}`)
    .join(", ")}）。
endHour は startHour より後にしてください。`;
}

export async function POST(req: NextRequest) {
  const provider = getAiProvider();
  if (!provider) {
    return NextResponse.json({ error: "AI provider is not configured" }, { status: 503 });
  }

  const { description } = (await req.json()) as { description?: string };
  if (!description || !description.trim()) {
    return NextResponse.json({ error: "description は必須です" }, { status: 400 });
  }

  try {
    const raw = await provider.complete({
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: `予定の内容: ${description.trim()}` }],
    });
    const result = extractJson<ScheduleResult>(raw);
    if (
      !result?.title ||
      typeof result.day !== "number" ||
      typeof result.startHour !== "number" ||
      typeof result.endHour !== "number" ||
      !COLORS.includes(result.color)
    ) {
      return NextResponse.json({ error: "AI応答の解析に失敗しました" }, { status: 502 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: `${provider.name} API request failed` }, { status: 502 });
  }
}
