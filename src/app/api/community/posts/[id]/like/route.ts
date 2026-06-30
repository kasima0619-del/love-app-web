import { NextResponse } from "next/server";
import { togglePostLike } from "@/lib/server/community-store";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await togglePostLike(id);
  if (!post) {
    return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
  }
  return NextResponse.json({ post });
}
