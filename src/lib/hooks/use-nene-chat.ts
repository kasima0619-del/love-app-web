"use client";

// AI秘書ねねとのチャット状態・ロジックを共通化するフック。
// フローティングウィジェット（NeneAvatarWidget）とホーム画面のチャットファーストUI（NeneHomeChat）の
// 両方から利用し、「ユーザー→ねね→サービス」の応答フローを一箇所で管理する。

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resolveNeneAction } from "@/lib/nene-router";
import {
  buildInstagramPostDemo,
  buildScheduleDemoEvent,
  describeScheduleDemoEvent,
  isPostCreateRequest,
  isScheduleCreateRequest,
  requestCommunityShare,
  requestRouterReward,
  type ScheduleDemoEvent,
} from "@/lib/nene-router-demo";
import { addDemoScheduleEvent } from "@/lib/demo-schedule-store";
import { notifyLoveCoinUpdated } from "@/lib/hooks/use-love-coin";

export type NeneChatMessage = {
  id: string;
  role: "nene" | "user";
  text: string;
};

export const NENE_GREETING =
  "こんにちは💕\nAI秘書ねねです。\n人とサービスをつなぐお手伝いをします。";

export const NENE_QUICK_PROMPTS = [
  { label: "🗓️ 明日の予定作って", prompt: "明日の予定作って" },
  { label: "✍️ Instagram投稿作って", prompt: "Instagram投稿作って" },
  { label: "📋 アンケートを作る", prompt: "アンケートを作りたい" },
  { label: "👥 コミュニティを探したい", prompt: "コミュニティを探したい" },
];

const FALLBACK_REPLIES = [
  "なるほど、承知しました🦉 もっと詳しくお話したい場合は「ねね」ページからチャットを続けられますよ。",
  "お任せください💕 続きは「ねね」ページでじっくりサポートしますね。",
  "ありがとうございます🦉 詳しいご相談は「ねね」ページからどうぞ。",
];

let messageId = 0;
function nextId() {
  messageId += 1;
  return `nene-chat-${messageId}`;
}

let fallbackIndex = 0;

export function useNeneChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<NeneChatMessage[]>(() => [
    { id: nextId(), role: "nene", text: NENE_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingSchedule, setPendingSchedule] = useState<ScheduleDemoEvent | null>(null);
  const [pendingCommunityShare, setPendingCommunityShare] = useState<string | null>(null);

  function appendMessage(role: NeneChatMessage["role"], text: string) {
    setMessages((prev) => [...prev, { id: nextId(), role, text }]);
  }

  async function grantAndAnnounce(actionId: "schedule-create" | "instagram-post") {
    const reward = await requestRouterReward(actionId);
    appendMessage("nene", `💗 LOVE COINを獲得しました！（+${reward.amount} LOVE）`);
    notifyLoveCoinUpdated();
  }

  async function approveSchedule() {
    if (!pendingSchedule) return;
    const event = addDemoScheduleEvent(pendingSchedule);
    setPendingSchedule(null);
    appendMessage("nene", `✅ スケジュールに登録しました！\n${describeScheduleDemoEvent(event)}`);
    await grantAndAnnounce("schedule-create");
  }

  function cancelSchedule() {
    setPendingSchedule(null);
    appendMessage("nene", "承知しました🦉 また必要になったらいつでも声をかけてくださいね。");
  }

  async function approveCommunityShare() {
    if (!pendingCommunityShare) return;
    const text = pendingCommunityShare;
    setPendingCommunityShare(null);
    const { post, amount } = await requestCommunityShare(text);
    appendMessage(
      "nene",
      `🎉「${post.community}」コミュニティに共有しました！\n早速 ${post.likes}件のいいね が届いています💗`
    );
    appendMessage("nene", `💗 LOVE COINを獲得しました！（+${amount} LOVE）`);
    notifyLoveCoinUpdated();
  }

  function cancelCommunityShare() {
    setPendingCommunityShare(null);
    appendMessage("nene", "承知しました🦉 投稿はいつでもコミュニティから共有できますよ。");
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    appendMessage("user", trimmed);
    setInput("");
    setIsTyping(true);

    if (isScheduleCreateRequest(trimmed)) {
      const demo = buildScheduleDemoEvent(trimmed);
      setTimeout(() => {
        appendMessage("nene", `🗓️ こちらの予定をスケジュールに登録しますか？\n${describeScheduleDemoEvent(demo)}`);
        setIsTyping(false);
        setPendingSchedule(demo);
      }, 700);
      return;
    }

    if (isPostCreateRequest(trimmed)) {
      const postText = buildInstagramPostDemo();
      setTimeout(async () => {
        appendMessage("nene", `✍️ Instagram投稿が完成しました！\n\n${postText}`);
        setIsTyping(false);
        await grantAndAnnounce("instagram-post");
        appendMessage("nene", "🌐 この投稿をコミュニティで共有しますか？");
        setPendingCommunityShare(postText);
      }, 700);
      return;
    }

    const action = resolveNeneAction(trimmed);
    if (action) {
      setTimeout(() => {
        appendMessage("nene", action.message);
        setIsTyping(false);
        setTimeout(() => router.push(action.path), 900);
      }, 600);
      return;
    }

    setTimeout(() => {
      const reply = FALLBACK_REPLIES[fallbackIndex % FALLBACK_REPLIES.length];
      fallbackIndex += 1;
      appendMessage("nene", reply);
      setIsTyping(false);
    }, 700);
  }

  return {
    messages,
    input,
    setInput,
    isTyping,
    send,
    pendingSchedule,
    approveSchedule,
    cancelSchedule,
    pendingCommunityShare,
    approveCommunityShare,
    cancelCommunityShare,
  };
}
