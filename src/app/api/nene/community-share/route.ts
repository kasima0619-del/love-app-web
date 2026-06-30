import { NextRequest, NextResponse } from "next/server";
import { createCommunityPost } from "@/lib/server/community-store";
import { grantCoins } from "@/lib/server/love-coin-store";
import { COMMUNITY_SHARE_TARGET, ROUTER_REWARDS, demoCommunityLikes } from "@/lib/nene-router-demo";

export async function POST(req: NextRequest) {
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  if (!text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const post = await createCommunityPost({
    community: COMMUNITY_SHARE_TARGET.community,
    category: COMMUNITY_SHARE_TARGET.category,
    text,
    likes: demoCommunityLikes(),
  });

  const amount = ROUTER_REWARDS["community-share"];
  const result = await grantCoins(amount, "AIルーター：コミュニティ共有ボーナス");
  return NextResponse.json({ post, amount, ...result });
}
