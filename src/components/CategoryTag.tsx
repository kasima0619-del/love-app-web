// カテゴリごとのテーマカラー定義（人とAIとサービスをつなぐ、一目で区別できるように）
// AI秘書ねね→ピンク／友達・個人→ブルー／コミュニティ→パープル／企業サービス→グリーン／システム通知→グレー
export const CATEGORY_STYLES = {
  nene: {
    label: "AI秘書ねね",
    icon: "🦉",
    tag: "bg-love-pink-soft text-love-pink-dark",
    border: "border-love-pink",
  },
  friend: {
    label: "友達・個人",
    icon: "👤",
    tag: "bg-love-blue-soft text-love-blue-dark",
    border: "border-love-blue",
  },
  community: {
    label: "コミュニティ",
    icon: "🌐",
    tag: "bg-love-purple-soft text-love-purple-dark",
    border: "border-love-purple",
  },
  partner: {
    label: "企業サービス",
    icon: "🏢",
    tag: "bg-love-green-soft text-love-green-dark",
    border: "border-love-green",
  },
  coin: {
    label: "LOVE COIN",
    icon: "💗",
    tag: "bg-love-gold-soft text-love-navy",
    border: "border-love-gold",
  },
  system: {
    label: "システム通知",
    icon: "🔔",
    tag: "bg-love-gray-soft text-love-gray-dark",
    border: "border-love-gray",
  },
} as const;

export type CategoryKey = keyof typeof CATEGORY_STYLES;

type CategoryTagProps = {
  category: CategoryKey;
  className?: string;
};

export default function CategoryTag({ category, className = "" }: CategoryTagProps) {
  const style = CATEGORY_STYLES[category];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${style.tag} ${className}`}
    >
      {style.icon} {style.label}
    </span>
  );
}
