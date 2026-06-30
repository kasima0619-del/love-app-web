import { NextRequest, NextResponse } from "next/server";
import { getLoveCoinData, sendCoins } from "@/lib/server/love-coin-store";

export async function GET() {
  const data = await getLoveCoinData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { amount, counterpart, message } = (await req.json().catch(() => ({}))) as {
    amount?: number;
    counterpart?: string;
    message?: string;
  };

  if (!amount || amount <= 0 || !counterpart?.trim()) {
    return NextResponse.json({ error: "amount と counterpart は必須です" }, { status: 400 });
  }

  const result = await sendCoins(amount, counterpart.trim(), message?.trim());
  if (!result.ok) {
    return NextResponse.json({ error: "残高が不足しています" }, { status: 400 });
  }
  return NextResponse.json(result);
}
