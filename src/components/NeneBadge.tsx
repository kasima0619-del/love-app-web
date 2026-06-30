const NENE_BADGE_LABELS = {
  recommend: "ねね推薦",
  match: "ねねマッチ",
  discover: "ねね発見",
  pick: "ねねおすすめ",
} as const;

export type NeneBadgeVariant = keyof typeof NENE_BADGE_LABELS;

type NeneBadgeProps = {
  variant: NeneBadgeVariant;
  className?: string;
};

// ねねが推薦・発見・マッチングしたコンテンツに付ける、ピンク統一のバッジ。
export default function NeneBadge({ variant, className = "" }: NeneBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-love-pink-soft px-2.5 py-1 text-[11px] font-bold text-love-pink-dark ${className}`}
    >
      🦉 {NENE_BADGE_LABELS[variant]}
    </span>
  );
}
