export default function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-rule bg-paper-raised px-4 py-4">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-faint">{label}</p>
      <p className="mt-1 font-serif text-3xl font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}
