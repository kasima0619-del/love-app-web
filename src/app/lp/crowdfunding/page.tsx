import type { Metadata } from "next";
import DemoExperience from "./DemoExperience";

export const metadata: Metadata = {
  title: "LOVE | クラウドファンディング特設ページ",
  description:
    "AI秘書「ねね」とLOVE COINで、応援が循環するコミュニティ型プラットフォーム「LOVE」。合同会社LOVEのクラウドファンディング特設ページ。",
};

const companyValues = [
  {
    title: "設立目的",
    body:
      "「発信したいけれど何を書けばいいか分からない」「応援してもらえているか実感しにくい」――そんな声に応えるため、AIとLOVE COINを軸にした新しいSNS体験をつくる目的で合同会社LOVEを設立しました。",
  },
  {
    title: "理念",
    body:
      "「好きを応援し合う文化をつくる」。発信する人にはAI秘書がそっと寄り添い、応援する人にはLOVE COINという形で気持ちが還る。両方が報われる循環を理念としています。",
  },
  {
    title: "ビジョン",
    body:
      "将来的には、X・Instagram・TikTokなど複数のSNSをLOVEひとつでつなぎ、投稿・分析・収益化までをワンストップで支える「SNS版Stripe」を目指します。",
  },
];

const whyLove = [
  {
    icon: "📱",
    title: "SNSが増えすぎて運用が大変",
    body:
      "投稿先が増えるほど、文章を考える時間も管理の手間も増えていきます。個人で複数のSNSを使いこなすのは簡単ではありません。",
  },
  {
    icon: "💬",
    title: "応援が伝わりにくい",
    body:
      "「いいね」だけでは気持ちが伝わりにくく、発信を続けるモチベーションを保つのは難しいものです。",
  },
  {
    icon: "🦉",
    title: "自分専属の相談相手がいない",
    body:
      "投稿のアイデア出しやスケジュール調整を、いつでも気軽に相談できる相手は、これまでありませんでした。",
  },
];

const comparisonRows = [
  {
    item: "投稿のサポート",
    existing: "自分で文章やネタを考える必要がある",
    love: "AI秘書「ねね」が投稿文・ハッシュタグ案を提案",
  },
  {
    item: "応援の形",
    existing: "「いいね」やフォローのみ",
    love: "LOVE COINが貯まり、ランクや特典に直結",
  },
  {
    item: "つながり方",
    existing: "フィード中心で一方通行になりやすい",
    love: "コミュニティ単位での交流・アンケート・イベント",
  },
  {
    item: "予定・タスク管理",
    existing: "別アプリで管理が必要",
    love: "ねねに話すだけで週間スケジュールに追加",
  },
  {
    item: "複数SNSの運用（将来構想）",
    existing: "SNSごとに個別管理",
    love: "LOVE APIで一括投稿・管理を構想中",
  },
];

const neneFeatures = [
  { icon: "💬", title: "チャット相談", body: "悩みごとや発信のアイデアを、ねねにいつでも気軽に相談できます。" },
  { icon: "✍️", title: "投稿支援", body: "テーマを伝えるだけで、SNS投稿文とハッシュタグ案を自動生成します。" },
  { icon: "📋", title: "アンケート作成", body: "コミュニティ向けアンケートの質問・選択肢をねねが提案します。" },
  { icon: "📅", title: "予定管理", body: "「来週ミーティングしたい」のひと言から、週間スケジュールに予定を追加します。" },
  { icon: "💗", title: "コミュニティ支援", body: "LOVE COINの活用法やランクアップのアドバイスもおまかせできます。" },
];

const coinColumns = [
  {
    icon: "🌱",
    title: "獲得方法",
    items: ["投稿やコミュニティへの参加", "アンケートへの回答", "ログインボーナス", "イベントへの参加（将来構想）"],
  },
  {
    icon: "💌",
    title: "活用方法",
    items: ["友達への送金", "会員ランクのアップグレード", "企業パートナーでの還元（将来構想）"],
  },
  {
    icon: "🚀",
    title: "将来構想",
    items: ["LOVE COINチャージ・出金", "LOVE投資（仮想売買シミュレーション）", "LOVE API経済圏への拡張"],
  },
];

const communityFeatures = [
  { icon: "💗", title: "応援文化", body: "いいねやコメントで、気軽に「応援」の気持ちを伝え合えます。" },
  { icon: "🤝", title: "交流", body: "カテゴリ別のコミュニティで、同じ「好き」を持つ仲間とつながれます。" },
  { icon: "🎉", title: "イベント", body: "オンライン／オフラインイベントの開催・参加情報を共有（将来構想）。" },
  { icon: "📊", title: "アンケート", body: "投票や意見交換でコミュニティの声を集め、活動に活かします。" },
];

const notLoveItems = ["SNSではない", "マッチングアプリではない", "ポイントアプリではない", "AIチャットでもない"];

const demoScenarios: { step: string; items: string[] }[] = [
  { step: "STEP1", items: ["ねね「明日の予定を作って」", "スケジュール作成"] },
  { step: "STEP2", items: ["ねね「アンケートを作って」", "アンケート公開"] },
  { step: "STEP3", items: ["コミュニティ参加"] },
  { step: "STEP4", items: ["マッチング成立"] },
];

const devStatus: { icon: string; title: string; status: "実装済み" | "開発中" | "構想中"; body: string }[] = [
  { icon: "🔐", title: "ログイン", status: "開発中", body: "ブランディングされた認証画面UIを実装済み。API連携は次フェーズで対応します。" },
  { icon: "🏠", title: "ホーム", status: "実装済み", body: "LOVE COIN残高・ランク・天気・予定・お知らせをまとめたダッシュボード。" },
  { icon: "💗", title: "LOVE COIN", status: "開発中", body: "残高・ランク・取引履歴を表示。チャージ・出金は準備中です。" },
  { icon: "💸", title: "送金", status: "実装済み", body: "友達へのLOVE COIN送金フローと送金履歴が利用できます。" },
  { icon: "👤", title: "プロフィール", status: "実装済み", body: "プロフィール情報・実績・LOVE COIN履歴への導線を実装。" },
  { icon: "🦉", title: "AI秘書ねね", status: "開発中", body: "チャット・投稿支援・アンケート・予定・COINアドバイスの5機能。AI API接続を準備中。" },
  { icon: "👥", title: "コミュニティ", status: "実装済み", body: "投稿・画像添付・いいね・コメント・カテゴリ別の交流が可能。" },
  { icon: "📋", title: "アンケート", status: "構想中", body: "会員・コミュニティ向けアンケート機能を計画中です。" },
  { icon: "🏢", title: "企業パートナー", status: "構想中", body: "加盟店によるLOVE COIN還元プログラムを計画中です。" },
];

const statusStyles: Record<string, string> = {
  実装済み: "bg-emerald-100 text-emerald-700",
  開発中: "bg-love-gold-soft text-love-navy",
  構想中: "bg-black/5 text-love-navy/50",
};

const roadmapPhases: { phase: string; title: string; status: "done" | "current" | "upcoming"; body: string }[] = [
  { phase: "Phase1", title: "企画・設計", status: "done", body: "LOVE構想書・設計ドキュメント一式とデザインシステムを整備。" },
  { phase: "Phase2", title: "コア機能（ホーム／プロフィール／LOVE COIN基本）", status: "done", body: "ログイン・ホーム・プロフィール・LOVE COIN残高表示を実装。" },
  { phase: "Phase3", title: "LOVE COIN送金機能", status: "done", body: "友達への送金フロー・送金履歴を実装。" },
  { phase: "Phase4", title: "コミュニティ機能", status: "done", body: "投稿・画像添付・いいね・コメント・カテゴリ機能を実装。" },
  { phase: "Phase5", title: "メッセージ機能", status: "done", body: "ユーザー一覧・チャット・画像送信・既読管理を実装。" },
  { phase: "Phase6", title: "AI秘書「ねね」", status: "current", body: "チャット・投稿支援・アンケート・予定・COINアドバイスをAI API接続で開発中。" },
  { phase: "Phase7", title: "アンケート機能", status: "upcoming", body: "会員・コミュニティ向けアンケートとLOVE COIN報酬を計画。" },
  { phase: "Phase8", title: "マッチング・ランク制度", status: "upcoming", body: "プロフィールマッチングと会員ランク・特典制度を計画。" },
  { phase: "Phase9", title: "企業パートナー・管理ダッシュボード", status: "upcoming", body: "加盟店還元プログラムと運営管理機能を計画。" },
  { phase: "Phase10", title: "LOVE COIN経済圏・グローバル展開", status: "upcoming", body: "チャージ／出金・LOVE API公開・LOVE投資・モバイルストア展開を構想。" },
];

const roadmapStatusLabel: Record<string, string> = {
  done: "実装済み",
  current: "開発中（現在地点）",
  upcoming: "計画中",
};

const roadmapStatusStyles: Record<string, string> = {
  done: "bg-emerald-100 text-emerald-700",
  current: "bg-love-pink-dark text-white",
  upcoming: "bg-black/5 text-love-navy/50",
};

const supportPlans: { usd: string; jpy: string; name: string; highlight?: boolean; rewards: string[] }[] = [
  {
    usd: "$20",
    jpy: "約¥3,000",
    name: "応援プラン",
    rewards: ["お礼メッセージ（メール）", "活動報告レポートの共有"],
  },
  {
    usd: "$67",
    jpy: "約¥10,000",
    name: "サポータープラン",
    rewards: ["お礼メッセージ", "活動報告レポートの共有", "LOVEオリジナルサンクスカード（データ版）"],
  },
  {
    usd: "$200",
    jpy: "約¥30,000",
    name: "ファウンダープラン",
    highlight: true,
    rewards: [
      "上記すべての特典",
      "LOVEアプリ クローズドβへの早期アクセス招待",
      "正式リリース後のLOVE COINボーナス付与",
    ],
  },
  {
    usd: "$333",
    jpy: "約¥50,000",
    name: "パートナープラン",
    rewards: ["上記すべての特典", "オンライン活動報告会への招待", "公式サイトへの支援者名・ロゴ掲載（任意）"],
  },
  {
    usd: "$667",
    jpy: "約¥100,000",
    name: "プレミアムパートナープラン",
    rewards: ["上記すべての特典", "運営者とのオンライン1on1ミーティング", "今後の機能要望ヒアリングの優先案内"],
  },
];

const stretchGoals: { amount: string; jpy: string; label: string; title: string; body: string; isBase?: boolean }[] = [
  {
    amount: "$6,700",
    jpy: "¥1,000,000",
    label: "目標額",
    title: "AI秘書ねねのAPIコスト確保",
    body: "ねねのAI APIコスト6ヶ月分と基本機能の安定稼働を実現します。",
    isBase: true,
  },
  {
    amount: "$13,400",
    jpy: "¥2,000,000",
    label: "ストレッチゴール ①",
    title: "多言語対応（英語・中国語）",
    body: "LOVEアプリのUI・ねねの会話を英語・中国語に対応し、海外ユーザーも使えるプラットフォームへ。",
  },
  {
    amount: "$20,000",
    jpy: "¥3,000,000",
    label: "ストレッチゴール ②",
    title: "iOS / Android 正式ストアリリース",
    body: "App Store・Google Playからインストールできるネイティブアプリとして正式リリースします。",
  },
];

const founder = {
  name: "鹿島公胤（KASSI）",
  role: "合同会社LOVE 代表",
  bio: [
    "「好きを発信する人を、AIと一緒にもっと応援したい」という思いから、LOVEの企画から設計・開発までを一人で手がけています。",
    "AI秘書「ねね」をはじめ、コミュニティ・LOVE COIN・メッセージ機能など、一つひとつの機能を実際に動く形にしながら、構想を着実にプロダクトへと育てています。",
  ],
};

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-love-pink-soft px-3 py-1 text-xs font-bold text-love-pink-dark">
        {index} {eyebrow}
      </span>
      <h2 className="mt-3 text-2xl font-bold text-love-navy sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-love-navy/70 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

export default function CrowdfundingLpPage() {
  return (
    <div className="bg-love-bg">
      {/* Kickstarter announcement banner */}
      <div className="bg-love-pink-dark px-4 py-2.5 text-center text-xs font-bold text-white sm:text-sm">
        🚀 Kickstarter プロジェクト 審査申請中 — 承認次第、正式ページをお知らせします
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-love-navy/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <span className="text-lg font-bold text-white">LOVE</span>
          <nav className="hidden gap-6 text-sm font-medium text-white/80 lg:flex">
            <a href="#ai-hub" className="hover:text-white">AIハブ</a>
            <a href="#demo" className="hover:text-white">デモ</a>
            <a href="#concept" className="hover:text-white">構想</a>
            <a href="#nene" className="hover:text-white">AI秘書ねね</a>
            <a href="#coin" className="hover:text-white">LOVE COIN</a>
            <a href="#roadmap" className="hover:text-white">ロードマップ</a>
            <a href="#support" className="hover:text-white">支援プラン</a>
          </nav>
          <a
            href="#support"
            className="rounded-full bg-love-pink-dark px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-love-pink"
          >
            支援する
          </a>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 text-xs font-semibold text-white/70 sm:px-6 lg:hidden">
          {[
            ["#ai-hub", "AIハブ"],
            ["#demo", "デモ"],
            ["#company", "会社"],
            ["#concept", "構想"],
            ["#nene", "ねね"],
            ["#coin", "COIN"],
            ["#community", "コミュニティ"],
            ["#status", "開発状況"],
            ["#roadmap", "ロードマップ"],
            ["#support", "支援プラン"],
            ["#founder", "運営者"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="shrink-0 rounded-full bg-white/10 px-3 py-1 hover:bg-white/20">
              {label}
            </a>
          ))}
        </div>
      </header>

      {/* 00. イントロダクション */}
      <section className="bg-love-bg px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-black leading-tight text-love-navy sm:text-4xl lg:text-5xl">
            人とAIとサービスをつなぐ
            <br />
            <span className="text-love-pink-dark">LOVEアプリ</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-love-navy/70 sm:text-base">
            AI秘書「ねね」に話しかけるだけで、
            <br className="hidden sm:block" />
            予定管理・アンケート・マッチング・コミュニティ・送金・LOVE COIN利用ができます。
          </p>
        </div>
      </section>

      {/* 01. ヒーローセクション */}
      <section id="hero" className="bg-gradient-to-br from-love-navy via-love-navy to-love-pink-dark px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-love-gold-soft">
              🌍 Kickstarter 掲載準備中
            </span>
            <p className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              つながる、創る、叶える。
              <br />
              AI秘書と一緒に育てる、応援が循環するプラットフォーム「LOVE」
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              AI秘書「ねね」が投稿・アンケート・予定づくりをサポートし、LOVE COINで「好き」を応援する気持ちが循環するコミュニティ型SNSを、合同会社LOVEが開発しています。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#support"
                className="rounded-full bg-love-pink-dark px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-love-pink"
              >
                今すぐ支援する
              </a>
              <a
                href="#status"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                開発の進捗を見る
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xs">
            <div className="overflow-hidden rounded-[2.5rem] border border-white/20 bg-love-navy-light/60 p-3 shadow-2xl backdrop-blur">
              <div className="rounded-[2rem] bg-love-bg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-love-navy">LOVE</span>
                  <span className="text-xs text-love-navy/50">9:41</span>
                </div>
                <div className="mt-4 rounded-2xl bg-gradient-to-r from-love-navy to-love-pink-dark p-4 text-white">
                  <p className="text-xs text-white/70">LOVE COIN</p>
                  <p className="mt-1 text-2xl font-bold">1,280</p>
                  <p className="mt-1 text-xs text-love-gold-soft">ランク: ゴールド</p>
                </div>
                <div className="mt-3 rounded-2xl border border-black/5 bg-white p-3">
                  <p className="text-xs font-bold text-love-pink-dark">🦉 ねねからのメッセージ</p>
                  <p className="mt-1 text-xs leading-relaxed text-love-navy/70">
                    今日も発信お疲れさまです！投稿文の提案、見てみますか？
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-love-navy/60">
                  {["🏠", "💬", "👥", "👤"].map((icon) => (
                    <div key={icon} className="rounded-xl border border-black/5 bg-white py-2">
                      <span className="text-base">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. LOVEアプリのコンセプト */}
      <section id="ai-hub" className="bg-love-navy px-4 py-16 text-center text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-love-gold-soft">
            02 LOVEアプリのコンセプト
          </span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">LOVEアプリは</h2>
          <div className="mt-6 space-y-2">
            {notLoveItems.map((item) => (
              <p key={item} className="text-base font-semibold text-white/40 line-through sm:text-lg">
                {item}
              </p>
            ))}
          </div>
          <p className="mt-8 text-xl font-bold leading-relaxed text-love-gold-soft sm:text-3xl">
            人とAIとサービスをつなぐ
            <br />
            AIハブです。
          </p>
        </div>
      </section>

      {/* 03. デモで体験する */}
      <section id="demo" className="bg-love-bg px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            index="03"
            eyebrow="使い方デモ"
            title="ねねに話しかけるだけで、LOVE COINが貯まっていく"
            description="チャットひとつで、予定づくりからアンケート公開・コミュニティ参加・マッチングまで。すべての活動がLOVE COINにつながります。"
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {demoScenarios.map((scenario) => (
              <div key={scenario.step} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <span className="inline-flex rounded-full bg-love-pink-soft px-3 py-1 text-xs font-bold text-love-pink-dark">
                  {scenario.step}
                </span>
                <div className="mt-4 space-y-2">
                  {scenario.items.map((item) => (
                    <div key={item}>
                      <p className="rounded-xl bg-love-bg px-3 py-2 text-center text-sm font-semibold text-love-navy">
                        {item}
                      </p>
                      <p className="py-1 text-center text-love-navy/30">↓</p>
                    </div>
                  ))}
                  <p className="rounded-xl bg-love-gold-soft px-3 py-2 text-center text-sm font-bold text-love-navy">
                    💗 LOVE COIN獲得
                  </p>
                </div>
              </div>
            ))}
          </div>

          <DemoExperience />
        </div>
      </section>

      {/* 04. 合同会社LOVEについて */}
      <section id="company" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            index="04"
            eyebrow="合同会社LOVEについて"
            title="「好き」を応援し合う文化をつくる"
            description="LOVEは、合同会社LOVEが企画・開発する新しいプラットフォームです。設立の背景にある目的・理念・ビジョンをご紹介します。"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {companyValues.map((value) => (
              <div key={value.title} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-base font-bold text-love-pink-dark">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-love-navy/70">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05. LOVEアプリ構想 */}
      <section id="concept" className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            index="05"
            eyebrow="LOVEアプリ構想"
            title="なぜ、いまLOVEアプリが必要なのか"
            description="SNSが当たり前になった一方で、発信を続ける人にはまだ多くの課題が残っています。"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {whyLove.map((reason) => (
              <div key={reason.title} className="rounded-2xl border border-black/5 bg-love-bg p-5 shadow-sm sm:p-6">
                <span className="text-2xl">{reason.icon}</span>
                <h3 className="mt-3 text-base font-bold text-love-navy">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-love-navy/70">{reason.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-center text-lg font-bold text-love-navy sm:text-xl">既存SNSとの違い</h3>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-love-bg/60 text-love-navy">
                    <th className="px-4 py-3 font-bold">項目</th>
                    <th className="px-4 py-3 font-bold">既存SNS</th>
                    <th className="px-4 py-3 font-bold text-love-pink-dark">LOVE</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.item} className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-3 font-semibold text-love-navy">{row.item}</td>
                      <td className="px-4 py-3 text-love-navy/50">{row.existing}</td>
                      <td className="px-4 py-3 text-love-navy">{row.love}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 06. AI秘書「ねね」 */}
      <section id="nene" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            index="06"
            eyebrow="AI秘書「ねね」"
            title="🦉 いつもそばにいる、あなた専属のAI秘書"
            description="チャットで相談するだけで、投稿・アンケート・予定づくりまでをねねがサポートします。"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {neneFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-love-navy">{feature.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-love-navy/70">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07. LOVE COIN */}
      <section id="coin" className="bg-gradient-to-br from-love-navy to-love-pink-dark px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            index="07"
            eyebrow="LOVE COIN"
            title="応援の気持ちが循環するポイント「LOVE COIN」"
            description="投稿やコミュニティ活動でLOVE COINを獲得し、送金やランクアップに活用できます。将来はチャージ・出金やLOVE経済圏への拡張も構想しています。"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {coinColumns.map((col) => (
              <div key={col.title} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur sm:p-6">
                <span className="text-2xl">{col.icon}</span>
                <h3 className="mt-3 text-base font-bold text-love-gold-soft">{col.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-white/85">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-love-gold-soft">・</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08. コミュニティ機能 */}
      <section id="community" className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            index="08"
            eyebrow="コミュニティ機能"
            title="同じ「好き」でつながる、応援のコミュニティ"
            description="カテゴリ別のコミュニティで交流しながら、応援文化を一緒に育てていきます。"
          />
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {communityFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-black/5 bg-love-bg p-5 shadow-sm text-center sm:text-left">
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-love-navy">{feature.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-love-navy/70">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09. 現在の開発状況 */}
      <section id="status" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            index="09"
            eyebrow="現在の開発状況"
            title="構想だけじゃない、実際に動くプロダクト"
            description="LOVEはすでに複数の機能が動く状態で開発が進んでいます。現在の進捗状況をありのままにご紹介します。"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {devStatus.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{feature.icon}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-xs ${statusStyles[feature.status]}`}>
                    {feature.status}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-love-navy">{feature.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-love-navy/60">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. ロードマップ */}
      <section id="roadmap" className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            index="10"
            eyebrow="ロードマップ"
            title="Phase1〜Phase10 開発ロードマップ"
            description="ご支援いただいた資金は、AI秘書ねねのAPI接続費用や、アンケート・マッチング・企業パートナーといった今後の機能開発に活用させていただきます。"
          />
          <div className="mt-10 space-y-4">
            {roadmapPhases.map((p) => (
              <div
                key={p.phase}
                className={`flex gap-4 rounded-2xl border p-4 sm:p-5 ${
                  p.status === "current" ? "border-love-pink-dark bg-love-pink-soft/40" : "border-black/5 bg-love-bg"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-love-navy text-xs font-bold text-white">
                  {p.phase.replace("Phase", "")}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-love-navy sm:text-base">
                      {p.phase}：{p.title}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-xs ${roadmapStatusStyles[p.status]}`}>
                      {roadmapStatusLabel[p.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-love-navy/70 sm:text-sm">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10.5 ストレッチゴール */}
      <section id="stretch-goals" className="bg-love-navy px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-love-gold-soft">
              🎯 ストレッチゴール
            </span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">目標額と、その先の挑戦</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Kickstarterは米ドル建てで掲載します。達成額が増えるほど、LOVEアプリの可能性が広がります。
            </p>
          </div>
          <div className="mt-10 space-y-4">
            {stretchGoals.map((goal) => (
              <div
                key={goal.amount}
                className={`flex items-start gap-5 rounded-2xl border p-5 sm:p-6 ${
                  goal.isBase
                    ? "border-love-gold-soft/40 bg-love-gold-soft/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="shrink-0 text-center">
                  <p className="text-xl font-black tabular-nums text-love-gold-soft sm:text-2xl">{goal.amount}</p>
                  <p className="text-xs text-white/50">{goal.jpy}</p>
                </div>
                <div>
                  <p className={`text-[10px] font-bold sm:text-xs ${goal.isBase ? "text-love-gold-soft" : "text-white/50"}`}>
                    {goal.label}
                  </p>
                  <h3 className="mt-0.5 text-sm font-bold text-white sm:text-base">{goal.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/70 sm:text-sm">{goal.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. 支援プラン */}
      <section id="support" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            index="11"
            eyebrow="支援プラン"
            title="ご支援プラン・リターン"
            description="Kickstarterはドル建てです。下記はおよその目安（$1 = 約¥150）です。LOVEの開発を、ぜひ一緒に支えてください。"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supportPlans.map((plan) => (
              <div
                key={plan.usd}
                className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                  plan.highlight ? "border-love-pink-dark ring-2 ring-love-pink-dark/30" : "border-black/5"
                }`}
              >
                {plan.highlight ? (
                  <span className="mb-2 inline-flex w-fit rounded-full bg-love-pink-dark px-3 py-1 text-xs font-bold text-white">
                    人気プラン
                  </span>
                ) : null}
                <p className="text-sm font-semibold text-love-navy/60">{plan.name}</p>
                <p className="mt-1 text-3xl font-black tabular-nums text-love-navy">{plan.usd}</p>
                <p className="text-sm font-medium text-love-navy/40">{plan.jpy}</p>
                <ul className="mt-4 space-y-2 text-sm text-love-navy/80">
                  {plan.rewards.map((reward) => (
                    <li key={reward} className="flex gap-2">
                      <span className="text-love-pink-dark">✓</span>
                      {reward}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. 運営者紹介 */}
      <section id="founder" className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading index="12" eyebrow="運営者紹介" title="運営者について" />
          <div className="mt-10 flex flex-col items-center gap-6 rounded-2xl border border-black/5 bg-love-bg p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-love-navy to-love-pink-dark text-2xl font-bold text-white">
              KS
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-love-navy">{founder.name}</p>
              <p className="text-sm font-semibold text-love-pink-dark">{founder.role}</p>
              {founder.bio.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-love-navy/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* フッター / クロージングCTA */}
      <section className="bg-gradient-to-r from-love-navy to-love-pink-dark px-4 py-16 text-center text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">LOVEと一緒に、応援が循環する未来をつくりませんか</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            みなさまのご支援が、AI秘書「ねね」やコミュニティ機能の開発を前に進める力になります。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#support"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-love-pink-dark shadow-lg transition hover:bg-love-pink-soft"
            >
              支援プランを見る
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-love-navy px-4 py-8 text-center text-xs text-white/60 sm:px-6">
        <p>合同会社LOVE</p>
        <p className="mt-1">© 2026 LOVE. All rights reserved.</p>
        <p className="mt-3 text-white/40">※本ページはクラウドファンディング掲載用のLPデザイン案（プロトタイプ）です。</p>
      </footer>
    </div>
  );
}
