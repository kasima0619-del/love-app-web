"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { loveCoin as initialLoveCoin, coinTransactions as initialTransactions, type CoinTransaction } from "@/lib/mock-data";

type LoveCoinData = {
  balance: number;
  monthlyEarned: number;
  rank: string;
  nextRank: string;
  nextRankTarget: number;
  transactions: CoinTransaction[];
};

const txTypeStyles: Record<CoinTransaction["type"], string> = {
  earn: "bg-love-gold-soft text-love-navy",
  send: "bg-love-pink-soft text-love-pink-dark",
  receive: "bg-love-gold-soft text-love-navy",
};

export default function LoveCoinPage() {
  const [data, setData] = useState<LoveCoinData>({
    ...initialLoveCoin,
    transactions: initialTransactions,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/love-coin")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load");
        return res.json() as Promise<LoveCoinData>;
      })
      .then((json) => {
        if (active) setData(json);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const progress = Math.min(100, Math.round((data.balance / data.nextRankTarget) * 100));

  return (
    <div className="flex flex-col">
      <TopBar title="LOVE COIN" subtitle="残高・ランク・獲得履歴を確認できます" category="coin" />

      <div className="space-y-6 p-4 sm:p-8">
        {/* 残高カード */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-love-navy to-love-pink-dark p-6 text-white sm:p-8">
          <p className="text-xs uppercase tracking-widest text-love-gold">LOVE COIN BALANCE</p>
          <p className="mt-3 text-4xl font-bold">
            {data.balance.toLocaleString()}
            <span className="ml-2 text-sm font-normal text-white/60">LOVE</span>
          </p>
          <p className="mt-2 text-sm text-white/70">
            今月の獲得 +{data.monthlyEarned.toLocaleString()} LOVE
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-love-gold to-love-pink"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/60">
            ランク「{data.rank}」・次は「{data.nextRank}」まで{" "}
            {Math.max(0, data.nextRankTarget - data.balance).toLocaleString()} LOVE
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/send"
            className="rounded-full bg-love-pink px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-love-pink/30 hover:bg-love-pink-dark"
          >
            💸 LOVE COINを送る
          </Link>
          <Link
            href="/ai-partner"
            className="rounded-full border border-love-pink-dark/30 bg-white px-5 py-2.5 text-sm font-bold text-love-pink-dark hover:bg-love-pink-soft"
          >
            🦉 ねねにアドバイスをもらう
          </Link>
        </div>

        {/* 取引履歴 */}
        <section id="history" className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-medium text-love-navy/50">取引履歴</p>
          {loading ? (
            <p className="mt-3 text-sm text-love-navy/40">読み込み中...</p>
          ) : (
            <ul className="mt-3 divide-y divide-black/5">
              {data.transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${txTypeStyles[tx.type]}`}>
                        {tx.type === "earn" ? "獲得" : tx.type === "send" ? "送金" : "受取"}
                      </span>
                      <p className="truncate text-sm font-semibold text-love-navy">{tx.label}</p>
                    </div>
                    <p className="mt-1 text-xs text-love-navy/40">{tx.date}</p>
                  </div>
                  <p className="flex-none font-bold text-love-navy">
                    {tx.type === "send" ? "-" : "+"}
                    {tx.amount.toLocaleString()} LOVE
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="text-[11px] text-love-navy/30">
          ※ チャージ・出金は準備中です。実際の決済連携はPhase4以降で本実装予定です。
        </p>
      </div>
    </div>
  );
}
