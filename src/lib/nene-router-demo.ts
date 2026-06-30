// AIルーターデモ（Phase5）: 「予定作って」「Instagram投稿作って」のような依頼を判定し、
// ねねが確認 → 実行 → LOVE COIN付与 までを案内する「AIハブ」体験のデモ用ロジック。
// 実際のAI接続は不要で、固定の確認文・生成内容を返すデモ実装。

import { currentUser, scheduleWeekDays, type CalendarEvent, type CommunityPost } from "@/lib/mock-data";

export const ROUTER_REWARDS = {
  "schedule-create": 10,
  "instagram-post": 50,
  "community-share": 20,
} as const;

export type RouterRewardAction = keyof typeof ROUTER_REWARDS;

// コミュニティ連携デモ（Phase6）でAI生成の投稿を共有する先のコミュニティ
export const COMMUNITY_SHARE_TARGET = {
  community: "写真投稿サークル",
  category: "クリエイティブ",
};

const SCHEDULE_KEYWORDS = [
  "予定作って",
  "予定を作って",
  "予定入れて",
  "予定を入れて",
  "予定組んで",
  "予定を組んで",
  "スケジュール作って",
  "スケジュールを作って",
];

const POST_KEYWORDS = [
  "instagram投稿",
  "インスタ投稿",
  "インスタグラム投稿",
  "投稿作って",
  "投稿を作って",
  "投稿文作って",
  "投稿文を作って",
];

export function isScheduleCreateRequest(input: string): boolean {
  const text = input.toLowerCase();
  return SCHEDULE_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function isPostCreateRequest(input: string): boolean {
  const text = input.toLowerCase();
  return POST_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()));
}

export type ScheduleDemoEvent = Omit<CalendarEvent, "id">;

export function buildScheduleDemoEvent(input: string): ScheduleDemoEvent {
  const day = input.includes("明日") ? 1 : 0;
  return {
    day,
    startHour: 10,
    endHour: 11,
    title: "ねねが提案した予定（作業時間の確保）",
    color: "pink",
    reminder: true,
  };
}

export function describeScheduleDemoEvent(event: ScheduleDemoEvent): string {
  const day = scheduleWeekDays[event.day];
  return `${day.label}曜日（${day.date}） ${event.startHour}:00-${event.endHour}:00\n「${event.title}」`;
}

export function buildInstagramPostDemo(): string {
  return [
    "今日も小さな発見がありました📷✨",
    "AI秘書「ねね」と一緒に、日々の出来事をシェアしていきます。",
    "",
    "#LOVEアプリ #AI秘書ねね #今日のひとこと",
  ].join("\n");
}

/**
 * AIルーターデモのアクション完了時にLOVE COINを付与する。
 * APIが利用できない場合もデモ体験を止めないよう、固定の付与額にフォールバックする。
 */
export async function requestRouterReward(
  actionId: "schedule-create" | "instagram-post"
): Promise<{ amount: number }> {
  try {
    const res = await fetch("/api/nene/router-action", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ actionId }),
    });
    if (!res.ok) throw new Error("failed");
    return (await res.json()) as { amount: number };
  } catch {
    return { amount: ROUTER_REWARDS[actionId] };
  }
}

/**
 * コミュニティでの反応（いいね数）をデモ用に生成する。
 */
export function demoCommunityLikes(): number {
  return Math.floor(Math.random() * 6) + 3; // 3〜8件
}

/**
 * AIが作成した投稿をコミュニティへ共有するデモ。
 * 実際にコミュニティ投稿を作成しLOVE COINを付与する。
 * APIが利用できない場合もデモ体験を止めないよう、ローカル生成にフォールバックする。
 */
export async function requestCommunityShare(text: string): Promise<{
  post: CommunityPost;
  amount: number;
}> {
  try {
    const res = await fetch("/api/nene/community-share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("failed");
    return (await res.json()) as { post: CommunityPost; amount: number };
  } catch {
    return {
      post: {
        id: `cp-demo-${Date.now()}`,
        community: COMMUNITY_SHARE_TARGET.community,
        category: COMMUNITY_SHARE_TARGET.category,
        author: currentUser.name,
        avatarInitial: currentUser.avatarInitial,
        text,
        time: "たった今",
        likes: demoCommunityLikes(),
        liked: false,
        comments: [],
      },
      amount: ROUTER_REWARDS["community-share"],
    };
  }
}
