import { NextRequest, NextResponse } from "next/server";
import { recordUsage } from "@/lib/server/partner-store";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { usageLog, reward, found } = await recordUsage(id);

  if (!found) {
    return NextResponse.json({ error: "partner not found or not available" }, { status: 404 });
  }

  return NextResponse.json({ usageLog, reward });
}
