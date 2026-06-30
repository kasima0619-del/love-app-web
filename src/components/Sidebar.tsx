"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentUser } from "@/lib/mock-data";

const navItems = [
  { href: "/dashboard", label: "ホーム", icon: "🏠" },
  { href: "/ai-partner", label: "AI秘書 ねね", icon: "🦉" },
  { href: "/messages", label: "メッセージ", icon: "💬" },
  { href: "/schedule", label: "スケジュール", icon: "🗓️" },
  { href: "/matching", label: "LOVEマッチング", icon: "💞" },
  { href: "/survey", label: "アンケート", icon: "📋" },
  { href: "/partners", label: "企業パートナー", icon: "🏢" },
  { href: "/community", label: "コミュニティ", icon: "👥" },
  { href: "/profile/me", label: "マイページ", icon: "👤" },
];

const adminNavItems = [{ href: "/admin", label: "管理者ダッシュボード", icon: "🛠️" }];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 flex-col bg-love-navy text-white lg:flex">
      {/* ロゴ */}
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-love-pink text-lg">
          💗
        </span>
        <div>
          <p className="text-lg font-bold leading-none tracking-wide">LOVE</p>
          <p className="text-[10px] text-white/50">つながる、創る、叶える。</p>
        </div>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-love-pink text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* 管理者用 */}
        <p className="px-3 pt-4 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          管理者用（Phase4）
        </p>
        {adminNavItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-love-pink text-white shadow-sm"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* プロフィール / ログアウト */}
      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4">
        <Link
          href="/profile/me"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-love-pink-soft text-sm font-bold text-love-pink-dark"
        >
          {currentUser.avatarInitial}
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{currentUser.name}</p>
          <p className="truncate text-xs text-white/50">{currentUser.handle}</p>
        </div>
        <Link
          href="/login"
          title="ログアウト"
          className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          ⏻
        </Link>
      </div>
    </aside>
  );
}
