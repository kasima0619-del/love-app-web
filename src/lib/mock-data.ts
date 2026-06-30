// Phase1 モック用のダミーデータ
// 実APIは 06_API設計.md / 12_API一覧表.md を参照し、Phase1以降で接続する

export const currentUser = {
  name: "夏目 美咲",
  handle: "@misaki_natsume",
  avatarInitial: "美",
  bio: "写真とカフェ巡りが好き。LOVEで毎日の発信を楽にしたい📷☕",
  followers: 248,
  following: 312,
  interests: ["写真", "カフェ巡り", "旅行", "イラスト", "読書"],
};

export const loveCoin = {
  balance: 12345,
  monthlyEarned: 860,
  rank: "プラチナ",
  nextRank: "ダイヤモンド",
  nextRankTarget: 15000,
};

export type CoinTransaction = {
  id: string;
  type: "earn" | "send" | "receive";
  label: string;
  amount: number;
  date: string;
};

export const coinTransactions: CoinTransaction[] = [
  {
    id: "tx-1",
    type: "earn" as const,
    label: "ワンクリック投稿ボーナス",
    amount: 50,
    date: "2026-06-14",
  },
  {
    id: "tx-2",
    type: "earn" as const,
    label: "コミュニティ参加ボーナス",
    amount: 30,
    date: "2026-06-13",
  },
  {
    id: "tx-3",
    type: "earn" as const,
    label: "AI秘書ねね 利用ボーナス",
    amount: 10,
    date: "2026-06-13",
  },
  {
    id: "tx-4",
    type: "earn" as const,
    label: "アンケート回答ボーナス",
    amount: 20,
    date: "2026-06-11",
  },
  {
    id: "tx-5",
    type: "earn" as const,
    label: "ログインボーナス",
    amount: 5,
    date: "2026-06-10",
  },
];

export const todaySchedule = [
  { id: "sc-1", time: "10:00", title: "コミュニティ定例ミーティング" },
  { id: "sc-2", time: "13:00", title: "カフェ取材（渋谷）" },
  { id: "sc-3", time: "19:00", title: "AI秘書ねねと投稿企画の相談" },
];

export const todayWeather = {
  area: "東京",
  temperature: 23,
  condition: "晴れ",
  icon: "☀️",
};

export const announcements = [
  {
    id: "an-1",
    title: "LOVE COIN ランク制度がスタートしました",
    date: "2026-06-10",
  },
  {
    id: "an-2",
    title: "コミュニティ機能に新しいタイムラインが追加されました",
    date: "2026-06-05",
  },
];

export type ChatMessage = {
  id: string;
  role: "user" | "nene";
  text: string;
  time: string;
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: "m-1",
    role: "nene",
    text: "こんにちは、美咲さん🦉 今日はどんな発信をしてみたい気分ですか？",
    time: "09:00",
  },
  {
    id: "m-2",
    role: "user",
    text: "週末に行ったカフェの写真をInstagramとXに投稿したいんだけど、文章を考えてほしいな。",
    time: "09:02",
  },
  {
    id: "m-3",
    role: "nene",
    text: "いいですね☕ 写真の雰囲気に合わせて、Instagram用は少し長めで世界観重視、X用は短くテンポよく仕上げる案を作りますね。少々お待ちください…",
    time: "09:02",
  },
  {
    id: "m-4",
    role: "nene",
    text: "できました！\n\n【Instagram】\n小さな路地に隠れた、優しい光が差し込むカフェ。\n一杯のコーヒーから始まる、丁寧な週末。☕✨\n#カフェ巡り #週末の過ごし方\n\n【X】\n隠れ家カフェで至福の一杯☕ 週末はこういう時間が一番好き。 #カフェ巡り",
    time: "09:03",
  },
];

export const quickPrompts = [
  "明日の予定作って",
  "Instagram投稿作って",
  "投稿のアイデアを出して",
  "文章をもっと整えて",
  "SNS用に最適化して",
];

export type Community = {
  id: string;
  name: string;
  category: string;
  members: number;
  joined: boolean;
  description: string;
};

export const communities: Community[] = [
  {
    id: "cm-1",
    name: "カフェ巡り部",
    category: "ライフスタイル",
    members: 1280,
    joined: true,
    description: "全国のカフェ情報や写真を共有する、カフェ好きのためのコミュニティ。",
  },
  {
    id: "cm-2",
    name: "写真投稿サークル",
    category: "クリエイティブ",
    members: 860,
    joined: true,
    description: "撮った写真にコメントをもらえる、創作活動を高め合うサークル。",
  },
  {
    id: "cm-3",
    name: "出版・ライター交流会",
    category: "出版",
    members: 430,
    joined: false,
    description: "執筆活動や出版に関する情報交換・相談ができるコミュニティ。",
  },
  {
    id: "cm-4",
    name: "LOVE COIN活用研究会",
    category: "LOVE COIN",
    members: 2100,
    joined: false,
    description: "LOVE COINの貯め方・使い方やランクアップのコツを語り合う場。",
  },
];

// メッセージ画面用
export type PlatformUser = {
  id: string;
  name: string;
  handle: string;
  avatarInitial: string;
  bio: string;
};

export const platformUsers: PlatformUser[] = [
  { id: "ct-1", name: "佐藤 蓮", handle: "@ren_sato", avatarInitial: "蓮", bio: "写真投稿サークル所属。新しいレンズで撮影中📷" },
  { id: "ct-2", name: "田中 ゆい", handle: "@yui_tanaka", avatarInitial: "ゆ", bio: "カフェ巡り部の運営メンバー☕" },
  { id: "ct-3", name: "鈴木 大輔", handle: "@daisuke_s", avatarInitial: "大", bio: "LOVE COIN活用研究会に参加中💗" },
  { id: "ct-4", name: "高橋 さくら", handle: "@sakura_t", avatarInitial: "さ", bio: "出版・ライター交流会でエッセイを執筆中📚" },
];

export type Conversation = {
  id: string;
  type: "dm" | "community";
  userId?: string;
  name: string;
  avatarInitial: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
};

export const conversations: Conversation[] = [
  {
    id: "cv-1",
    type: "dm",
    userId: "ct-1",
    name: "佐藤 蓮",
    avatarInitial: "蓮",
    lastMessage: "ありがとうございます😊 今度一緒に撮影行きませんか？",
    lastMessageAt: "2026-06-15T13:40:00+09:00",
    unread: 2,
  },
  {
    id: "cv-2",
    type: "dm",
    userId: "ct-2",
    name: "田中 ゆい",
    avatarInitial: "ゆ",
    lastMessage: "今週末の定例ミーティング、よろしくお願いします！",
    lastMessageAt: "2026-06-15T10:15:00+09:00",
    unread: 0,
  },
  {
    id: "cv-3",
    type: "community",
    name: "カフェ巡り部（コミュニティ）",
    avatarInitial: "☕",
    lastMessage: "渋谷の新店情報を共有しました",
    lastMessageAt: "2026-06-14T18:20:00+09:00",
    unread: 0,
  },
];

export type DirectMessage = {
  id: string;
  sender: "me" | "other";
  text: string;
  image?: string;
  createdAt: string;
};

export const messageThreads: Record<string, DirectMessage[]> = {
  "cv-1": [
    { id: "dm-1", sender: "other", text: "美咲さん、こんにちは！新しいレンズで撮った写真、見てくれましたか？", createdAt: "2026-06-15T13:32:00+09:00" },
    { id: "dm-2", sender: "me", text: "見ました！すごく綺麗に撮れてますね📷", createdAt: "2026-06-15T13:35:00+09:00" },
    { id: "dm-3", sender: "other", text: "ありがとうございます😊 今度一緒に撮影行きませんか？", createdAt: "2026-06-15T13:40:00+09:00" },
  ],
  "cv-2": [
    { id: "dm-4", sender: "other", text: "今週末の定例ミーティング、よろしくお願いします！", createdAt: "2026-06-15T10:15:00+09:00" },
  ],
  "cv-3": [
    { id: "dm-5", sender: "other", text: "渋谷の新店情報を共有しました。チェックしてみてください☕", createdAt: "2026-06-14T18:20:00+09:00" },
  ],
};

// 送金画面用
export const sendableContacts = [
  { id: "ct-1", name: "佐藤 蓮", avatarInitial: "蓮", handle: "@ren_sato" },
  { id: "ct-2", name: "田中 ゆい", avatarInitial: "ゆ", handle: "@yui_tanaka" },
  { id: "ct-3", name: "鈴木 大輔", avatarInitial: "大", handle: "@daisuke_s" },
];

export type SendHistoryItem = {
  id: string;
  type: "send" | "receive";
  counterpart: string;
  avatarInitial: string;
  amount: number;
  message?: string;
  date: string;
};

export const sendHistory: SendHistoryItem[] = [
  {
    id: "sh-1",
    type: "send",
    counterpart: "佐藤 蓮",
    avatarInitial: "蓮",
    amount: 200,
    message: "今度の撮影、楽しみにしてます！",
    date: "2026-06-12",
  },
  {
    id: "sh-2",
    type: "receive",
    counterpart: "田中 ゆい",
    avatarInitial: "ゆ",
    amount: 150,
    message: "ミーティングありがとうございました",
    date: "2026-06-10",
  },
  {
    id: "sh-3",
    type: "send",
    counterpart: "鈴木 大輔",
    avatarInitial: "大",
    amount: 500,
    date: "2026-06-08",
  },
];

// スケジュール画面用
export const weeklySchedule = [
  {
    date: "2026-06-15",
    label: "今日",
    items: [
      { id: "ws-1", time: "10:00", title: "コミュニティ定例ミーティング" },
      { id: "ws-2", time: "13:00", title: "カフェ取材（渋谷）" },
      { id: "ws-3", time: "19:00", title: "AI秘書ねねと投稿企画の相談" },
    ],
  },
  {
    date: "2026-06-16",
    label: "明日",
    items: [{ id: "ws-4", time: "11:00", title: "写真投稿サークル 作品レビュー" }],
  },
  {
    date: "2026-06-17",
    label: "水曜日",
    items: [
      { id: "ws-5", time: "09:30", title: "出版・ライター交流会 オンライン勉強会" },
      { id: "ws-6", time: "20:00", title: "ワンクリック投稿の振り返り" },
    ],
  },
  {
    date: "2026-06-18",
    label: "木曜日",
    items: [],
  },
];

// 管理者画面用
export const adminStats = [
  { label: "総ユーザー数", value: "12,480", unit: "人", icon: "👥" },
  { label: "LOVE COIN総流通量", value: "8,420,500", unit: "LOVE", icon: "💗" },
  { label: "本日の投稿数", value: "342", unit: "件", icon: "📝" },
  { label: "アクティブコミュニティ", value: "26", unit: "件", icon: "🏘️" },
];

export type CommunityComment = {
  id: string;
  author: string;
  avatarInitial: string;
  text: string;
};

export type CommunityPost = {
  id: string;
  community: string;
  category: string;
  author: string;
  avatarInitial: string;
  text: string;
  image?: string;
  time: string;
  likes: number;
  liked: boolean;
  comments: CommunityComment[];
};

export const postCategories = ["ライフスタイル", "クリエイティブ", "出版", "LOVE COIN"];

export const communityTimeline: CommunityPost[] = [
  {
    id: "cp-1",
    community: "カフェ巡り部",
    category: "ライフスタイル",
    author: "夏目 美咲",
    avatarInitial: "美",
    text: "渋谷の隠れ家カフェ、雰囲気が最高でした☕ 今度ねねに投稿文を作ってもらおうかな。",
    image: "☕",
    time: "2026-06-14 13:20",
    likes: 12,
    liked: false,
    comments: [
      { id: "cmt-1", author: "佐藤 蓮", avatarInitial: "蓮", text: "良いですね！どこのカフェですか？" },
    ],
  },
  {
    id: "cp-2",
    community: "写真投稿サークル",
    category: "クリエイティブ",
    author: "佐藤 蓮",
    avatarInitial: "蓮",
    text: "新しいレンズで撮った写真をアップしました。感想もらえると嬉しいです📷",
    image: "📷",
    time: "2026-06-14 10:05",
    likes: 8,
    liked: true,
    comments: [],
  },
  {
    id: "cp-3",
    community: "カフェ巡り部",
    category: "ライフスタイル",
    author: "田中 ゆい",
    avatarInitial: "ゆ",
    text: "今週末のコミュニティ定例ミーティング、楽しみにしています！",
    time: "2026-06-13 21:40",
    likes: 5,
    liked: false,
    comments: [
      { id: "cmt-2", author: "夏目 美咲", avatarInitial: "美", text: "私も楽しみです！" },
      { id: "cmt-3", author: "鈴木 大輔", avatarInitial: "大", text: "よろしくお願いします〜" },
    ],
  },
];

// メッセージ画面（通知タブ）用
export type NotificationItem = {
  id: string;
  icon: string;
  text: string;
  time: string;
  unread: boolean;
};

export const notifications: NotificationItem[] = [
  { id: "nt-1", icon: "❤️", text: "佐藤 蓮さんがあなたの投稿に「いいね」しました", time: "10分前", unread: true },
  { id: "nt-2", icon: "💬", text: "田中 ゆいさんがあなたの投稿にコメントしました", time: "1時間前", unread: true },
  { id: "nt-3", icon: "👥", text: "「写真投稿サークル」に新しいメンバーが参加しました", time: "3時間前", unread: false },
  { id: "nt-4", icon: "💗", text: "LOVE COINボーナスを受け取りました（+10 LOVE）", time: "昨日", unread: false },
  { id: "nt-5", icon: "📋", text: "新しいアンケートが届いています", time: "2日前", unread: false },
];

// スケジュール画面（週間カレンダー）用
export type CalendarEvent = {
  id: string;
  day: number; // 0=月 ... 6=日
  startHour: number;
  endHour: number;
  title: string;
  color: "pink" | "navy" | "gold";
  reminder: boolean;
};

export const scheduleWeekDays = [
  { label: "月", date: "06/15" },
  { label: "火", date: "06/16" },
  { label: "水", date: "06/17" },
  { label: "木", date: "06/18" },
  { label: "金", date: "06/19" },
  { label: "土", date: "06/20" },
  { label: "日", date: "06/21" },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "ev-1", day: 0, startHour: 10, endHour: 11, title: "コミュニティ定例ミーティング", color: "pink", reminder: true },
  { id: "ev-2", day: 0, startHour: 13, endHour: 14, title: "カフェ取材（渋谷）", color: "navy", reminder: false },
  { id: "ev-3", day: 0, startHour: 19, endHour: 20, title: "AI秘書ねねと投稿企画の相談", color: "gold", reminder: true },
  { id: "ev-4", day: 1, startHour: 11, endHour: 12, title: "写真投稿サークル 作品レビュー", color: "navy", reminder: false },
  { id: "ev-5", day: 2, startHour: 9, endHour: 10, title: "出版・ライター交流会 オンライン勉強会", color: "pink", reminder: true },
  { id: "ev-6", day: 2, startHour: 20, endHour: 21, title: "ワンクリック投稿の振り返り", color: "navy", reminder: false },
];

export const scheduleCalendarHours = Array.from({ length: 13 }, (_, i) => 9 + i); // 9:00-21:00

// 2026年6月のミニカレンダー（月曜始まり）
export const juneCalendarWeeks: (number | null)[][] = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
];
export const juneToday = 15;
export const juneEventDates = [15, 16, 17, 18];

// 管理者画面用
export type AdminMember = {
  id: string;
  name: string;
  handle: string;
  rank: string;
  status: "active" | "suspended";
  joined: string;
};

export const adminMembers: AdminMember[] = [
  { id: "mb-1", name: "夏目 美咲", handle: "@misaki_natsume", rank: "プラチナ", status: "active", joined: "2025-09-12" },
  { id: "mb-2", name: "佐藤 蓮", handle: "@ren_sato", rank: "ゴールド", status: "active", joined: "2025-10-03" },
  { id: "mb-3", name: "田中 ゆい", handle: "@yui_tanaka", rank: "シルバー", status: "active", joined: "2025-11-20" },
  { id: "mb-4", name: "鈴木 大輔", handle: "@daisuke_s", rank: "ゴールド", status: "suspended", joined: "2025-12-01" },
];

export type AdminCoinLogItem = {
  id: string;
  member: string;
  type: "付与" | "送金" | "チャージ" | "出金";
  amount: number;
  reason: string;
  date: string;
};

export const adminCoinLog: AdminCoinLogItem[] = [
  { id: "cl-1", member: "夏目 美咲", type: "付与", amount: 50, reason: "ワンクリック投稿ボーナス", date: "2026-06-14" },
  { id: "cl-2", member: "佐藤 蓮", type: "送金", amount: 200, reason: "個人間送金（鈴木 大輔さんへ）", date: "2026-06-12" },
  { id: "cl-3", member: "田中 ゆい", type: "付与", amount: 30, reason: "アンケート回答ボーナス", date: "2026-06-11" },
  { id: "cl-4", member: "鈴木 大輔", type: "付与", amount: 5, reason: "ログインボーナス", date: "2026-06-10" },
];

export type AdminPartner = {
  id: string;
  name: string;
  category: string;
  cashback: string;
  status: "提携中" | "審査中";
};

export const adminPartners: AdminPartner[] = [
  { id: "pt-1", name: "Haru Cafe", category: "グルメ", cashback: "5%", status: "提携中" },
  { id: "pt-2", name: "LOVEトラベル株式会社", category: "旅行", cashback: "10%", status: "提携中" },
  { id: "pt-3", name: "Beauty Salon M", category: "美容", cashback: "8%", status: "提携中" },
  { id: "pt-4", name: "フィットネスJOYM", category: "健康", cashback: "7%", status: "審査中" },
];

export const adminFeatureRanking = [
  { label: "AI秘書ねね", value: 35, color: "var(--color-love-pink)" },
  { label: "LOVE COIN送受金", value: 25, color: "var(--color-love-navy)" },
  { label: "マッチング機能", value: 20, color: "var(--color-love-gold)" },
  { label: "アンケート", value: 15, color: "var(--color-love-navy-light)" },
  { label: "その他", value: 5, color: "#d9d9e3" },
];

export const adminSignupTrend = [
  { date: "6/8", count: 18 },
  { date: "6/9", count: 24 },
  { date: "6/10", count: 16 },
  { date: "6/11", count: 30 },
  { date: "6/12", count: 22 },
  { date: "6/13", count: 28 },
  { date: "6/14", count: 35 },
];

// アンケート機能
export type SurveyType = "personal" | "community" | "corporate";
export type SurveyStatus = "公開中" | "終了";

export type SurveyOption = {
  id: string;
  label: string;
  votes: number;
};

export type SurveyItem = {
  id: string;
  type: SurveyType;
  title: string;
  description: string;
  category: string;
  authorName: string;
  communityName?: string;
  companyName?: string;
  status: SurveyStatus;
  reward: number;
  options: SurveyOption[];
  answeredOptionId: string | null;
  createdAt: string;
};

export const surveyTypeLabels: Record<SurveyType, string> = {
  personal: "個人",
  community: "コミュニティ",
  corporate: "企業",
};

export const surveyCategories = ["アプリ機能", "LOVE COIN", "コミュニティ", "イベント", "クリエイティブ", "その他"];

export const surveys: SurveyItem[] = [
  {
    id: "sv-1",
    type: "corporate",
    title: "LOVEアプリで一番使いたい機能は？",
    description: "今後の開発優先度を決めるための調査です。最も期待している機能を選んでください。",
    category: "アプリ機能",
    authorName: "LOVE運営事務局",
    companyName: "LOVE運営事務局",
    status: "公開中",
    reward: 30,
    answeredOptionId: null,
    createdAt: "2026-06-09",
    options: [
      { id: "sv-1-o1", label: "AI秘書ねねとのチャット", votes: 432 },
      { id: "sv-1-o2", label: "LOVE COIN送受金", votes: 310 },
      { id: "sv-1-o3", label: "コミュニティ", votes: 280 },
      { id: "sv-1-o4", label: "マッチング機能", votes: 212 },
    ],
  },
  {
    id: "sv-2",
    type: "community",
    title: "LOVE COINの使い方アンケート",
    description: "LOVE COINをどんな形で活用したいか、みんなの意見を聞かせてください。",
    category: "LOVE COIN",
    authorName: "鈴木 大輔",
    communityName: "LOVE COIN活用研究会",
    status: "公開中",
    reward: 20,
    answeredOptionId: null,
    createdAt: "2026-06-10",
    options: [
      { id: "sv-2-o1", label: "個人間送金", votes: 361 },
      { id: "sv-2-o2", label: "チャージ・出金", votes: 210 },
      { id: "sv-2-o3", label: "企業での還元", votes: 180 },
      { id: "sv-2-o4", label: "LOVE投資", votes: 109 },
    ],
  },
  {
    id: "sv-3",
    type: "corporate",
    title: "新機能に関する意見募集",
    description: "次のフェーズで強化してほしい機能を教えてください（受付終了）。",
    category: "アプリ機能",
    authorName: "LOVE運営事務局",
    companyName: "LOVE運営事務局",
    status: "終了",
    reward: 30,
    answeredOptionId: "sv-3-o1",
    createdAt: "2026-06-05",
    options: [
      { id: "sv-3-o1", label: "マッチング機能の強化", votes: 120 },
      { id: "sv-3-o2", label: "出版支援の拡充", votes: 110 },
      { id: "sv-3-o3", label: "LOVE投資機能の追加", votes: 105 },
      { id: "sv-3-o4", label: "多言語対応", votes: 95 },
    ],
  },
  {
    id: "sv-4",
    type: "community",
    title: "次のオフ会、どこに行きたい？",
    description: "カフェ巡り部の次回オフ会の行き先を決めたいと思います！",
    category: "イベント",
    authorName: "田中 ゆい",
    communityName: "カフェ巡り部",
    status: "公開中",
    reward: 20,
    answeredOptionId: null,
    createdAt: "2026-06-13",
    options: [
      { id: "sv-4-o1", label: "表参道の新店カフェ", votes: 42 },
      { id: "sv-4-o2", label: "鎌倉の古民家カフェ", votes: 35 },
      { id: "sv-4-o3", label: "自由が丘スイーツ巡り", votes: 51 },
      { id: "sv-4-o4", label: "オンライン開催", votes: 12 },
    ],
  },
  {
    id: "sv-5",
    type: "personal",
    title: "休日の過ごし方、どっち派？",
    description: "みんなはどっち派か気になったので聞いてみます！",
    category: "その他",
    authorName: "田中 ゆい",
    status: "公開中",
    reward: 10,
    answeredOptionId: null,
    createdAt: "2026-06-13",
    options: [
      { id: "sv-5-o1", label: "家でゆっくり派", votes: 58 },
      { id: "sv-5-o2", label: "外に出かける派", votes: 73 },
    ],
  },
  {
    id: "sv-6",
    type: "community",
    title: "好きな写真のジャンルは？",
    description: "サークルメンバーの好みを知って、今後のテーマ企画に活かします。",
    category: "クリエイティブ",
    authorName: "佐藤 蓮",
    communityName: "写真投稿サークル",
    status: "公開中",
    reward: 20,
    answeredOptionId: "sv-6-o1",
    createdAt: "2026-06-12",
    options: [
      { id: "sv-6-o1", label: "風景", votes: 120 },
      { id: "sv-6-o2", label: "ポートレート", votes: 95 },
      { id: "sv-6-o3", label: "動物", votes: 60 },
      { id: "sv-6-o4", label: "フード", votes: 40 },
    ],
  },
  {
    id: "sv-7",
    type: "personal",
    title: "週末はどう過ごした？",
    description: "先週末の過ごし方をシェアしませんか？（受付終了）",
    category: "その他",
    authorName: "鈴木 大輔",
    status: "終了",
    reward: 10,
    answeredOptionId: "sv-7-o2",
    createdAt: "2026-06-08",
    options: [
      { id: "sv-7-o1", label: "旅行", votes: 30 },
      { id: "sv-7-o2", label: "おうち時間", votes: 45 },
      { id: "sv-7-o3", label: "趣味の時間", votes: 38 },
      { id: "sv-7-o4", label: "友人と外出", votes: 22 },
    ],
  },
];

// マッチング機能
export type MatchProfile = {
  id: string;
  name: string;
  age: number;
  handle: string;
  avatarInitial: string;
  bio: string;
  interests: string[];
  location: string;
  compatibility: number;
  likesYou: boolean;
};

export const matchProfiles: MatchProfile[] = [
  {
    id: "mp-1",
    name: "山田 陽菜",
    age: 24,
    handle: "@hina_yamada",
    avatarInitial: "陽",
    bio: "美味しいカフェを探すのが好きです。一緒に新しいお店を巡りましょう☕",
    interests: ["カフェ巡り", "写真", "旅行"],
    location: "東京都",
    compatibility: 92,
    likesYou: true,
  },
  {
    id: "mp-2",
    name: "中村 健太",
    age: 28,
    handle: "@kenta_nakamura",
    avatarInitial: "健",
    bio: "週末はジムと映画鑑賞。趣味を語れる人と話したいです🎬",
    interests: ["フィットネス", "映画", "料理"],
    location: "神奈川県",
    compatibility: 68,
    likesYou: false,
  },
  {
    id: "mp-3",
    name: "小林 さくら",
    age: 23,
    handle: "@sakura_kobayashi",
    avatarInitial: "さ",
    bio: "イラストを描くのが趣味です。一緒にカフェでお絵描きしませんか？🎨",
    interests: ["イラスト", "カフェ巡り", "アニメ"],
    location: "東京都",
    compatibility: 85,
    likesYou: true,
  },
  {
    id: "mp-4",
    name: "渡辺 大樹",
    age: 30,
    handle: "@daiki_watanabe",
    avatarInitial: "大",
    bio: "キャンプと写真が好きです。自然の中でリフレッシュするのが最高です⛺",
    interests: ["旅行", "写真", "キャンプ"],
    location: "千葉県",
    compatibility: 73,
    likesYou: false,
  },
  {
    id: "mp-5",
    name: "加藤 美月",
    age: 26,
    handle: "@mizuki_kato",
    avatarInitial: "美",
    bio: "本屋さんとカフェを巡るのが日課。おすすめの本を教え合いたいです📚",
    interests: ["読書", "カフェ巡り", "音楽"],
    location: "東京都",
    compatibility: 88,
    likesYou: false,
  },
  {
    id: "mp-6",
    name: "伊藤 翔",
    age: 27,
    handle: "@sho_ito",
    avatarInitial: "翔",
    bio: "スポーツ観戦と旅行が好きです。アクティブに過ごしたい方歓迎！⚽",
    interests: ["スポーツ", "旅行", "料理"],
    location: "埼玉県",
    compatibility: 60,
    likesYou: false,
  },
  {
    id: "mp-7",
    name: "山本 葵",
    age: 25,
    handle: "@aoi_yamamoto",
    avatarInitial: "葵",
    bio: "読書とイラストが好きなインドア派。穏やかな時間を大切にしています📖",
    interests: ["イラスト", "読書", "カフェ巡り"],
    location: "東京都",
    compatibility: 81,
    likesYou: true,
  },
  {
    id: "mp-8",
    name: "木村 蓮",
    age: 29,
    handle: "@ren_kimura",
    avatarInitial: "蓮",
    bio: "写真と映画が趣味。カメラ片手に旅するのが好きです📷",
    interests: ["写真", "映画", "旅行"],
    location: "神奈川県",
    compatibility: 76,
    likesYou: false,
  },
  {
    id: "mp-9",
    name: "林 花音",
    age: 24,
    handle: "@kanon_hayashi",
    avatarInitial: "花",
    bio: "カフェ巡りと旅行が大好き！一緒に素敵な場所を見つけたいです✈️",
    interests: ["カフェ巡り", "旅行", "写真"],
    location: "東京都",
    compatibility: 95,
    likesYou: true,
  },
];

// 企業パートナー機能
export type Partner = {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  cashbackRate: number;
  campaign?: string;
  status: "提携中" | "審査中";
};

export const partnerCategories = ["グルメ", "旅行", "美容", "健康", "ショッピング", "エンタメ"];

export const partners: Partner[] = [
  {
    id: "pt-1",
    name: "Haru Cafe",
    category: "グルメ",
    icon: "☕",
    description: "全国の系列カフェでコーヒー・スイーツを購入するとLOVE COINが還元されます。",
    cashbackRate: 5,
    campaign: "初回利用で+50 LOVE COINボーナス",
    status: "提携中",
  },
  {
    id: "pt-2",
    name: "LOVEトラベル株式会社",
    category: "旅行",
    icon: "✈️",
    description: "国内・海外旅行のパッケージプラン予約でLOVE COINが還元されます。",
    cashbackRate: 10,
    status: "提携中",
  },
  {
    id: "pt-3",
    name: "Beauty Salon M",
    category: "美容",
    icon: "💇",
    description: "全国のサロンでカット・カラー・エステをご利用いただくとLOVE COINが還元されます。",
    cashbackRate: 8,
    campaign: "平日来店で還元率+2%",
    status: "提携中",
  },
  {
    id: "pt-4",
    name: "フィットネスJOYM",
    category: "健康",
    icon: "🏋️",
    description: "全国のジム・スタジオの月会費・体験利用でLOVE COINが還元される予定です。",
    cashbackRate: 7,
    status: "審査中",
  },
  {
    id: "pt-5",
    name: "GOURMET MARKET",
    category: "ショッピング",
    icon: "🛒",
    description: "提携スーパーでのお買い物がそのままLOVE COINに還元されます。",
    cashbackRate: 3,
    status: "提携中",
  },
  {
    id: "pt-6",
    name: "シネマパークシアターズ",
    category: "エンタメ",
    icon: "🎬",
    description: "映画チケットの購入でLOVE COINが還元されます。",
    cashbackRate: 6,
    campaign: "夫婦・カップル鑑賞で還元率+1%",
    status: "提携中",
  },
  {
    id: "pt-7",
    name: "ブックス&カフェ ことのは",
    category: "グルメ",
    icon: "📚",
    description: "書籍購入とカフェ利用がまとめてLOVE COINに還元されます。",
    cashbackRate: 4,
    status: "提携中",
  },
  {
    id: "pt-8",
    name: "リラクゼーションSPA凛",
    category: "美容",
    icon: "🧖",
    description: "全身マッサージ・エステコースの利用でLOVE COINが還元される予定です。",
    cashbackRate: 9,
    status: "審査中",
  },
];

export type PartnerUsageLog = {
  id: string;
  partnerId: string;
  partnerName: string;
  reward: number;
  date: string;
};
