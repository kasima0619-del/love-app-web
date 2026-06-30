"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { partnerCategories, type Partner, type PartnerUsageLog } from "@/lib/mock-data";
import { notifyLoveCoinUpdated } from "@/lib/hooks/use-love-coin";

const tabs = [
  { id: "list", label: "🏢 提携企業一覧" },
  { id: "favorites", label: "⭐ お気に入り" },
  { id: "history", label: "📜 利用履歴" },
] as const;
type TabId = (typeof tabs)[number]["id"];

const categoryFilters = ["すべて", ...partnerCategories];

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [usageLog, setUsageLog] = useState<PartnerUsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>("list");
  const [categoryFilter, setCategoryFilter] = useState("すべて");

  useEffect(() => {
    let active = true;
    fetch("/api/partners")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load");
        return res.json() as Promise<{ partners: Partner[]; favoriteIds: string[]; usageLog: PartnerUsageLog[] }>;
      })
      .then((data) => {
        if (!active) return;
        setPartners(data.partners);
        setFavoriteIds(data.favoriteIds);
        setUsageLog(data.usageLog);
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

  async function toggleFavorite(partnerId: string) {
    setError(null);
    try {
      const res = await fetch(`/api/partners/${partnerId}/favorite`, { method: "POST" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { favoriteIds: string[] };
      setFavoriteIds(data.favoriteIds);
    } catch {
      setError("お気に入りの更新に失敗しました。");
    }
  }

  async function redeemPartner(partner: Partner) {
    setError(null);
    try {
      const res = await fetch(`/api/partners/${partner.id}/use`, { method: "POST" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { usageLog: PartnerUsageLog[]; reward: number };
      setUsageLog(data.usageLog);
      setRewardToast(`💗 ${partner.name}のご利用で+${data.reward} LOVE COINを獲得しました！`);
      notifyLoveCoinUpdated();
      setTimeout(() => setRewardToast(null), 3000);
    } catch {
      setError("利用記録の送信に失敗しました。");
    }
  }

  const filteredPartners =
    categoryFilter === "すべて" ? partners : partners.filter((p) => p.category === categoryFilter);
  const favoritePartners = partners.filter((p) => favoriteIds.includes(p.id));

  function PartnerCard({ partner }: { partner: Partner }) {
    const favorited = favoriteIds.includes(partner.id);
    const available = partner.status === "提携中";
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-love-pink-soft text-2xl">
            {partner.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-love-navy">{partner.name}</h3>
                <span className="mt-1 inline-block rounded-full bg-love-bg px-2.5 py-1 text-[11px] font-semibold text-love-navy/60">
                  {partner.category}
                </span>
              </div>
              <div className="flex flex-none items-center gap-2">
                <span className="rounded-full bg-love-gold-soft px-2.5 py-1 text-[11px] font-bold text-love-navy">
                  還元率 {partner.cashbackRate}%
                </span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(partner.id)}
                  aria-label="お気に入り"
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-base transition-colors ${
                    favorited ? "bg-love-gold-soft text-love-gold" : "bg-love-bg text-love-navy/30 hover:text-love-gold"
                  }`}
                >
                  {favorited ? "★" : "☆"}
                </button>
              </div>
            </div>

            <p className="mt-2 text-sm text-love-navy/60">{partner.description}</p>

            {partner.campaign && (
              <p className="mt-2 rounded-xl bg-love-pink-soft px-3 py-2 text-xs font-semibold text-love-pink-dark">
                🎁 {partner.campaign}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          {available ? (
            <button
              type="button"
              onClick={() => redeemPartner(partner)}
              className="rounded-full bg-love-pink px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-love-pink-dark"
            >
              利用してLOVE COINを獲得
            </button>
          ) : (
            <span className="rounded-full bg-black/5 px-5 py-2 text-sm font-bold text-love-navy/40">近日公開</span>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <TopBar title="企業パートナー" subtitle="提携企業のLOVE COIN還元プログラム" category="partner" />
        <div className="p-8 text-center text-sm text-love-navy/40">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <TopBar title="企業パートナー" subtitle="提携企業のLOVE COIN還元プログラム" category="partner" />

      <div className="space-y-6 p-4 sm:p-8">
        {error && (
          <div className="rounded-2xl border border-love-pink/30 bg-love-pink-soft px-4 py-3 text-sm text-love-pink-dark">
            {error}
          </div>
        )}

        {rewardToast && (
          <div className="rounded-2xl border border-love-gold/40 bg-love-gold-soft px-4 py-3 text-sm font-semibold text-love-navy">
            {rewardToast}
          </div>
        )}

        {/* タブ */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                activeTab === t.id
                  ? "bg-love-pink text-white shadow-md shadow-love-pink/30"
                  : "bg-white text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 提携企業一覧 */}
        {activeTab === "list" && (
          <div className="space-y-4">
            <section className="flex flex-wrap gap-2">
              {categoryFilters.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoryFilter(c)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    categoryFilter === c
                      ? "bg-love-pink text-white"
                      : "border border-black/5 bg-white text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
                  }`}
                >
                  {c}
                </button>
              ))}
            </section>

            {filteredPartners.length === 0 ? (
              <p className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-love-navy/40 shadow-sm">
                該当する提携企業はまだありません
              </p>
            ) : (
              filteredPartners.map((partner) => <PartnerCard key={partner.id} partner={partner} />)
            )}
          </div>
        )}

        {/* お気に入り */}
        {activeTab === "favorites" && (
          <div className="space-y-4">
            {favoritePartners.length === 0 ? (
              <p className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-love-navy/40 shadow-sm">
                お気に入り登録した企業はまだありません。「提携企業一覧」の☆から登録できます
              </p>
            ) : (
              favoritePartners.map((partner) => <PartnerCard key={partner.id} partner={partner} />)
            )}
          </div>
        )}

        {/* 利用履歴 */}
        {activeTab === "history" && (
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-medium text-love-navy/50">LOVE COIN還元履歴</p>
            {usageLog.length === 0 ? (
              <p className="mt-3 text-sm text-love-navy/40">利用履歴はまだありません</p>
            ) : (
              <ul className="mt-3 divide-y divide-black/5">
                {usageLog.map((log) => (
                  <li key={log.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-love-navy">{log.partnerName}</p>
                      <p className="text-xs text-love-navy/40">{log.date}</p>
                    </div>
                    <p className="font-bold text-love-pink-dark">+{log.reward.toLocaleString()} LOVE</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <p className="text-[11px] text-love-navy/30">
          ※ データはサーバー上に保存され、再読み込み後も保持されます。実際の決済連携・加盟店契約・ランク制度はPhase4で本実装予定です。
        </p>
      </div>
    </div>
  );
}
