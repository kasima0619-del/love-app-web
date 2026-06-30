import { NextResponse } from "next/server";
import { findOrCreateConversation } from "@/lib/server/messages-store";

export async function POST(req: Request) {
  const { userId } = (await req.json()) as { userId?: string };

  if (!userId) {
    return NextResponse.json({ error: "userId は必須です" }, { status: 400 });
  }

  const result = await findOrCreateConversation(userId);
  if (!result) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }
  return NextResponse.json(result);
}
