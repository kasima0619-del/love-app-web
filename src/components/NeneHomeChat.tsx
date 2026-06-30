"use client";

import { useEffect, useRef } from "react";
import { NENE_QUICK_PROMPTS, useNeneChat } from "@/lib/hooks/use-nene-chat";

// ホーム画面の主役となる、ねねとの会話入力欄（ChatGPT/Claudeに近い「まず話しかける」UI）。
// ユーザー → ねね → サービス、の順でやりとりが進む。

export default function NeneHomeChat() {
  const {
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
  } = useNeneChat();

  const bottomRef = useRef<HTMLDivElement>(null);
  const hasConversation = messages.length > 1 || isTyping;

  useEffect(() => {
    if (hasConversation) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isTyping, pendingSchedule, pendingCommunityShare, hasConversation]);

  return (
    <section className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* 今日は何をしますか？（チャット開始前は大きく中央に表示） */}
        <div
          className={`text-center transition-all ${hasConversation ? "py-2" : "py-8 sm:py-14"}`}
        >
          <span className="text-4xl sm:text-5xl">🦉</span>
          <h1 className="mt-3 text-2xl font-bold text-love-navy sm:text-3xl">今日は何をしますか？</h1>
          <p className="mt-2 text-sm text-love-navy/50">
            AI秘書ねねに話しかけると、必要なサービスへつないでくれます。
          </p>
        </div>

        {/* チャット履歴 */}
        {hasConversation && (
          <div className="mb-4 space-y-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "nene" && (
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-love-pink-soft text-base">
                    🦉
                  </span>
                )}
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-none bg-love-pink text-white"
                      : "rounded-bl-none bg-love-bg text-love-navy"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-love-pink-soft text-base">
                  🦉
                </span>
                <div className="rounded-2xl rounded-bl-none bg-love-bg px-4 py-2.5 text-sm text-love-navy/40">
                  ねねが入力中...
                </div>
              </div>
            )}

            {/* 予定登録の確認カード */}
            {pendingSchedule && (
              <div className="rounded-2xl bg-love-pink-soft px-4 py-3">
                <p className="mb-2 text-xs font-bold text-love-pink-dark">
                  🦉 ねねがスケジュールへの登録を確認しています
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={approveSchedule}
                    className="flex-1 rounded-full bg-love-pink px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-love-pink/30 hover:bg-love-pink-dark"
                  >
                    承認して登録する
                  </button>
                  <button
                    type="button"
                    onClick={cancelSchedule}
                    className="flex-1 rounded-full border border-love-pink-dark/30 bg-white px-3 py-1.5 text-xs font-bold text-love-pink-dark hover:bg-love-pink-soft"
                  >
                    やめる
                  </button>
                </div>
              </div>
            )}

            {/* コミュニティ共有の確認カード */}
            {pendingCommunityShare && (
              <div className="rounded-2xl bg-love-pink-soft px-4 py-3">
                <p className="mb-2 text-xs font-bold text-love-pink-dark">
                  🦉 ねねがコミュニティへの共有を確認しています
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={approveCommunityShare}
                    className="flex-1 rounded-full bg-love-pink px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-love-pink/30 hover:bg-love-pink-dark"
                  >
                    共有する
                  </button>
                  <button
                    type="button"
                    onClick={cancelCommunityShare}
                    className="flex-1 rounded-full border border-love-pink-dark/30 bg-white px-3 py-1.5 text-xs font-bold text-love-pink-dark hover:bg-love-pink-soft"
                  >
                    やめる
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

      </div>

      {/* 会話入力欄（画面下部に固定。どこを見ていてもホームからすぐねねに話しかけられる） */}
      <div className="fixed inset-x-4 bottom-20 z-30 lg:inset-x-0 lg:bottom-6 lg:left-64 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl bg-love-bg/90 p-2 shadow-xl backdrop-blur-sm sm:p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-full border-2 border-love-pink/20 bg-white px-3 py-2 shadow-lg shadow-love-pink/10 transition-colors focus-within:border-love-pink sm:px-4 sm:py-2.5"
          >
            <span className="flex-none text-xl">🦉</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ねねに話しかけてみる（例：明日の予定作って）"
              className="flex-1 bg-transparent text-sm text-love-navy outline-none placeholder:text-love-navy/30"
            />
            <button
              type="submit"
              className="flex-none rounded-full bg-love-pink px-4 py-2 text-xs font-bold text-white shadow-md shadow-love-pink/30 hover:bg-love-pink-dark"
            >
              送信
            </button>
          </form>

          {/* クイックアクション */}
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {NENE_QUICK_PROMPTS.map((qa) => (
              <button
                key={qa.label}
                type="button"
                onClick={() => send(qa.prompt)}
                className="rounded-full bg-love-pink-soft px-3.5 py-1.5 text-xs font-medium text-love-pink-dark transition-colors hover:bg-love-pink hover:text-white"
              >
                {qa.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
