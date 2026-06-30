import Link from "next/link";
import { conversations } from "@/lib/mock-data";
import CategoryTag from "@/components/CategoryTag";

// 連携した外部SNS（LINE・WeChatなど）経由でつながっている友達を示す簡易バッジ。
// デモのため会話IDに対して固定で割り当てている。
const SNS_BADGES: Record<string, { icon: string; label: string }> = {
  "cv-1": { icon: "💚", label: "LINE" },
  "cv-2": { icon: "🟢", label: "WeChat" },
};

export default function NeneFriendsPanel() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1 rounded-full bg-love-pink-soft px-2.5 py-1 text-[11px] font-bold text-love-pink-dark">
          🦉 ねねがつなぐ友達
        </p>
        <CategoryTag category="friend" />
      </div>
      <p className="mt-2 text-[11px] text-love-navy/40">
        LINEやWeChatなど連携したSNSの友達・コミュニティとも、ここから会話を続けられます。
      </p>
      <ul className="mt-3 space-y-1">
        {conversations.map((c) => {
          const badge = SNS_BADGES[c.id];
          return (
            <li key={c.id}>
              <Link
                href="/messages"
                className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-love-bg"
              >
                <span className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full bg-love-blue-soft text-base font-bold text-love-blue-dark">
                  {c.avatarInitial}
                  {badge && (
                    <span
                      title={badge.label}
                      className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] shadow"
                    >
                      {badge.icon}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-love-navy">{c.name}</p>
                  <p className="truncate text-xs text-love-navy/40">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="flex h-5 min-w-5 flex-none items-center justify-center rounded-full bg-love-blue px-1.5 text-[10px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href="/messages"
        className="mt-3 block rounded-full bg-love-blue-soft px-4 py-1.5 text-center text-xs font-semibold text-love-blue-dark"
      >
        すべてのトークを見る →
      </Link>
    </div>
  );
}
