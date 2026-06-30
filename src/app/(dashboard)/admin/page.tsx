"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import {
  adminStats,
  adminMembers,
  adminCoinLog,
  adminPartners,
  adminFeatureRanking,
  adminSignupTrend,
  surveyTypeLabels,
  type AdminMember,
  type AdminPartner,
  type SurveyItem,
} from "@/lib/mock-data";

const tabs = [
  { id: "overview", label: "概要" },
  { id: "members", label: "会員管理" },
  { id: "coin", label: "LOVE COIN管理" },
  { id: "survey", label: "アンケート管理" },
  { id: "partner", label: "企業パートナー管理" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const coinTypeStyles: Record<string, string> = {
  付与: "bg-love-gold-soft text-love-navy",
  送金: "bg-love-pink-soft text-love-pink-dark",
  チャージ: "bg-love-bg text-love-navy/60",
  出金: "bg-black/5 text-love-navy/50",
};

function buildConicGradient(data: { value: number; color: string }[]) {
  let cumulative = 0;
  const segments = data.map((d) => {
    const start = cumulative;
    cumulative += d.value;
    return `${d.color} ${start}% ${cumulative}%`;
  });
  return `conic-gradient(${segments.join(", ")})`;
}

const chartWidth = 280;
const chartHeight = 100;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [members, setMembers] = useState<AdminMember[]>(adminMembers);
  const [partners, setPartners] = useState<AdminPartner[]>(adminPartners);
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [surveysLoading, setSurveysLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/survey")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load");
        return res.json() as Promise<{ surveys: SurveyItem[] }>;
      })
      .then((data) => {
        if (active) setSurveys(data.surveys);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setSurveysLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function toggleMemberStatus(id: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m
      )
    );
  }

  function togglePartnerStatus(id: string) {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "提携中" ? "審査中" : "提携中" } : p
      )
    );
  }

  const maxSignup = Math.max(...adminSignupTrend.map((d) => d.count));
  const linePoints = adminSignupTrend
    .map((d, i) => {
      const x = (i / (adminSignupTrend.length - 1)) * chartWidth;
      const y = chartHeight - (d.count / maxSignup) * (chartHeight - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");

  const donutGradient = buildConicGradient(
    adminFeatureRanking.map((f) => ({ value: f.value, color: f.color }))
  );

  return (
    <div className="flex flex-col">
      <TopBar title="管理者ダッシュボード" subtitle="プラットフォーム全体の状況を確認・管理できます" category="system" />

      <div className="space-y-6 p-4 sm:p-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-love-navy to-love-pink-dark p-6 text-white sm:p-8">
          <p className="text-xs uppercase tracking-widest text-love-gold">ADMIN DASHBOARD</p>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">プラットフォーム管理</h2>
          <p className="mt-2 text-sm text-white/70">
            会員・LOVE COIN・アンケート・企業パートナーをまとめて管理できます。
          </p>
        </section>

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

        {/* 概要 */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {adminStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-love-pink-soft text-xl">
                      {stat.icon}
                    </span>
                    <p className="text-xs font-medium text-love-navy/50">{stat.label}</p>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-love-navy">
                    {stat.value}
                    <span className="ml-1 text-xs font-normal text-love-navy/40">{stat.unit}</span>
                  </p>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* 新規登録者数 */}
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-medium text-love-navy/50">新規登録者数（過去7日間）</p>
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="mt-3 w-full" preserveAspectRatio="none">
                  <polyline points={linePoints} fill="none" stroke="var(--color-love-pink)" strokeWidth="2" />
                  {adminSignupTrend.map((d, i) => {
                    const x = (i / (adminSignupTrend.length - 1)) * chartWidth;
                    const y = chartHeight - (d.count / maxSignup) * (chartHeight - 10) - 5;
                    return <circle key={d.date} cx={x} cy={y} r={2.5} fill="var(--color-love-pink-dark)" />;
                  })}
                </svg>
                <div className="mt-1 flex justify-between text-[11px] text-love-navy/40">
                  {adminSignupTrend.map((d) => (
                    <span key={d.date}>{d.date}</span>
                  ))}
                </div>
              </div>

              {/* 人気機能ランキング */}
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-medium text-love-navy/50">人気機能ランキング</p>
                <div className="mt-4 flex items-center gap-6">
                  <div className="relative h-32 w-32 flex-none rounded-full" style={{ background: donutGradient }}>
                    <div className="absolute inset-3 rounded-full bg-white" />
                  </div>
                  <ul className="flex-1 space-y-1.5">
                    {adminFeatureRanking.map((f) => (
                      <li key={f.label} className="flex items-center gap-2 text-xs text-love-navy/70">
                        <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ backgroundColor: f.color }} />
                        <span className="flex-1">{f.label}</span>
                        <span className="font-semibold text-love-navy">{f.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 会員管理 */}
        {activeTab === "members" && (
          <section className="overflow-x-auto rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-medium text-love-navy/50">会員一覧</p>
            <table className="mt-3 w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-xs text-love-navy/40">
                  <th className="py-2 font-medium">会員</th>
                  <th className="py-2 font-medium">ランク</th>
                  <th className="py-2 font-medium">登録日</th>
                  <th className="py-2 font-medium">状態</th>
                  <th className="py-2 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {members.map((m) => (
                  <tr key={m.id}>
                    <td className="py-3">
                      <p className="font-semibold text-love-navy">{m.name}</p>
                      <p className="text-xs text-love-navy/40">{m.handle}</p>
                    </td>
                    <td className="py-3 text-love-navy/70">{m.rank}</td>
                    <td className="py-3 text-love-navy/70">{m.joined}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          m.status === "active" ? "bg-love-gold-soft text-love-navy" : "bg-black/5 text-love-navy/40"
                        }`}
                      >
                        {m.status === "active" ? "アクティブ" : "停止中"}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleMemberStatus(m.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                          m.status === "active"
                            ? "bg-love-bg text-love-navy/60 hover:bg-black/5"
                            : "bg-love-pink text-white hover:bg-love-pink-dark"
                        }`}
                      >
                        {m.status === "active" ? "停止する" : "復帰させる"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* LOVE COIN管理 */}
        {activeTab === "coin" && (
          <div className="space-y-4">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium text-love-navy/50">LOVE COIN総流通量</p>
                <p className="mt-2 text-3xl font-bold text-love-navy">
                  {adminStats[1].value}
                  <span className="ml-1 text-sm font-normal text-love-navy/40">{adminStats[1].unit}</span>
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium text-love-navy/50">本日の取引件数</p>
                <p className="mt-2 text-3xl font-bold text-love-navy">
                  {adminCoinLog.length}
                  <span className="ml-1 text-sm font-normal text-love-navy/40">件</span>
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-medium text-love-navy/50">取引ログ</p>
              <ul className="mt-3 divide-y divide-black/5">
                {adminCoinLog.map((log) => (
                  <li key={log.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${coinTypeStyles[log.type]}`}>
                          {log.type}
                        </span>
                        <p className="font-semibold text-love-navy">{log.member}</p>
                      </div>
                      <p className="mt-1 text-xs text-love-navy/40">{log.reason}</p>
                    </div>
                    <div className="flex-none text-right">
                      <p className="font-bold text-love-navy">
                        {log.type === "送金" || log.type === "出金" ? "-" : "+"}
                        {log.amount.toLocaleString()} LOVE
                      </p>
                      <p className="text-[11px] text-love-navy/40">{log.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* アンケート管理 */}
        {activeTab === "survey" && (
          <section className="space-y-4">
            {surveysLoading ? (
              <p className="text-center text-sm text-love-navy/40">読み込み中...</p>
            ) : (
              surveys.map((survey) => {
                const total = survey.options.reduce((sum, o) => sum + o.votes, 0);
                const topOption = survey.options.reduce(
                  (max, o) => (o.votes > max.votes ? o : max),
                  survey.options[0]
                );
                const topAnswerRate = total > 0 ? Math.round((topOption.votes / total) * 100) : 0;
                return (
                  <div key={survey.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-love-pink-soft px-2.5 py-1 text-[11px] font-semibold text-love-pink-dark">
                          {surveyTypeLabels[survey.type]}
                        </span>
                        <h3 className="text-sm font-bold text-love-navy">{survey.title}</h3>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          survey.status === "公開中" ? "bg-love-gold-soft text-love-navy" : "bg-black/5 text-love-navy/40"
                        }`}
                      >
                        {survey.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-love-navy/40">
                      回答数 {total.toLocaleString()}件 ・ 報酬 {survey.reward} LOVE
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-love-navy/60">
                        <span>最多回答：{topOption.label}</span>
                        <span className="font-semibold text-love-navy">{topAnswerRate}%</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-love-bg">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-love-gold to-love-pink"
                          style={{ width: `${topAnswerRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

        {/* 企業パートナー管理 */}
        {activeTab === "partner" && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {partners.map((p) => (
              <div key={p.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-love-pink-soft px-2.5 py-1 text-[11px] font-semibold text-love-pink-dark">
                      {p.category}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-love-navy">{p.name}</h3>
                  </div>
                  <span
                    className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      p.status === "提携中" ? "bg-love-gold-soft text-love-navy" : "bg-black/5 text-love-navy/40"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-love-navy/60">キャッシュバック率：{p.cashback}</p>
                <button
                  type="button"
                  onClick={() => togglePartnerStatus(p.id)}
                  className={`mt-3 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                    p.status === "提携中"
                      ? "bg-love-bg text-love-navy/60 hover:bg-black/5"
                      : "bg-love-pink text-white hover:bg-love-pink-dark"
                  }`}
                >
                  {p.status === "提携中" ? "提携を停止する" : "提携を承認する"}
                </button>
              </div>
            ))}
          </section>
        )}

        <p className="text-[11px] text-love-navy/30">
          ※ 表示は体験版です。実際の権限管理・操作ログ・課金連携はPhase4で本実装予定です。
        </p>
      </div>
    </div>
  );
}
