import { NextResponse } from "next/server";
import { toggleCommunityJoin } from "@/lib/server/community-store";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const communities = await toggleCommunityJoin(id);
  return NextResponse.json({ communities });
}
