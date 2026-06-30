"use client";

import { useEffect, useRef, useState } from "react";

const DEMO_FLOW = [
  { icon: "🦉", label: "ねね", detail: "ねね「明日の予定を作って」と話しかける" },
  { icon: "📅", label: "予定作成", detail: "スケジュールに自動で登録されます" },
  { icon: "📋", label: "アンケート", detail: "アンケートを作成して公開します" },
  { icon: "💗", label: "LOVE COIN獲得", detail: "活動に応じてLOVE COINが貯まります" },
  { icon: "👥", label: "コミュニティ", detail: "コミュニティで応援が循環します" },
] as const;

const STEP_INTERVAL_MS = 1100;

export default function DemoExperience() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  function startDemo() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDone(false);
    setActiveIndex(0);
    DEMO_FLOW.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(setTimeout(() => setActiveIndex(i), STEP_INTERVAL_MS * i));
    });
    timers.current.push(setTimeout(() => setDone(true), STEP_INTERVAL_MS * DEMO_FLOW.length));
  }

  const playing = activeIndex >= 0 && !done;

  return (
    <div className="mt-12 rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm sm:p-8">
      <p className="text-sm font-bold text-love-navy">
        「デモを体験する」を押すと、ねねに話しかけてからLOVE COINを獲得するまでの流れを自動で再生します
      </p>

      <button
        type="button"
        onClick={startDemo}
        disabled={playing}
        className="mt-4 rounded-full bg-love-pink-dark px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-love-pink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {playing ? "デモ再生中..." : activeIndex >= 0 ? "もう一度デモを体験する" : "デモを体験する"}
      </button>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {DEMO_FLOW.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2 sm:gap-3">
            <div
              className={`flex w-24 flex-col items-center gap-1 rounded-2xl border px-3 py-3 transition-all duration-500 sm:w-32 ${
                i <= activeIndex
                  ? "scale-105 border-love-pink-dark bg-love-pink-soft shadow-md"
                  : "border-black/5 bg-love-bg"
              }`}
            >
              <span className="text-2xl">{step.icon}</span>
              <span className="text-xs font-bold text-love-navy sm:text-sm">{step.label}</span>
            </div>
            {i < DEMO_FLOW.length - 1 && <span className="text-love-navy/20">→</span>}
          </div>
        ))}
      </div>

      <p className="mt-6 min-h-[1.25rem] text-sm font-semibold text-love-pink-dark">
        {activeIndex >= 0 ? DEMO_FLOW[activeIndex].detail : ""}
      </p>

      {done && (
        <p className="mt-2 text-sm font-bold text-love-navy">
          🎉 ねねに話しかけるだけで、予定作成からLOVE COIN獲得・コミュニティ参加まで完了しました！
        </p>
      )}
    </div>
  );
}
