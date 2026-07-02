export default function RedFlagTag({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-weak bg-weak-bg px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-weak">
      {count} red flag{count === 1 ? "" : "s"}
    </span>
  );
}
