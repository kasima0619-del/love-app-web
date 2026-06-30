import Link from "next/link";
import TopBar from "@/components/TopBar";
import { currentUser, loveCoin } from "@/lib/mock-data";

const settingsLinks = [
  { href: "/love-coin#history", label: "LOVE COIN 取引履歴", icon: "💗", note: undefined },
  { href: "#", label: "通知設定", icon: "🔔", note: "Phase2で実装予定" },
  { href: "#", label: "セキュリティ設定（MFA・パスワード）", icon: "🔒", note: "Phase2で実装予定" },
  { href: "#", label: "SNS連携設定", icon: "🔗", note: "Phase1後半で実装予定" },
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col">
      <TopBar title="マイページ" subtitle="プロフィール・LOVE COIN・各種設定" category="friend" />

      <div className="space-y-6 p-4 sm:p-8">
        {/* プロフィールヘッダー */}
        <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          <div className="h-20 bg-gradient-to-r from-love-navy to-love-pink-dark sm:h-24" />
          <div className="px-5 pb-5 sm:px-6">
            <div className="-mt-10 flex items-end justify-between">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-love-pink-soft text-3xl font-bold text-love-pink-dark shadow-sm">
                {currentUser.avatarInitial}
              </div>
              <span className="mb-1 rounded-full bg-love-gold-soft px-3 py-1 text-xs font-bold text-love-navy">
                ★ {loveCoin.rank}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-love-navy">{currentUser.name}</h2>
            <p className="text-sm text-love-navy/40">{currentUser.handle}</p>
            <p className="mt-3 text-sm text-love-navy/70">{currentUser.bio}</p>

            {/* 趣味・関心 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {currentUser.interests.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-love-bg px-3 py-1 text-xs font-medium text-love-navy/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 統計情報 */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-black/5 bg-white p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-love-navy">{currentUser.following}</p>
            <p className="mt-1 text-xs text-love-navy/50">フォロー中</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-love-navy">{currentUser.followers}</p>
            <p className="mt-1 text-xs text-love-navy/50">フォロワー</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-love-navy">
              {loveCoin.balance.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-love-navy/50">LOVE COIN</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-love-navy">★ {loveCoin.rank}</p>
            <p className="mt-1 text-xs text-love-navy/50">会員ランク</p>
          </div>
        </section>

        {/* 設定リスト */}
        <section className="rounded-2xl border border-black/5 bg-white shadow-sm">
          <p className="px-5 pt-5 text-sm font-medium text-love-navy/50 sm:px-6">設定・各種メニュー</p>
          <ul className="mt-2 divide-y divide-black/5">
            {settingsLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-love-bg sm:px-6"
                >
                  <span className="flex items-center gap-3 text-sm text-love-navy">
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </span>
                  {item.note ? (
                    <span className="text-[11px] text-love-navy/30">{item.note}</span>
                  ) : (
                    <span className="text-love-navy/30">→</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ログアウト */}
        <section>
          <Link
            href="/login"
            className="block w-full rounded-2xl border border-love-pink/30 bg-white py-3 text-center text-sm font-bold text-love-pink-dark shadow-sm hover:bg-love-pink-soft sm:w-auto sm:px-8"
          >
            ログアウト
          </Link>
        </section>
      </div>
    </div>
  );
}
