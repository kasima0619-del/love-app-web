"use client";

import { useState } from "react";
import CategoryTag from "@/components/CategoryTag";

const SNS_PLATFORMS = [
  { id: "line", name: "LINE", icon: "💚", defaultConnected: true },
  { id: "wechat", name: "WeChat", icon: "🟢", defaultConnected: false },
  { id: "kakaotalk", name: "KakaoTalk", icon: "💛", defaultConnected: false },
  { id: "whatsapp", name: "WhatsApp", icon: "📞", defaultConnected: false },
];

export default function SnsConnectPanel() {
  const [connected, setConnected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SNS_PLATFORMS.map((p) => [p.id, p.defaultConnected]))
  );

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1 rounded-full bg-love-pink-soft px-2.5 py-1 text-[11px] font-bold text-love-pink-dark">
          🦉 ねねがつなぐ外部サービス
        </p>
        <CategoryTag category="friend" />
      </div>
      <p className="mt-2 text-xs text-love-navy/50">
        LINE・WeChat・KakaoTalk・WhatsAppなど、普段使っているSNSをねねに連携すると、メッセージやコミュニティ活動をまとめて案内できます。
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SNS_PLATFORMS.map((platform) => {
          const isConnected = connected[platform.id];
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() =>
                setConnected((prev) => ({ ...prev, [platform.id]: !prev[platform.id] }))
              }
              className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors ${
                isConnected
                  ? "border-love-blue bg-love-blue-soft text-love-blue-dark"
                  : "border-black/5 bg-love-bg text-love-navy/60 hover:border-love-blue/30"
              }`}
            >
              <span className="text-2xl">{platform.icon}</span>
              <span className="text-xs font-bold">{platform.name}</span>
              <span className="text-[10px] font-semibold">
                {isConnected ? "連携済み ✓" : "連携する"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
