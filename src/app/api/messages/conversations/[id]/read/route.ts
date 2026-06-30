import { NextResponse } from "next/server";
import { markConversationRead } from "@/lib/server/messages-store";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await markConversationRead(id);
  if (!conversation) {
    return NextResponse.json({ error: "会話が見つかりません" }, { status: 404 });
  }
  return NextResponse.json({ conversation });
}
