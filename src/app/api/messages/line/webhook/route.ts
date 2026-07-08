import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, getLineProfile } from "@/lib/server/line";
import { receiveExternalMessage } from "@/lib/server/messages-store";

type LineEvent = {
  type: string;
  message?: { type: string; text?: string };
  source?: { type: string; userId?: string };
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");

  if (!verifyLineSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const { events } = JSON.parse(rawBody) as { events: LineEvent[] };

  for (const event of events) {
    if (event.type !== "message" || event.message?.type !== "text" || !event.source?.userId) continue;

    const userId = event.source.userId;
    const profile = await getLineProfile(userId);

    await receiveExternalMessage({
      platform: "line",
      platformUserId: userId,
      displayName: profile?.displayName ?? "LINEユーザー",
      text: event.message.text ?? "",
    });
  }

  return NextResponse.json({ ok: true });
}
