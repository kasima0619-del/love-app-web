import { NextResponse } from "next/server";
import { getMessagesData } from "@/lib/server/messages-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getMessagesData();
  return NextResponse.json(data);
}
