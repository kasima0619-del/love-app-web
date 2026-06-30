import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LOVEアプリ | 人とAIとサービスをつなぐAIハブ",
  description:
    "AI秘書「ねね」に話しかけるだけ。予定管理・投稿作成・アンケート・マッチング・コミュニティ・送金・LOVE COINがすべて一つにつながる、次世代AIハブ「LOVEアプリ」。",
};

const heroFeatures = [
  "予定管理",
  "投稿作成",
  "アンケート",
  "マッチング",
  "コミュニティ",
  "送金",
  "LOVE COIN",
];

const steps = [
  {
    step: "STEP1",
    icon: "💬",
    title: "ねねに話しかける",
    body: "「予定を作って」「アンケートを作って」など、思いついたことをそのまま伝えるだけ。",
  },
  {
    step: "STEP2",
    icon: "🦉",
    title: "ねねが最適なサービスへ案内",
    body: "スケジュール・アンケート・マッチング・コミュニティなど、内容に合わせて最適な機能へ自動で案内します。",
  },
  {
    step: "STEP3",
    icon: "💗",
    title: "行動するとLOVE COIN獲得",
    body: "予定作成やアンケート投稿、コミュニティ参加など、行動するたびにLOVE COINが貯まります。",
  },
  {
    step: "STEP4",
    icon: "🤝",
    title: "コミュニティや企業とつながる",
    body: "貯まったLOVE COINで、コミュニティの仲間や提携企業ともっとつながれます。",
  },
];

const futureConnections = [
  { icon: "📸", name: "Instagram連携" },
  { icon: "🐦", name: "X連携" },
  { icon: "💬", name: "LINE連携" },
  { icon: "📅", name: "予約サービス連携" },
  { icon: "🛍️", name: "EC連携" },
  { icon: "🎬", name: "動画生成連携" },
  { icon: "🖼️", name: "画像生成連携" },
  { icon: "💳", name: "決済連携" },
];

export default function LpHomePage() {
  return (
    <div className="bg-love-bg">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-love-navy/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <span className="text-lg font-bold text-white">LOVE</span>
          <nav className="hidden gap-6 text-sm font-medium text-white/80 lg:flex">
            <a href="#about" className="hover:text-white">LOVEアプリとは</a>
            <a href="#how-it-works" className="hover:text-white">使い方</a>
            <a href="#future" className="hover:text-white">将来構想</a>
          </nav>
          <Link
            href="/lp/crowdfunding#support"
            className="rounded-full bg-love-pink-dark px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-love-pink"
          >
            応援する
          </Link>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-love-navy via-love-navy to-love-pink-dark px-4 py-20 text-center text-white sm:px-6 sm:py-28 lg:px-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-love-pink/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-love-gold/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-love-gold-soft backdrop-blur">
            🦉 AIハブ構想
          </span>

          <h1 className="mt-6 text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
            人とAIとサービスをつなぐ
            <br />
            <span className="text-love-pink-soft">LOVEアプリ</span>
          </h1>

          <p className="mt-8 text-base font-bold leading-relaxed sm:text-lg">
            AI秘書「ねね」に話しかけるだけ。
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {heroFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white sm:text-sm"
              >
                {feature}
              </span>
            ))}
          </div>

          <p className="mt-6 text-xl font-bold text-love-gold-soft sm:text-2xl">
            すべてを一つにつなぎます。
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/lp/crowdfunding#demo"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-love-pink-dark shadow-lg transition hover:bg-love-pink-soft sm:text-base"
            >
              デモを見る
            </Link>
            <Link
              href="/lp/crowdfunding#support"
              className="rounded-full bg-love-pink-dark px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-love-pink sm:text-base"
            >
              クラファンで応援する
            </Link>
          </div>
        </div>
      </section>

      {/* LOVEアプリとは */}
      <section id="about" className="bg-love-bg px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-love-pink-soft px-3 py-1 text-xs font-bold text-love-pink-dark">
            LOVEアプリとは
          </span>

          <div className="mt-6 space-y-2">
            <p className="text-base font-semibold text-love-navy/40 line-through sm:text-lg">
              LOVEアプリはSNSではありません。
            </p>
            <p className="text-base font-semibold text-love-navy/40 line-through sm:text-lg">
              チャットアプリでもありません。
            </p>
          </div>

          <p className="mt-8 text-xl font-bold leading-relaxed text-love-navy sm:text-3xl">
            AI秘書「ねね」が
            <br />
            人とサービスをつなぐ
            <br />
            <span className="text-love-pink-dark">次世代AIハブ</span>です。
          </p>
        </div>
      </section>

      {/* 使い方 */}
      <section id="how-it-works" className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-love-pink-soft px-3 py-1 text-xs font-bold text-love-pink-dark">
              使い方
            </span>
            <h2 className="mt-3 text-2xl font-bold text-love-navy sm:text-3xl">たった4ステップ</h2>
          </div>

          <div className="mt-10">
            {steps.map((s, i) => (
              <div key={s.step}>
                <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-love-bg p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-love-pink-dark text-xl text-white">
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-love-pink-dark">{s.step}</p>
                    <p className="mt-0.5 text-sm font-bold text-love-navy sm:text-base">{s.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-love-navy/60">{s.body}</p>
                  </div>
                </div>
                {i < steps.length - 1 ? (
                  <p className="py-1 text-center text-xl text-love-navy/20">↓</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 将来構想 */}
      <section id="future" className="bg-love-navy px-4 py-16 text-center text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-love-gold-soft">
            将来構想
          </span>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">あらゆるサービスをLOVEひとつに</h2>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {futureConnections.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-2 text-xs font-semibold sm:text-sm">{item.name}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-lg font-bold leading-relaxed text-love-gold-soft sm:text-2xl">
            LOVEアプリは
            <br />
            あらゆるサービスをつなぐ
            <br />
            AIハブを目指します。
          </p>
        </div>
      </section>

      {/* クラファン支援セクション */}
      <section id="cta" className="bg-gradient-to-br from-love-pink-dark to-love-navy px-4 py-16 text-center text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-base leading-relaxed sm:text-lg">私たちは</p>
          <p className="mt-3 text-xl font-bold leading-relaxed sm:text-2xl">「人がアプリを探す時代」</p>
          <p className="mt-4 text-sm text-love-gold-soft sm:text-base">から</p>
          <p className="mt-3 text-xl font-bold leading-relaxed sm:text-2xl">「AIが最適なサービスへ案内する時代」</p>
          <p className="mt-4 text-base leading-relaxed sm:text-lg">を作ります。</p>

          <p className="mt-8 text-base font-bold sm:text-lg">LOVEアプリ開発を応援してください。</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/lp/crowdfunding#support"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-love-pink-dark shadow-lg transition hover:bg-love-pink-soft sm:text-base"
            >
              クラファンで応援する
            </Link>
            <Link
              href="/lp/crowdfunding"
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/10 sm:text-base"
            >
              詳しく見る
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-love-navy px-4 py-8 text-center text-xs text-white/60 sm:px-6">
        <p>合同会社LOVE</p>
        <p className="mt-1">© 2026 LOVE. All rights reserved.</p>
        <Link href="/login" className="mt-3 inline-block text-white/40 underline">
          ログインしてLOVEアプリを試す
        </Link>
      </footer>
    </div>
  );
}
