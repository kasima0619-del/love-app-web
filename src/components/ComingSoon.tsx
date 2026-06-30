type ComingSoonProps = {
  icon: string;
  title: string;
  description: string;
  phaseNote: string;
};

export default function ComingSoon({ icon, title, description, phaseNote }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-black/5 bg-white p-12 text-center shadow-sm">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-love-pink-soft text-3xl">
        {icon}
      </span>
      <h3 className="text-lg font-bold text-love-navy">{title}</h3>
      <p className="max-w-md text-sm text-love-navy/60">{description}</p>
      <span className="rounded-full bg-love-gold-soft px-4 py-1.5 text-xs font-bold text-love-navy">
        {phaseNote}
      </span>
    </div>
  );
}
