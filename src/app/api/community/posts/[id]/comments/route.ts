import { NextResponse } from "next/server";
import { addPostComment } from "@/lib/server/community-store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { text } = (await req.json()) as { text?: string };

  if (!text || !text.trim()) {
    return NextResponse.json({ error: "text は必須です" }, { status: 400 });
  }

  const post = await addPostComment(id, text.trim());
  if (!post) {
    return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
  }
  return NextResponse.json({ post });
}
