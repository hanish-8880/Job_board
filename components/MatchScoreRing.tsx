function ringColorVar(score: number): string {
  if (score >= 75) return "var(--color-strong)";
  if (score >= 45) return "var(--color-moderate)";
  return "var(--color-weak)";
}

export default function MatchScoreRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = ringColorVar(clamped);

  return (
    <div
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(${color} ${clamped * 3.6}deg, var(--color-border) 0deg)` }}
      role="img"
      aria-label={`${clamped}% match`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface">
        <span className="text-sm font-extrabold tabular-nums" style={{ color }}>
          {clamped}
        </span>
      </div>
    </div>
  );
}
