"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { surveyCategories, surveyTypeLabels, type SurveyItem, type SurveyType } from "@/lib/mock-data";
import { notifyLoveCoinUpdated } from "@/lib/hooks/use-love-coin";

const tabs = [
  { id: "list", label: "📋 アンケート一覧" },
  { id: "create", label: "✏️ アンケート作成" },
  { id: "ranking", label: "🏆 ランキング" },
] as const;
type TabId = (typeof tabs)[number]["id"];

const typeFilters = ["すべて", "個人", "コミュニティ", "企業"] as const;
type TypeFilter = (typeof typeFilters)[number];
const typeFilterMap: Record<TypeFilter, SurveyType | null> = {
  すべて: null,
  個人: "personal",
  コミュニティ: "community",
  企業: "corporate",
};

export default function SurveyPage() {
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>("list");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("すべて");

  const [formType, setFormType] = useState<SurveyType>("personal");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState(surveyCategories[0]);
  const [formCommunityName, setFormCommunityName] = useState("");
  const [formCompanyName, setFormCompanyName] = useState("");
  const [formReward, setFormReward] = useState(10);
  const [formOptions, setFormOptions] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/survey")
      .then((res) => {
        if (!res.ok) throw new Error("failed to load");
        return res.json() as Promise<{ surveys: SurveyItem[] }>;
      })
      .then((data) => {
        if (!active) return;
        setSurveys(data.surveys);
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

  async function vote(surveyId: string, optionId: string) {
    setError(null);
    try {
      const res = await fetch(`/api/survey/${surveyId}/answer`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { survey: SurveyItem; reward: number };
      setSurveys((prev) => prev.map((s) => (s.id === surveyId ? data.survey : s)));
      setRewardToast(`回答ありがとうございます！+${data.reward} LOVE COINを獲得しました`);
      notifyLoveCoinUpdated();
      setTimeout(() => setRewardToast(null), 3000);
    } catch {
      setError("回答の送信に失敗しました。");
    }
  }

  function addOption() {
    setFormOptions((prev) => (prev.length >= 5 ? prev : [...prev, ""]));
  }

  function removeOption(index: number) {
    setFormOptions((prev) => (prev.length <= 2 ? prev : prev.filter((_, i) => i !== index)));
  }

  function updateOption(index: number, value: string) {
    setFormOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  const canSubmit =
    formTitle.trim().length > 0 &&
    formOptions.filter((o) => o.trim().length > 0).length >= 2 &&
    (formType !== "community" || formCommunityName.trim().length > 0) &&
    (formType !== "corporate" || formCompanyName.trim().length > 0);

  async function submitSurvey() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: formType,
          title: formTitle,
          description: formDescription,
          category: formCategory,
          communityName: formCommunityName,
          companyName: formCompanyName,
          reward: formReward,
          options: formOptions,
        }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { survey: SurveyItem };
      setSurveys((prev) => [data.survey, ...prev]);
      setFormTitle("");
      setFormDescription("");
      setFormCommunityName("");
      setFormCompanyName("");
      setFormReward(10);
      setFormOptions(["", ""]);
      setActiveTab("list");
    } catch {
      setError("アンケートの作成に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredSurveys = surveys.filter((s) => {
    const target = typeFilterMap[typeFilter];
    return target === null || s.type === target;
  });

  const ranking = [...surveys]
    .map((s) => ({ survey: s, total: s.options.reduce((sum, o) => sum + o.votes, 0) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col">
        <TopBar title="アンケート" subtitle="回答してLOVE COINを獲得" category="community" />
        <div className="p-8 text-center text-sm text-love-navy/40">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <TopBar title="アンケート" subtitle="回答してLOVE COINを獲得" />

      <div className="space-y-6 p-4 sm:p-8">
        {error && (
          <div className="rounded-2xl border border-love-pink/30 bg-love-pink-soft px-4 py-3 text-sm text-love-pink-dark">
            {error}
          </div>
        )}

        {rewardToast && (
          <div className="rounded-2xl border border-love-gold/40 bg-love-gold-soft px-4 py-3 text-sm font-semibold text-love-navy">
            💗 {rewardToast}
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

        {/* アンケート一覧 */}
        {activeTab === "list" && (
          <div className="space-y-4">
            <section className="flex flex-wrap gap-2">
              {typeFilters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTypeFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    typeFilter === f
                      ? "bg-love-pink text-white"
                      : "border border-black/5 bg-white text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
                  }`}
                >
                  {f}
                </button>
              ))}
            </section>

            {filteredSurveys.length === 0 ? (
              <p className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-love-navy/40 shadow-sm">
                該当するアンケートはまだありません
              </p>
            ) : (
              filteredSurveys.map((survey) => {
                const total = survey.options.reduce((sum, o) => sum + o.votes, 0);
                const answered = survey.answeredOptionId !== null;
                const showResults = answered || survey.status === "終了";
                return (
                  <div key={survey.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-love-pink-soft px-2.5 py-1 text-[11px] font-semibold text-love-pink-dark">
                          {surveyTypeLabels[survey.type]}
                        </span>
                        <span className="rounded-full bg-love-bg px-2.5 py-1 text-[11px] font-semibold text-love-navy/60">
                          {survey.category}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            survey.status === "公開中" ? "bg-love-gold-soft text-love-navy" : "bg-black/5 text-love-navy/40"
                          }`}
                        >
                          {survey.status}
                        </span>
                      </div>
                      <span className="flex-none rounded-full bg-love-gold-soft px-2.5 py-1 text-[11px] font-bold text-love-navy">
                        💗 +{survey.reward} LOVE
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-love-navy">{survey.title}</h3>
                    <p className="mt-1 text-sm text-love-navy/60">{survey.description}</p>
                    <p className="mt-2 text-xs text-love-navy/40">
                      {survey.communityName ?? survey.companyName ?? survey.authorName} ・ {survey.createdAt}
                    </p>

                    <div className="mt-4 space-y-2">
                      {survey.options.map((option) => {
                        const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;
                        const isAnswer = survey.answeredOptionId === option.id;
                        if (showResults) {
                          return (
                            <div key={option.id}>
                              <div className="flex items-center justify-between text-xs text-love-navy/70">
                                <span className={isAnswer ? "font-bold text-love-pink-dark" : ""}>
                                  {isAnswer && "✓ "}
                                  {option.label}
                                </span>
                                <span className="font-semibold text-love-navy">{pct}%</span>
                              </div>
                              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-love-bg">
                                <div
                                  className={`h-full rounded-full ${
                                    isAnswer ? "bg-gradient-to-r from-love-gold to-love-pink" : "bg-love-navy-light/30"
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        }
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => vote(survey.id, option.id)}
                            className="w-full rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-left text-sm font-medium text-love-navy transition-colors hover:border-love-pink hover:bg-love-pink-soft"
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-xs text-love-navy/40">
                      {total.toLocaleString()}人が回答{answered && "・回答済み"}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* アンケート作成 */}
        {activeTab === "create" && (
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-love-navy/50">新しいアンケートを作成</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.entries(surveyTypeLabels) as [SurveyType, string][]).map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormType(type)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    formType === type
                      ? "bg-love-pink text-white"
                      : "bg-love-bg text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
                  }`}
                >
                  {label}アンケート
                </button>
              ))}
            </div>

            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="アンケートのタイトル"
              className="mt-3 w-full rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
            />
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="アンケートの説明（任意）"
              rows={2}
              className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
            />

            {formType === "community" && (
              <input
                value={formCommunityName}
                onChange={(e) => setFormCommunityName(e.target.value)}
                placeholder="コミュニティ名"
                className="mt-2 w-full rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
              />
            )}
            {formType === "corporate" && (
              <input
                value={formCompanyName}
                onChange={(e) => setFormCompanyName(e.target.value)}
                placeholder="企業名"
                className="mt-2 w-full rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
              />
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-love-navy/50">カテゴリー</span>
              {surveyCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormCategory(c)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    formCategory === c
                      ? "bg-love-pink text-white"
                      : "bg-love-bg text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-love-navy/50">選択肢（2〜5個）</p>
              <div className="mt-2 space-y-2">
                {formOptions.map((option, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={option}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`選択肢 ${i + 1}`}
                      className="flex-1 rounded-xl border border-black/10 bg-love-bg px-4 py-2 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
                    />
                    {formOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-love-bg text-love-navy/40 hover:bg-love-pink-soft hover:text-love-pink-dark"
                        aria-label="選択肢を削除"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {formOptions.length < 5 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 rounded-full bg-love-bg px-3 py-1.5 text-xs font-semibold text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
                >
                  + 選択肢を追加
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-love-navy/50">
                回答報酬
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={formReward}
                  onChange={(e) => setFormReward(Math.max(0, Number(e.target.value) || 0))}
                  className="w-20 rounded-lg border border-black/10 bg-love-bg px-2 py-1 text-sm text-love-navy outline-none focus:border-love-pink"
                />
                LOVE COIN
              </label>
              <button
                type="button"
                onClick={submitSurvey}
                disabled={!canSubmit || submitting}
                className="rounded-full bg-love-pink px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-love-pink-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "作成中..." : "アンケートを作成する"}
              </button>
            </div>
          </section>
        )}

        {/* ランキング */}
        {activeTab === "ranking" && (
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-medium text-love-navy/50">回答数ランキング</p>
            <ul className="mt-3 space-y-3">
              {ranking.map(({ survey, total }, i) => (
                <li
                  key={survey.id}
                  className="flex items-center gap-3 border-b border-black/5 pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-love-gold-soft text-base font-bold text-love-navy">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-love-pink-soft px-2 py-0.5 text-[10px] font-semibold text-love-pink-dark">
                        {surveyTypeLabels[survey.type]}
                      </span>
                      <h3 className="text-sm font-bold text-love-navy">{survey.title}</h3>
                    </div>
                    <p className="text-xs text-love-navy/40">
                      {survey.communityName ?? survey.companyName ?? survey.authorName}
                    </p>
                  </div>
                  <p className="flex-none text-sm font-bold text-love-navy">{total.toLocaleString()}件</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-[11px] text-love-navy/30">
          ※ データはサーバー上に保存され、再読み込み後も保持されます。LOVE COINの実際の付与・決済連携はPhase4以降で本実装予定です。
        </p>
      </div>
    </div>
  );
}
