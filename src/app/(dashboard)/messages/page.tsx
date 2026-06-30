"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import {
  notifications,
  type Conversation,
  type DirectMessage,
  type PlatformUser,
} from "@/lib/mock-data";

function formatMessageTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const hhmm = date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

  if (isSameDay(date, now)) return hhmm;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return `昨日 ${hhmm}`;

  return `${date.getMonth() + 1}/${date.getDate()} ${hhmm}`;
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "users" | "notifications">("chat");
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [threads, setThreads] = useState<Record<string, DirectMessage[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const unreadNotifications = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    let active = true;
    fetch("/api/messages")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load");
        return res.json() as Promise<{
          users: PlatformUser[];
          conversations: Conversation[];
          threads: Record<string, DirectMessage[]>;
        }>;
      })
      .then((data) => {
        if (!active) return;
        setUsers(data.users);
        setConversations(data.conversations);
        setThreads(data.threads);
        const sorted = [...data.conversations].sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
        setSelectedId(sorted[0]?.id ?? null);
      })
      .catch(() => {
        if (active) setError("データの取得に失敗しました。再読み込みしてください。");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  const selected = conversations.find((c) => c.id === selectedId);
  const messages = selectedId ? threads[selectedId] ?? [] : [];

  async function selectConversation(id: string) {
    setSelectedId(id);
    const conv = conversations.find((c) => c.id === id);
    if (conv && conv.unread > 0) {
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
      try {
        await fetch(`/api/messages/conversations/${id}/read`, { method: "POST" });
      } catch {
        // 既読更新の失敗はUI上は無視する
      }
    }
  }

  async function startConversation(userId: string) {
    setError(null);
    try {
      const res = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as {
        conversation: Conversation;
        conversations: Conversation[];
        messages: DirectMessage[];
      };
      setConversations(data.conversations);
      setThreads((prev) => ({ ...prev, [data.conversation.id]: data.messages }));
      setSelectedId(data.conversation.id);
      setActiveTab("chat");
    } catch {
      setError("チャットの開始に失敗しました。");
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSend() {
    if ((!input.trim() && !imageFile) || !selectedId || sending) return;
    setSending(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("text", input.trim());
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`/api/messages/conversations/${selectedId}/messages`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { message: DirectMessage; conversation: Conversation };
      setThreads((prev) => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] ?? []), data.message],
      }));
      setConversations((prev) => prev.map((c) => (c.id === selectedId ? data.conversation : c)));
      setInput("");
      clearImage();
    } catch {
      setError("送信に失敗しました。もう一度お試しください。");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <TopBar title="メッセージ" subtitle="仲間やコミュニティとのやりとりを確認できます" category="friend" />
        <div className="p-8 text-center text-sm text-love-navy/40">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-screen">
      <TopBar title="メッセージ" subtitle="仲間やコミュニティとのやりとりを確認できます" category="friend" />

      <div className="flex flex-1 flex-col overflow-hidden p-4 sm:p-8">
        {error && (
          <div className="mb-3 flex-none rounded-2xl border border-love-pink/30 bg-love-pink-soft px-4 py-3 text-sm text-love-pink-dark">
            {error}
          </div>
        )}

        {/* タブ */}
        <div className="mb-4 flex flex-none gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex-none rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              activeTab === "chat"
                ? "bg-love-pink text-white shadow-md shadow-love-pink/30"
                : "bg-white text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
            }`}
          >
            💬 チャット
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex-none rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              activeTab === "users"
                ? "bg-love-pink text-white shadow-md shadow-love-pink/30"
                : "bg-white text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
            }`}
          >
            👥 ユーザー一覧
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`flex flex-none items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              activeTab === "notifications"
                ? "bg-love-pink text-white shadow-md shadow-love-pink/30"
                : "bg-white text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
            }`}
          >
            🔔 通知
            {unreadNotifications > 0 && (
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  activeTab === "notifications" ? "bg-white text-love-pink-dark" : "bg-love-pink text-white"
                }`}
              >
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {activeTab === "notifications" && (
          <div className="flex-1 overflow-y-auto rounded-2xl border border-black/5 bg-white shadow-sm">
            <p className="px-4 py-3 text-xs font-medium text-love-navy/50">通知</p>
            <ul className="divide-y divide-black/5">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 ${n.unread ? "bg-love-pink-soft/30" : ""}`}
                >
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-love-pink-soft text-base">
                    {n.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-love-navy">{n.text}</p>
                    <p className="mt-0.5 text-[11px] text-love-navy/40">{n.time}</p>
                  </div>
                  {n.unread && <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-love-pink" />}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "users" && (
          <div className="flex-1 overflow-y-auto rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-xs font-medium text-love-navy/50">ユーザー一覧</p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {users.map((u) => {
                const existing = conversations.find((c) => c.type === "dm" && c.userId === u.id);
                return (
                  <div key={u.id} className="rounded-2xl border border-black/5 bg-love-bg p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-love-pink-soft text-base font-bold text-love-pink-dark">
                        {u.avatarInitial}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-love-navy">{u.name}</p>
                        <p className="text-xs text-love-navy/40">{u.handle}</p>
                        <p className="mt-1 text-xs text-love-navy/60">{u.bio}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => startConversation(u.id)}
                      className="mt-3 w-full rounded-full bg-love-pink px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-love-pink-dark"
                    >
                      {existing ? "チャットを開く" : "メッセージを送る"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="flex flex-1 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            {/* 会話一覧 */}
            <div
              className={`${
                selectedId ? "hidden lg:flex" : "flex"
              } w-full flex-col border-r border-black/5 lg:w-72`}
            >
              <p className="px-4 py-3 text-xs font-medium text-love-navy/50">チャット一覧</p>
              <ul className="flex-1 overflow-y-auto">
                {sortedConversations.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => selectConversation(c.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-love-bg ${
                        selectedId === c.id ? "bg-love-pink-soft" : ""
                      }`}
                    >
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-love-pink-soft text-sm font-bold text-love-pink-dark">
                        {c.avatarInitial}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-love-navy">{c.name}</p>
                          <p className="flex-none text-[11px] text-love-navy/40">
                            {formatMessageTime(c.lastMessageAt)}
                          </p>
                        </div>
                        <p className="truncate text-xs text-love-navy/50">{c.lastMessage}</p>
                      </div>
                      {c.unread > 0 && (
                        <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-love-pink text-[10px] font-bold text-white">
                          {c.unread}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* スレッド */}
            <div className={`${selectedId ? "flex" : "hidden lg:flex"} flex-1 flex-col`}>
              {selected ? (
                <>
                  <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-love-navy/50 lg:hidden"
                      aria-label="チャット一覧へ戻る"
                    >
                      ←
                    </button>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-love-pink-soft text-sm font-bold text-love-pink-dark">
                      {selected.avatarInitial}
                    </span>
                    <p className="text-sm font-bold text-love-navy">{selected.name}</p>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                            m.sender === "me"
                              ? "rounded-br-none bg-love-pink text-white"
                              : "rounded-bl-none bg-love-bg text-love-navy"
                          }`}
                        >
                          {m.image && (
                            <div className="relative mb-1 h-48 w-48 max-w-full overflow-hidden rounded-xl">
                              <Image src={m.image} alt="" fill className="object-cover" />
                            </div>
                          )}
                          {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}
                          <p
                            className={`mt-1 text-[10px] ${
                              m.sender === "me" ? "text-white/60" : "text-love-navy/40"
                            }`}
                          >
                            {formatMessageTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex flex-none flex-col gap-2 border-t border-black/5 px-5 py-4"
                  >
                    {imagePreview && (
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                        <Image src={imagePreview} alt="" fill unoptimized className="object-cover" />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs text-white"
                          aria-label="画像を削除"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <label className="flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-full bg-love-bg text-base text-love-navy/60 transition-colors hover:bg-love-pink-soft">
                        📷
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 rounded-full border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
                      />
                      <button
                        type="submit"
                        disabled={(!input.trim() && !imageFile) || sending}
                        className="flex-none rounded-full bg-love-pink px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-love-pink/30 transition-colors hover:bg-love-pink-dark disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {sending ? "送信中..." : "送信"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-sm text-love-navy/40">
                  会話を選択してください
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
