// AIアクションルーター: ねねへのメッセージを解析し、適切な機能画面へ誘導する。
// 現在はキーワード判定のみ。将来的にClaude/OpenAI等によるインテント分類に
// 置き換える場合も、同じ NeneAction 形式を返す関数として実装すれば
// 呼び出し側（チャットUI）の変更は不要。

export type NeneAction = {
  /** アクション識別子（分析・デバッグ用） */
  id: string;
  /** 遷移先パス */
  path: string;
  /** ねねが返す案内メッセージ */
  message: string;
};

type ActionRule = {
  id: string;
  keywords: string[];
  path: string;
  message: string;
};

// 上から順に判定するため、より具体的なキーワードを先に置く。
const ACTION_RULES: ActionRule[] = [
  {
    id: "survey-create",
    keywords: ["アンケート作", "アンケートを作", "投票作", "投票を作"],
    path: "/survey",
    message: "アンケート作成を開始します📋 アンケート画面の「作成」タブから作成できますよ。",
  },
  {
    id: "send",
    keywords: ["送金", "コインを送", "コインを渡", "支払い", "振込"],
    path: "/send",
    message: "送金画面を開きます💸",
  },
  {
    id: "love-coin",
    keywords: ["LOVE COIN", "ラブコイン", "コイン残高", "コインの残高", "残高を見"],
    path: "/love-coin",
    message: "LOVE COIN画面を開きます💗 残高と獲得履歴を確認できますよ。",
  },
  {
    id: "schedule",
    keywords: ["予定", "スケジュール", "カレンダー", "予約"],
    path: "/schedule",
    message: "予定作成画面を開きます🗓️ スケジュール画面に移動しますね。",
  },
  {
    id: "survey",
    keywords: ["アンケート", "投票"],
    path: "/survey",
    message: "アンケート画面を開きます📋",
  },
  {
    id: "matching",
    keywords: ["マッチング", "友達を探", "友達探し", "出会い", "新しい友達"],
    path: "/matching",
    message: "LOVEマッチング画面を開きます💘 新しいご縁を探しましょう。",
  },
  {
    id: "community",
    keywords: ["コミュニティ", "サークル", "グループ", "コミュ"],
    path: "/community",
    message: "コミュニティ画面を開きます🏠 気になるコミュニティを探してみましょう。",
  },
  {
    id: "messages",
    keywords: ["メッセージ", "トーク", "やりとり", "ＤＭ", "DM"],
    path: "/messages",
    message: "メッセージ画面を開きます✉️",
  },
  {
    id: "partners",
    keywords: ["パートナー", "提携企業", "加盟店", "クーポン", "優待"],
    path: "/partners",
    message: "企業パートナー画面を開きます🏢 お得な提携企業を見てみましょう。",
  },
];

/**
 * 入力テキストからキーワードに合致するアクションを判定する。
 * 合致しない場合は null を返し、呼び出し側は通常のAI/フォールバック応答を行う。
 */
export function resolveNeneAction(input: string): NeneAction | null {
  const text = input.trim();
  if (!text) return null;

  for (const rule of ACTION_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return { id: rule.id, path: rule.path, message: rule.message };
    }
  }
  return null;
}
