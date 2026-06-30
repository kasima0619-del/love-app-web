import { NextRequest, NextResponse } from "next/server";
import { grantCoins } from "@/lib/server/love-coin-store";
import { ROUTER_REWARDS, type RouterRewardAction } from "@/lib/nene-router-demo";

const REWARD_LABELS: Record<RouterRewardAction, string> = {
  "schedule-create": "AIルーター：予定登録ボーナス",
  "instagram-post": "AIルーター：SNS投稿ボーナス",
  "community-share": "AIルーター：コミュニティ共有ボーナス",
};

export async function POST(req: NextRequest) {
  const { actionId } = (await req.json().catch(() => ({}))) as { actionId?: string };
  if (!actionId || !(actionId in ROUTER_REWARDS)) {
    return NextResponse.json({ error: "invalid actionId" }, { status: 400 });
  }

  const action = actionId as RouterRewardAction;
  const amount = ROUTER_REWARDS[action];
  const result = await grantCoins(amount, REWARD_LABELS[action]);
  return NextResponse.json({ amount, ...result });
}
