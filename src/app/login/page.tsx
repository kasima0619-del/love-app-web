"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Phase1モック: 認証APIは未接続。入力の有無に関わらずダッシュボードへ遷移する
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-love-pink via-love-pink-soft to-love-navy p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        {/* ブランディングパネル */}
        <div className="flex flex-col items-center justify-center gap-4 bg-love-navy px-8 py-12 text-center text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-love-pink text-4xl shadow-lg">
            💗
          </div>
          <h1 className="text-3xl font-black tracking-wide">LOVE</h1>
          <p className="text-sm text-white/70">
            つながる、創る、叶える。
            <br />
            次世代コミュニティプラットフォーム
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-love-gold">
            🦉 AI秘書「ねね」がいつもサポートします
          </div>
        </div>

        {/* ログインフォーム */}
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12">
          <h2 className="text-2xl font-bold text-love-navy">ログイン</h2>
          <p className="mt-2 text-sm text-love-navy/50">
            アカウント情報を入力してLOVEへようこそ
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-love-navy">
                メールアドレス / ユーザー名
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-love-navy">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-love-navy/50">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-black/20" />
                ログイン状態を保持する
              </label>
              <a href="#" className="text-love-pink-dark hover:underline">
                パスワードを忘れた方
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-love-pink px-4 py-3 text-sm font-bold text-white shadow-lg shadow-love-pink/30 transition-transform hover:scale-[1.01] hover:bg-love-pink-dark"
            >
              ログイン
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-love-navy/50">
            アカウントをお持ちでない方は{" "}
            <a href="#" className="font-semibold text-love-pink-dark hover:underline">
              新規登録
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
