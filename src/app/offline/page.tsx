import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "オフライン | LOVE",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-love-bg px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-love-pink-soft text-3xl">
        📡
      </div>
      <h1 className="text-xl font-bold text-love-navy">オフラインです</h1>
      <p className="text-sm leading-relaxed text-love-navy/60">
        インターネット接続が確認できません。
        <br />
        接続を確認してから、もう一度お試しください。
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-love-pink-dark px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-love-pink"
      >
        再読み込み
      </Link>
    </main>
  );
}
