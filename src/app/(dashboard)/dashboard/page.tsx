import Link from "next/link";
import TopBar from "@/components/TopBar";
import NeneHomeChat from "@/components/NeneHomeChat";
import NeneFriendsPanel from "@/components/NeneFriendsPanel";
import SnsConnectPanel from "@/components/SnsConnectPanel";
import NeneBadge from "@/components/NeneBadge";
import CategoryTag from "@/components/CategoryTag";
import {
  currentUser,
  loveCoin,
  todaySchedule,
  todayWeather,
  announcements,
  communities,
  matchProfiles,
  partners,
} from "@/lib/mock-data";

const progress = Math.min(
  100,
  Math.round((loveCoin.balance / loveCoin.nextRankTarget) * 100)
);

export default function DashboardPage() {
  const recommendedCommunity = communities.find((c) => !c.joined) ?? communities[0];
  const recommendedMatch = [...matchProfiles].sort((a, b) => b.compatibility - a.compatibility)[0];
  const recommendedPartner = partners[0];

  return (
    <div className="flex flex-col">
      <TopBar title="ホーム" subtitle={`こんにちは、${currentUser.name}さん`} />

      <div className="space-y-8 p-4 pb-56 sm:p-8 sm:pb-48 lg:pb-40">
        {/* LINEのような2カラム構成：左に友達・SNS連携、中央〜右にねねとの会話（主役） */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* 左：友達・SNS連携（モバイルではチャットの下に表示） */}
          <div className="order-2 space-y-4 lg:order-1">
            <NeneFriendsPanel />
            <SnsConnectPanel />
          </div>

          {/* 中央〜右：ねねとの会話（主役）＋ ねねの提案結果 */}
          <div className="order-1 space-y-8 lg:order-2">
            {/* チャットファースト：まずねねに話しかける */}
            <NeneHomeChat />

            {/* ねねの提案結果 */}
            <section>
            <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-love-navy/40">
              🦉 ねねの提案結果
            </p>
            <p className="mb-3 text-center text-[11px] text-love-navy/40">
              ねねとの会話から、こんなサービスへのご案内も届いています
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* コミュニティ提案 */}
              <div className="rounded-2xl border border-black/5 border-l-4 border-l-love-purple bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <NeneBadge variant="discover" />
                  <CategoryTag category="community" />
                </div>
                <p className="mt-3 text-sm font-bold text-love-navy">{recommendedCommunity.name}</p>
                <p className="mt-1 text-xs text-love-navy/50">{recommendedCommunity.description}</p>
                <p className="mt-2 text-[11px] text-love-navy/40">
                  メンバー {recommendedCommunity.members.toLocaleString()}人・{recommendedCommunity.category}
                </p>
                <Link
                  href="/community"
                  className="mt-4 inline-block rounded-full bg-love-purple-soft px-4 py-1.5 text-xs font-semibold text-love-purple-dark"
                >
                  コミュニティを見る →
                </Link>
              </div>

              {/* マッチング推薦 */}
              <div className="rounded-2xl border border-black/5 border-l-4 border-l-love-blue bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <NeneBadge variant="match" />
                  <CategoryTag category="friend" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-love-blue-soft text-lg font-bold text-love-blue-dark">
                    {recommendedMatch.avatarInitial}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-love-navy">{recommendedMatch.name}</p>
                    <p className="text-xs text-love-blue-dark">相性 {recommendedMatch.compatibility}%</p>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-love-navy/50">{recommendedMatch.bio}</p>
                <Link
                  href="/matching"
                  className="mt-4 inline-block rounded-full bg-love-blue-soft px-4 py-1.5 text-xs font-semibold text-love-blue-dark"
                >
                  お相手を見る →
                </Link>
              </div>

              {/* 企業優待推薦 */}
              <div className="rounded-2xl border border-black/5 border-l-4 border-l-love-green bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <NeneBadge variant="recommend" />
                  <CategoryTag category="partner" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-3xl">{recommendedPartner.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-love-navy">{recommendedPartner.name}</p>
                    <p className="text-xs text-love-navy/50">{recommendedPartner.category}</p>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-love-navy/50">
                  {recommendedPartner.campaign ?? recommendedPartner.description}
                </p>
                <Link
                  href="/partners"
                  className="mt-4 inline-block rounded-full bg-love-green-soft px-4 py-1.5 text-xs font-semibold text-love-green-dark"
                >
                  優待を見る →
                </Link>
              </div>

              {/* LOVE COIN（ねね活動報酬） */}
              <div className="rounded-2xl border border-black/5 border-l-4 border-l-love-gold bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <NeneBadge variant="pick" />
                  <CategoryTag category="coin" />
                </div>
                <p className="mt-3 text-2xl font-bold text-love-navy">
                  {loveCoin.balance.toLocaleString()}
                  <span className="ml-1 text-xs font-normal text-love-navy/40">LOVE</span>
                </p>
                <p className="mt-1 text-xs text-love-pink-dark">
                  今月の獲得 +{loveCoin.monthlyEarned.toLocaleString()} LOVE（ねね活動報酬）
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-love-bg">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-love-gold to-love-pink"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-love-navy/40">
                  ランク「{loveCoin.rank}」・次は「{loveCoin.nextRank}」
                </p>
                <Link
                  href="/love-coin"
                  className="mt-3 inline-block rounded-full bg-love-gold-soft px-4 py-1.5 text-xs font-semibold text-love-navy"
                >
                  履歴を見る →
                </Link>
              </div>
            </div>
            </section>
          </div>
        </div>

        {/* 天気・予定・お知らせ（システム通知） */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="col-span-full flex justify-center">
            <CategoryTag category="system" />
          </div>

          {/* 今日の天気 */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-love-navy/50">今日の天気（{todayWeather.area}）</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-4xl">{todayWeather.icon}</span>
              <div>
                <p className="text-2xl font-bold text-love-navy">{todayWeather.temperature}℃</p>
                <p className="text-xs text-love-navy/50">{todayWeather.condition}</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-love-navy/30">
              ※ Phase1は簡易表示。詳細な天気・GPSはPhase2で実装予定
            </p>
          </div>

          {/* 今日の予定 */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-love-navy/50">今日の予定</p>
            <ul className="mt-3 space-y-2">
              {todaySchedule.map((item) => (
                <li key={item.id} className="flex items-start gap-3 text-sm">
                  <span className="w-12 flex-none font-semibold text-love-pink-dark">{item.time}</span>
                  <span className="text-love-navy">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* お知らせ */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-love-navy/50">お知らせ</p>
            <ul className="mt-3 space-y-3">
              {announcements.map((a) => (
                <li key={a.id} className="text-sm">
                  <p className="text-love-navy">{a.title}</p>
                  <p className="text-[11px] text-love-navy/40">{a.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
