import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/lib/server/matching-store";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { likedIds, matched, found } = await toggleLike(id);

  if (!found) {
    return NextResponse.json({ error: "profile not found" }, { status: 404 });
  }

  return NextResponse.json({ likedIds, matched });
}
