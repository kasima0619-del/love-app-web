import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramSecret } from "@/lib/server/telegram";
import { receiveExternalMessage } from "@/lib/server/messages-store";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat: { id: number };
    from?: { first_name?: string; username?: string };
  };
};

export async function POST(req: NextRequest) {
  const secretToken = req.headers.get("x-telegram-bot-api-secret-token");
  if (!verifyTelegramSecret(secretToken)) {
    return NextResponse.json({ error: "invalid secret token" }, { status: 401 });
  }

  const update = (await req.json()) as TelegramUpdate;
  const message = update.message;

  if (message?.text) {
    await receiveExternalMessage({
      platform: "telegram",
      platformUserId: String(message.chat.id),
      displayName: message.from?.first_name ?? message.from?.username ?? "Telegramユーザー",
      text: message.text,
    });
  }

  return NextResponse.json({ ok: true });
}
