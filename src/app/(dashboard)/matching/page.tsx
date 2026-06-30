"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import type { MatchProfile } from "@/lib/mock-data";

const tabs = [
  { id: "discover", label: "🔍 おすすめ" },
  { id: "matches", label: "💞 マッチ一覧" },
] as const;
type TabId = (typeof tabs)[number]["id"];

export default function MatchingPage() {
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchToast, setMatchToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("discover");

  useEffect(() => {
    let active = true;
    fetch("/api/matching")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load");
        return res.json() as Promise<{ profiles: MatchProfile[]; likedIds: string[] }>;
      })
      .then((data) => {
        if (!active) return;
        setProfiles(data.profiles);
        setLikedIds(data.likedIds);
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

  async function toggleLike(profile: MatchProfile) {
    setError(null);
    try {
      const res = await fetch(`/api/matching/${profile.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { likedIds: string[]; matched: boolean };
      setLikedIds(data.likedIds);
      if (data.matched) {
        setMatchToast(`🎉 ${profile.name}さんとマッチしました！メッセージを送ってみましょう`);
        setTimeout(() => setMatchToast(null), 4000);
      }
    } catch {
      setError("いいねの送信に失敗しました。");
    }
  }

  const matches = profiles.filter((p) => likedIds.includes(p.id) && p.likesYou);
  const matchedIds = new Set(matches.map((p) => p.id));
  const discoverProfiles = profiles.filter((p) => !matchedIds.has(p.id));

  if (loading) {
    return (
      <div className="flex flex-col">
        <TopBar title="LOVEマッチング" subtitle="プロフィールでつながる新しい出会い" category="friend" />
        <div className="p-8 text-center text-sm text-love-navy/40">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <TopBar title="LOVEマッチング" subtitle="プロフィールでつながる新しい出会い" category="friend" />

      <div className="space-y-6 p-4 sm:p-8">
        {error && (
          <div className="rounded-2xl border border-love-pink/30 bg-love-pink-soft px-4 py-3 text-sm text-love-pink-dark">
            {error}
          </div>
        )}

        {matchToast && (
          <div className="rounded-2xl border border-love-gold/40 bg-love-gold-soft px-4 py-3 text-sm font-semibold text-love-navy">
            {matchToast}
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
              {t.id === "matches" && matches.length > 0 && (
                <span className="ml-1.5 rounded-full bg-love-gold-soft px-1.5 py-0.5 text-[10px] text-love-navy">
                  {matches.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* おすすめ */}
        {activeTab === "discover" && (
          <div className="space-y-4">
            {discoverProfiles.length === 0 ? (
              <p className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-love-navy/40 shadow-sm">
                新しいおすすめは見つかりませんでした
              </p>
            ) : (
              discoverProfiles.map((profile) => {
                const liked = likedIds.includes(profile.id);
                return (
                  <div key={profile.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-love-pink-soft text-2xl font-bold text-love-pink-dark">
                        {profile.avatarInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-bold text-love-navy">
                              {profile.name}
                              <span className="ml-2 text-sm font-normal text-love-navy/40">{profile.age}歳</span>
                            </h3>
                            <p className="text-xs text-love-navy/40">
                              {profile.handle} ・ {profile.location}
                            </p>
                          </div>
                          <span className="flex-none rounded-full bg-love-gold-soft px-2.5 py-1 text-[11px] font-bold text-love-navy">
                            相性 {profile.compatibility}%
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-love-navy/70">{profile.bio}</p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.interests.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-love-bg px-3 py-1 text-xs font-medium text-love-navy/70"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {profile.likesYou && !liked && (
                          <p className="mt-2 text-xs font-semibold text-love-pink-dark">
                            💌 あなたにいいねしています
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => toggleLike(profile)}
                        className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                          liked
                            ? "bg-love-pink-soft text-love-pink-dark"
                            : "bg-love-pink text-white hover:bg-love-pink-dark"
                        }`}
                      >
                        {liked ? "💗 いいね済み" : "♡ いいね"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* マッチ一覧 */}
        {activeTab === "matches" && (
          <div className="space-y-4">
            {matches.length === 0 ? (
              <p className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-love-navy/40 shadow-sm">
                まだマッチしたお相手はいません。「おすすめ」からいいねしてみましょう
              </p>
            ) : (
              matches.map((profile) => (
                <div
                  key={profile.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-love-pink-soft text-xl font-bold text-love-pink-dark">
                    {profile.avatarInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-love-navy">
                      {profile.name}
                      <span className="ml-2 text-sm font-normal text-love-navy/40">{profile.age}歳</span>
                    </h3>
                    <p className="text-xs text-love-navy/40">
                      {profile.handle} ・ {profile.location}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {profile.interests.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-love-bg px-3 py-1 text-xs font-medium text-love-navy/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/messages"
                    className="flex-none rounded-full bg-love-pink px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-love-pink-dark"
                  >
                    メッセージを送る
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        <p className="text-[11px] text-love-navy/30">
          ※ データはサーバー上に保存され、再読み込み後も保持されます。プロフィール公開設定やモデレーション体制を含む本実装はPhase4で予定です。
        </p>
      </div>
    </div>
  );
}
