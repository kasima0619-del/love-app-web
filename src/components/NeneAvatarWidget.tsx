"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NENE_QUICK_PROMPTS, useNeneChat } from "@/lib/hooks/use-nene-chat";

export default function NeneAvatarWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [messages, isTyping, pendingSchedule, pendingCommunityShare]);

  // ホーム画面はねねとのチャットがメイン導線のため、フローティングウィジェットは非表示にする
  if (pathname === "/dashboard") return null;

  return (
    <>
      {open && (
        <div className="fixed inset-x-4 bottom-36 z-50 flex h-[60vh] max-h-[520px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[480px] sm:w-96">
          {/* ヘッダー */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-love-navy to-love-pink-dark px-4 py-3">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/15 text-xl">
              🦉
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">AI秘書 ねね</p>
              <p className="flex items-center gap-1 text-[11px] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                オンライン・つなぐお手伝いをします
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="チャットを閉じる"
              className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* チャット履歴 */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "nene" && (
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-love-pink-soft text-sm">
                    🦉
                  </span>
                )}
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
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
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-love-pink-soft text-sm">
                  🦉
                </span>
                <div className="rounded-2xl rounded-bl-none bg-love-bg px-3.5 py-2 text-[13px] text-love-navy/40">
                  ねねが入力中...
                </div>
              </div>
            )}
          </div>

          {/* 予定登録の確認カード */}
          {pendingSchedule && (
            <div className="border-t border-black/5 bg-love-pink-soft px-4 py-2.5">
              <p className="mb-2 text-[11px] font-bold text-love-pink-dark">
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
            <div className="border-t border-black/5 bg-love-pink-soft px-4 py-2.5">
              <p className="mb-2 text-[11px] font-bold text-love-pink-dark">
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

          {/* クイックアクション */}
          <div className="flex gap-2 overflow-x-auto border-t border-black/5 px-3 py-2">
            {NENE_QUICK_PROMPTS.map((qa) => (
              <button
                key={qa.label}
                type="button"
                onClick={() => send(qa.prompt)}
                className="flex-none rounded-full bg-love-pink-soft px-3 py-1.5 text-xs font-medium text-love-pink-dark transition-colors hover:bg-love-pink hover:text-white"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* 入力欄 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-black/5 px-3 py-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ねねにメッセージを送る..."
              className="flex-1 rounded-full border border-black/10 bg-love-bg px-3.5 py-2 text-[13px] text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
            />
            <button
              type="submit"
              className="flex-none rounded-full bg-love-pink px-4 py-2 text-xs font-bold text-white shadow-md shadow-love-pink/30 hover:bg-love-pink-dark"
            >
              送信
            </button>
          </form>

          <Link
            href="/ai-partner"
            onClick={() => setOpen(false)}
            className="border-t border-black/5 px-4 py-2 text-center text-[11px] font-medium text-love-pink-dark transition-colors hover:bg-love-pink-soft"
          >
            ねねとフルチャットを開く →
          </Link>
        </div>
      )}

      {/* 起動ボタン */}
      <div className="fixed bottom-20 right-4 z-50 lg:bottom-6 lg:right-6">
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-love-pink/40" />
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "ねねを閉じる" : "AI秘書ねねを開く"}
          aria-expanded={open}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-love-pink to-love-pink-dark text-2xl text-white shadow-xl shadow-love-pink/40 transition-transform hover:scale-105"
        >
          {open ? "✕" : "🦉"}
        </button>
      </div>
    </>
  );
}
