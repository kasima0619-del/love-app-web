"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import {
  currentUser,
  initialChatMessages,
  postCategories,
  quickPrompts,
  scheduleWeekDays,
  type CalendarEvent,
  type ChatMessage,
} from "@/lib/mock-data";
import { useLoveCoin, notifyLoveCoinUpdated, type LoveCoinData } from "@/lib/hooks/use-love-coin";
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

const NENE_REPLIES = [
  "なるほど、いいですね！その内容でドラフトを作ってみましょうか🦉",
  "承知しました。少し文章を整えてみますね。投稿前に内容をご確認ください。",
  "それは素敵なアイデアですね✨ 関連するハッシュタグも一緒に考えてみます。",
  "投稿画面にプリセットすることもできますよ。準備ができたら教えてくださいね。",
];

const AI_FALLBACK_NOTE = "※ AI接続が未設定のため、サンプル内容を表示しています。";

type Tab = "chat" | "post" | "survey" | "schedule" | "coin";

const TABS: { id: Tab; label: string }[] = [
  { id: "chat", label: "💬 チャット" },
  { id: "post", label: "✍️ 投稿文作成" },
  { id: "survey", label: "📋 アンケート作成" },
  { id: "schedule", label: "📅 予定作成" },
  { id: "coin", label: "💗 LOVE COINアドバイス" },
];

const eventColorStyles: Record<CalendarEvent["color"], string> = {
  pink: "bg-love-pink text-white",
  navy: "bg-love-navy text-white",
  gold: "bg-love-gold text-love-navy",
};

type SurveyResult = { question: string; options: string[] };
type ScheduleResult = {
  title: string;
  day: number;
  startHour: number;
  endHour: number;
  color: CalendarEvent["color"];
  reminder: boolean;
  note: string;
};

let replyIndex = 0;
let messageIdCounter = initialChatMessages.length;

function nextMessageId(suffix: string) {
  messageIdCounter += 1;
  return `m-${messageIdCounter}${suffix}`;
}

function fallbackPostText(topic: string, category: string) {
  const hashtag = topic.replace(/\s+/g, "");
  return `${topic}について、最近感じたことをシェアします☕✨\nみなさんはどう思いますか？コメントで教えてください！\n\n#${hashtag} #${category}`;
}

function fallbackSurvey(topic: string): SurveyResult {
  return {
    question: `「${topic}」について、どう思いますか？`,
    options: ["とても良いと思う", "良いと思う", "普通", "あまり良くないと思う"],
  };
}

function fallbackSchedule(description: string): ScheduleResult {
  return {
    title: description,
    day: 0,
    startHour: 10,
    endHour: 11,
    color: "pink",
    reminder: true,
    note: "まずは1時間で仮登録しました🦉 詳細が決まったらスケジュール画面で調整してくださいね。",
  };
}

function fallbackCoinAdvice(loveCoin: LoveCoinData) {
  const remaining = loveCoin.nextRankTarget - loveCoin.balance;
  return `現在${loveCoin.balance.toLocaleString()} LOVE COIN、ランクは「${loveCoin.rank}」ですね💗 次のランク「${loveCoin.nextRank}」まであと${remaining.toLocaleString()}コインです。コミュニティ投稿やアンケート回答、ログインボーナスをコツコツ積み重ねていきましょう🦉`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function AiPartnerPage() {
  const router = useRouter();
  const loveCoin = useLoveCoin();
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  // チャット
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingSchedule, setPendingSchedule] = useState<ScheduleDemoEvent | null>(null);
  const [pendingCommunityShare, setPendingCommunityShare] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 投稿文作成
  const [postTopic, setPostTopic] = useState("");
  const [postCategory, setPostCategory] = useState(postCategories[0]);
  const [postResult, setPostResult] = useState<string | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postNote, setPostNote] = useState<string | null>(null);

  // アンケート作成
  const [surveyTopic, setSurveyTopic] = useState("");
  const [surveyResult, setSurveyResult] = useState<SurveyResult | null>(null);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyNote, setSurveyNote] = useState<string | null>(null);

  // 予定作成
  const [scheduleDesc, setScheduleDesc] = useState("");
  const [scheduleResult, setScheduleResult] = useState<ScheduleResult | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleNote, setScheduleNote] = useState<string | null>(null);

  // LOVE COINアドバイス
  const [coinQuestion, setCoinQuestion] = useState("");
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [coinLoading, setCoinLoading] = useState(false);
  const [coinNote, setCoinNote] = useState<string | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleCopy(key: string, text: string) {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(key);
      setTimeout(() => setCopied((prev) => (prev === key ? null : prev)), 1500);
    }
  }

  function appendNeneMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: nextMessageId("-nene"),
        role: "nene",
        text,
        time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  async function grantAndAnnounce(actionId: "schedule-create" | "instagram-post") {
    const reward = await requestRouterReward(actionId);
    appendNeneMessage(`💗 LOVE COINを獲得しました！（+${reward.amount} LOVE）`);
    notifyLoveCoinUpdated();
  }

  async function approveSchedule() {
    if (!pendingSchedule) return;
    const event = addDemoScheduleEvent(pendingSchedule);
    setPendingSchedule(null);
    appendNeneMessage(`✅ スケジュールに登録しました！\n${describeScheduleDemoEvent(event)}`);
    await grantAndAnnounce("schedule-create");
  }

  function cancelSchedule() {
    setPendingSchedule(null);
    appendNeneMessage("承知しました🦉 また必要になったらいつでも声をかけてくださいね。");
  }

  async function approveCommunityShare() {
    if (!pendingCommunityShare) return;
    const text = pendingCommunityShare;
    setPendingCommunityShare(null);
    const { post, amount } = await requestCommunityShare(text);
    appendNeneMessage(
      `🎉「${post.community}」コミュニティに共有しました！\n早速 ${post.likes}件のいいね が届いています💗`
    );
    appendNeneMessage(`💗 LOVE COINを獲得しました！（+${amount} LOVE）`);
    notifyLoveCoinUpdated();
  }

  function cancelCommunityShare() {
    setPendingCommunityShare(null);
    appendNeneMessage("承知しました🦉 投稿はいつでもコミュニティから共有できますよ。");
  }

  async function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: nextMessageId(""),
      role: "user",
      text,
      time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
    };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setIsTyping(true);

    const appendNeneReply = (replyText: string) => {
      appendNeneMessage(replyText);
      setIsTyping(false);
    };

    if (isScheduleCreateRequest(text)) {
      const demo = buildScheduleDemoEvent(text);
      setTimeout(() => {
        appendNeneReply(`🗓️ こちらの予定をスケジュールに登録しますか？\n${describeScheduleDemoEvent(demo)}`);
        setPendingSchedule(demo);
      }, 600);
      return;
    }

    if (isPostCreateRequest(text)) {
      const postText = buildInstagramPostDemo();
      setTimeout(async () => {
        appendNeneReply(`✍️ Instagram投稿が完成しました！\n\n${postText}`);
        await grantAndAnnounce("instagram-post");
        appendNeneMessage("🌐 この投稿をコミュニティで共有しますか？");
        setPendingCommunityShare(postText);
      }, 600);
      return;
    }

    // AIアクションルーター: メッセージ内容から該当する機能画面へ誘導する
    const action = resolveNeneAction(text);
    if (action) {
      setTimeout(() => {
        appendNeneReply(action.message);
        setTimeout(() => router.push(action.path), 1000);
      }, 600);
      return;
    }

    try {
      const res = await fetch("/api/nene", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, text }) => ({ role, text })),
          userName: currentUser.name,
        }),
      });

      if (!res.ok) throw new Error("nene api unavailable");

      const data = await res.json();
      appendNeneReply(data.text);
    } catch {
      // AI未接続時、またはAPIエラー時は固定応答にフォールバック
      setTimeout(() => {
        const reply = NENE_REPLIES[replyIndex % NENE_REPLIES.length];
        replyIndex += 1;
        appendNeneReply(reply);
      }, 900);
    }
  }

  async function generatePost() {
    if (!postTopic.trim() || postLoading) return;
    setPostLoading(true);
    setPostNote(null);
    try {
      const res = await fetch("/api/nene/post", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: postTopic, category: postCategory }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { text: string };
      setPostResult(data.text);
    } catch {
      setPostResult(fallbackPostText(postTopic.trim(), postCategory));
      setPostNote(AI_FALLBACK_NOTE);
    } finally {
      setPostLoading(false);
    }
  }

  async function generateSurvey() {
    if (!surveyTopic.trim() || surveyLoading) return;
    setSurveyLoading(true);
    setSurveyNote(null);
    try {
      const res = await fetch("/api/nene/survey", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: surveyTopic }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as SurveyResult;
      setSurveyResult(data);
    } catch {
      setSurveyResult(fallbackSurvey(surveyTopic.trim()));
      setSurveyNote(AI_FALLBACK_NOTE);
    } finally {
      setSurveyLoading(false);
    }
  }

  async function generateSchedule() {
    if (!scheduleDesc.trim() || scheduleLoading) return;
    setScheduleLoading(true);
    setScheduleNote(null);
    try {
      const res = await fetch("/api/nene/schedule", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ description: scheduleDesc }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as ScheduleResult;
      setScheduleResult(data);
    } catch {
      setScheduleResult(fallbackSchedule(scheduleDesc.trim()));
      setScheduleNote(AI_FALLBACK_NOTE);
    } finally {
      setScheduleLoading(false);
    }
  }

  async function generateCoinAdvice() {
    if (coinLoading) return;
    setCoinLoading(true);
    setCoinNote(null);
    try {
      const res = await fetch("/api/nene/coin-advice", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: coinQuestion }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { advice: string };
      setCoinResult(data.advice);
    } catch {
      setCoinResult(fallbackCoinAdvice(loveCoin));
      setCoinNote(AI_FALLBACK_NOTE);
    } finally {
      setCoinLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-screen">
      <TopBar
        title="AI秘書「ねね」"
        subtitle="チャット・投稿文・アンケート・予定・LOVE COINをサポートします"
        category="nene"
      />

      <div className="flex flex-1 flex-col overflow-hidden p-4 sm:p-8">
        {/* タブ */}
        <div className="mb-4 flex flex-none gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-none rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? "bg-love-pink text-white shadow-md shadow-love-pink/30"
                  : "bg-white text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "chat" && (
          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            {/* ねねアバター + ステータス */}
            <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-love-pink-soft text-2xl">
                🦉
              </span>
              <div>
                <p className="text-sm font-bold text-love-navy">ねね</p>
                <p className="flex items-center gap-1 text-xs text-love-navy/50">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  オンライン・AI秘書
                </p>
              </div>
            </div>

            {/* チャット履歴 */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "nene" && (
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-love-pink-soft text-lg">
                      🦉
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm sm:max-w-[65%] ${
                      m.role === "user"
                        ? "rounded-br-none bg-love-pink text-white"
                        : "rounded-bl-none bg-love-bg text-love-navy"
                    }`}
                  >
                    {m.text}
                    <p
                      className={`mt-1 text-[10px] ${
                        m.role === "user" ? "text-white/60" : "text-love-navy/40"
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-end gap-2">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-love-pink-soft text-lg">
                    🦉
                  </span>
                  <div className="rounded-2xl rounded-bl-none bg-love-bg px-4 py-2.5 text-sm text-love-navy/40">
                    ねねが入力中...
                  </div>
                </div>
              )}
            </div>

            {/* 予定登録の確認カード */}
            {pendingSchedule && (
              <div className="border-t border-black/5 bg-love-pink-soft px-5 py-3">
                <p className="mb-2 text-xs font-bold text-love-pink-dark">
                  🦉 ねねがスケジュールへの登録を確認しています
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={approveSchedule}
                    className="flex-1 rounded-full bg-love-pink px-4 py-2 text-sm font-bold text-white shadow-md shadow-love-pink/30 hover:bg-love-pink-dark"
                  >
                    承認して登録する
                  </button>
                  <button
                    type="button"
                    onClick={cancelSchedule}
                    className="flex-1 rounded-full border border-love-pink-dark/30 bg-white px-4 py-2 text-sm font-bold text-love-pink-dark hover:bg-love-pink-soft"
                  >
                    やめる
                  </button>
                </div>
              </div>
            )}

            {/* コミュニティ共有の確認カード */}
            {pendingCommunityShare && (
              <div className="border-t border-black/5 bg-love-pink-soft px-5 py-3">
                <p className="mb-2 text-xs font-bold text-love-pink-dark">
                  🦉 ねねがコミュニティへの共有を確認しています
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={approveCommunityShare}
                    className="flex-1 rounded-full bg-love-pink px-4 py-2 text-sm font-bold text-white shadow-md shadow-love-pink/30 hover:bg-love-pink-dark"
                  >
                    共有する
                  </button>
                  <button
                    type="button"
                    onClick={cancelCommunityShare}
                    className="flex-1 rounded-full border border-love-pink-dark/30 bg-white px-4 py-2 text-sm font-bold text-love-pink-dark hover:bg-love-pink-soft"
                  >
                    やめる
                  </button>
                </div>
              </div>
            )}

            {/* クイックプロンプト */}
            <div className="flex gap-2 overflow-x-auto border-t border-black/5 px-5 py-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="flex-none rounded-full bg-love-pink-soft px-3 py-1.5 text-xs font-medium text-love-pink-dark transition-colors hover:bg-love-pink hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* 入力欄 */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-3 border-t border-black/5 px-5 py-4"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ねねにメッセージを送る..."
                className="flex-1 rounded-full border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
              />
              <button
                type="submit"
                className="flex-none rounded-full bg-love-pink px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-love-pink/30 hover:bg-love-pink-dark"
              >
                送信
              </button>
            </form>
          </div>
        )}

        {activeTab === "post" && (
          <div className="flex-1 overflow-y-auto rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-love-pink-soft text-lg">🦉</span>
              <p className="text-sm font-bold text-love-navy">投稿文作成</p>
            </div>
            <p className="mt-1 text-xs text-love-navy/50">
              テーマとカテゴリーを入力すると、ねねがコミュニティ投稿文を作成します。
            </p>

            <textarea
              value={postTopic}
              onChange={(e) => setPostTopic(e.target.value)}
              placeholder="例: 週末に行ったカフェの写真を投稿したい"
              rows={3}
              className="mt-3 w-full resize-none rounded-xl border border-black/10 bg-love-bg px-4 py-3 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {postCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPostCategory(c)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    postCategory === c
                      ? "bg-love-pink text-white"
                      : "bg-love-bg text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={generatePost}
              disabled={!postTopic.trim() || postLoading}
              className="mt-4 rounded-full bg-love-pink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-love-pink-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {postLoading ? "作成中..." : "投稿文を作成する"}
            </button>

            {postResult && (
              <div className="mt-5 rounded-2xl bg-love-bg p-4">
                <p className="whitespace-pre-wrap text-sm text-love-navy">{postResult}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleCopy("post", postResult)}
                    className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-love-pink-dark shadow-sm hover:bg-love-pink-soft"
                  >
                    {copied === "post" ? "コピーしました ✓" : "コピーする"}
                  </button>
                  {postNote && <p className="text-[11px] text-love-navy/30">{postNote}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "survey" && (
          <div className="flex-1 overflow-y-auto rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-love-pink-soft text-lg">🦉</span>
              <p className="text-sm font-bold text-love-navy">アンケート作成</p>
            </div>
            <p className="mt-1 text-xs text-love-navy/50">
              テーマを入力すると、ねねが質問文と選択肢を作成します。
            </p>

            <textarea
              value={surveyTopic}
              onChange={(e) => setSurveyTopic(e.target.value)}
              placeholder="例: 次のコミュニティイベントで開催したい企画"
              rows={2}
              className="mt-3 w-full resize-none rounded-xl border border-black/10 bg-love-bg px-4 py-3 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
            />

            <button
              type="button"
              onClick={generateSurvey}
              disabled={!surveyTopic.trim() || surveyLoading}
              className="mt-4 rounded-full bg-love-pink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-love-pink-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {surveyLoading ? "作成中..." : "アンケートを作成する"}
            </button>

            {surveyResult && (
              <div className="mt-5 rounded-2xl bg-love-bg p-4">
                <p className="text-sm font-bold text-love-navy">{surveyResult.question}</p>
                <ul className="mt-3 space-y-2">
                  {surveyResult.options.map((opt, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-black/5 bg-white px-3 py-2 text-sm text-love-navy"
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "survey",
                        `${surveyResult.question}\n${surveyResult.options.map((o, i) => `${i + 1}. ${o}`).join("\n")}`
                      )
                    }
                    className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-love-pink-dark shadow-sm hover:bg-love-pink-soft"
                  >
                    {copied === "survey" ? "コピーしました ✓" : "コピーする"}
                  </button>
                  {surveyNote && <p className="text-[11px] text-love-navy/30">{surveyNote}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="flex-1 overflow-y-auto rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-love-pink-soft text-lg">🦉</span>
              <p className="text-sm font-bold text-love-navy">予定作成</p>
            </div>
            <p className="mt-1 text-xs text-love-navy/50">
              予定の内容を伝えると、ねねが曜日・時間を提案します。スケジュール画面から登録できます。
            </p>

            <textarea
              value={scheduleDesc}
              onChange={(e) => setScheduleDesc(e.target.value)}
              placeholder="例: 来週カフェの新作スイーツを取材したい"
              rows={2}
              className="mt-3 w-full resize-none rounded-xl border border-black/10 bg-love-bg px-4 py-3 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
            />

            <button
              type="button"
              onClick={generateSchedule}
              disabled={!scheduleDesc.trim() || scheduleLoading}
              className="mt-4 rounded-full bg-love-pink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-love-pink-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {scheduleLoading ? "作成中..." : "予定を作成する"}
            </button>

            {scheduleResult && (
              <div className="mt-5 rounded-2xl bg-love-bg p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${eventColorStyles[scheduleResult.color]}`}
                  >
                    {scheduleResult.reminder && "🔔 "}
                    {scheduleResult.title}
                  </span>
                </div>
                <p className="mt-2 text-sm text-love-navy/70">
                  {scheduleWeekDays[scheduleResult.day]?.label ?? "?"}曜日（
                  {scheduleWeekDays[scheduleResult.day]?.date ?? "-"}） {scheduleResult.startHour}:00-
                  {scheduleResult.endHour}:00
                </p>
                <p className="mt-2 text-sm text-love-navy">{scheduleResult.note}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "schedule",
                        `${scheduleResult.title}\n${scheduleWeekDays[scheduleResult.day]?.label ?? "?"}曜日 ${scheduleResult.startHour}:00-${scheduleResult.endHour}:00`
                      )
                    }
                    className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-love-pink-dark shadow-sm hover:bg-love-pink-soft"
                  >
                    {copied === "schedule" ? "コピーしました ✓" : "コピーする"}
                  </button>
                  <a
                    href="/schedule"
                    className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-love-pink-dark shadow-sm hover:bg-love-pink-soft"
                  >
                    スケジュール画面で登録する →
                  </a>
                  {scheduleNote && <p className="text-[11px] text-love-navy/30">{scheduleNote}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "coin" && (
          <div className="flex-1 overflow-y-auto rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-love-pink-soft text-lg">🦉</span>
              <p className="text-sm font-bold text-love-navy">LOVE COINアドバイス</p>
            </div>

            <div className="mt-3 rounded-2xl bg-love-bg p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-love-navy/50">現在のLOVE COIN</p>
                <span className="rounded-full bg-love-gold-soft px-2.5 py-1 text-[11px] font-semibold text-love-navy">
                  {loveCoin.rank}
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold text-love-navy">{loveCoin.balance.toLocaleString()} 💗</p>
              <p className="mt-1 text-xs text-love-navy/50">
                今月の獲得 +{loveCoin.monthlyEarned} ／ 次のランク「{loveCoin.nextRank}」まで{" "}
                {(loveCoin.nextRankTarget - loveCoin.balance).toLocaleString()}
              </p>
            </div>

            <p className="mt-4 text-xs text-love-navy/50">気になることがあれば質問してみましょう（任意）</p>
            <input
              value={coinQuestion}
              onChange={(e) => setCoinQuestion(e.target.value)}
              placeholder="例: LOVE COINを一番効率よく増やす方法は？"
              className="mt-2 w-full rounded-full border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
            />

            <button
              type="button"
              onClick={generateCoinAdvice}
              disabled={coinLoading}
              className="mt-4 rounded-full bg-love-pink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-love-pink-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {coinLoading ? "考え中..." : "ねねにアドバイスをもらう"}
            </button>

            {coinResult && (
              <div className="mt-5 rounded-2xl bg-love-bg p-4">
                <p className="whitespace-pre-wrap text-sm text-love-navy">{coinResult}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleCopy("coin", coinResult)}
                    className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-love-pink-dark shadow-sm hover:bg-love-pink-soft"
                  >
                    {copied === "coin" ? "コピーしました ✓" : "コピーする"}
                  </button>
                  {coinNote && <p className="text-[11px] text-love-navy/30">{coinNote}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
