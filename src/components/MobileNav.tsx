"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryItems = [
  { href: "/dashboard", label: "ホーム", icon: "🏠" },
  { href: "/ai-partner", label: "ねね", icon: "🦉" },
  { href: "/messages", label: "メッセージ", icon: "💬" },
  { href: "/profile/me", label: "マイページ", icon: "👤" },
];

const moreItems = [
  { href: "/schedule", label: "スケジュール", icon: "🗓️" },
  { href: "/community", label: "コミュニティ", icon: "👥" },
  { href: "/matching", label: "LOVEマッチング", icon: "💞" },
  { href: "/survey", label: "アンケート", icon: "📋" },
  { href: "/partners", label: "企業パートナー", icon: "🏢" },
  { href: "/admin", label: "管理者", icon: "🛠️" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreActive = moreItems.some((item) => pathname.startsWith(item.href));

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-30 flex flex-col justify-end bg-black/40 lg:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="rounded-t-2xl bg-white p-4 pb-6 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/10" />
            <p className="px-1 text-xs font-medium text-love-navy/50">すべてのメニュー</p>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {moreItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex flex-col items-center gap-1 rounded-xl py-3 text-[11px] font-medium transition-colors ${
                      active ? "bg-love-pink-soft text-love-pink-dark" : "text-love-navy/70 hover:bg-love-bg"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-black/5 bg-white/95 backdrop-blur lg:hidden">
        {primaryItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                active ? "text-love-pink-dark" : "text-love-navy/50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
            moreActive || moreOpen ? "text-love-pink-dark" : "text-love-navy/50"
          }`}
        >
          <span className="text-lg">☰</span>
          もっと
        </button>
      </nav>
    </>
  );
}
