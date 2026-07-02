import type { SignalTier } from "@/lib/signal";
import { SIGNAL_TIER_LABEL } from "@/lib/signal";

const TIER_STYLES: Record<SignalTier, string> = {
  strong: "border-strong text-strong bg-strong-bg",
  moderate: "border-moderate text-moderate bg-moderate-bg",
  weak: "border-weak text-weak bg-weak-bg",
};

export default function SignalBadge({
  score,
  tier,
}: {
  score: number;
  tier: SignalTier;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] ${TIER_STYLES[tier]}`}
    >
      {SIGNAL_TIER_LABEL[tier]}
      <span className="tabular-nums">· {score}</span>
    </span>
  );
}
