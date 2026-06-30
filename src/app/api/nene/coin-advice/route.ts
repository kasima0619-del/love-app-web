import { NextRequest, NextResponse } from "next/server";
import { getAiProvider } from "@/lib/server/ai";
import { getLoveCoinData } from "@/lib/server/love-coin-store";

function buildSystemPrompt(loveCoin: Awaited<ReturnType<typeof getLoveCoinData>>) {
  return `あなたはLOVE PLATFORMのAI秘書「ねね」です。ユーザーのLOVE COIN活用について、温かく具体的にアドバイスしてください。

現在の状況:
- 残高: ${loveCoin.balance.toLocaleString()} LOVE COIN
- ランク: ${loveCoin.rank}（次のランク「${loveCoin.nextRank}」まであと${(loveCoin.nextRankTarget - loveCoin.balance).toLocaleString()}）
- 今月の獲得: ${loveCoin.monthlyEarned.toLocaleString()} LOVE COIN

トーン:
- です/ます調で親しみやすく、簡潔に（3〜5文程度）
- 絵文字（🦉💗など）を適度に使う`;
}

export async function POST(req: NextRequest) {
  const provider = getAiProvider();
  if (!provider) {
    return NextResponse.json({ error: "AI provider is not configured" }, { status: 503 });
  }

  const { question } = (await req.json().catch(() => ({}))) as { question?: string };
  const loveCoin = await getLoveCoinData();

  try {
    const advice = await provider.complete({
      system: buildSystemPrompt(loveCoin),
      messages: [
        {
          role: "user",
          content: question?.trim() || "LOVE COINを増やすコツを教えてください",
        },
      ],
    });
    return NextResponse.json({ advice });
  } catch {
    return NextResponse.json({ error: `${provider.name} API request failed` }, { status: 502 });
  }
}
