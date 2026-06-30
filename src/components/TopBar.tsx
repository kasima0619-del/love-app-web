"use client";

import Link from "next/link";
import { currentUser } from "@/lib/mock-data";
import CategoryTag, { type CategoryKey } from "@/components/CategoryTag";

type TopBarProps = {
  title: string;
  subtitle?: string;
  category?: CategoryKey;
};

export default function TopBar({ title, subtitle, category }: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/5 bg-white/80 px-4 py-4 backdrop-blur sm:px-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-love-navy sm:text-xl">{title}</h1>
          {category && <CategoryTag category={category} />}
        </div>
        {subtitle && <p className="mt-0.5 text-xs text-love-navy/50 sm:text-sm">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/profile/me"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-love-pink-soft text-sm font-bold text-love-pink-dark"
          title={currentUser.name}
        >
          {currentUser.avatarInitial}
        </Link>
      </div>
    </header>
  );
}
