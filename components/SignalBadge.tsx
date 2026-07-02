import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import type { SignalTier } from "@/lib/signal";
import { SIGNAL_TIER_LABEL } from "@/lib/signal";
import Badge, { type BadgeVariant } from "./ui/Badge";

const TIER_VARIANT: Record<SignalTier, BadgeVariant> = {
  strong: "strong",
  moderate: "moderate",
  weak: "weak",
};

const TIER_ICON = {
  strong: CheckCircle2,
  moderate: AlertCircle,
  weak: XCircle,
} as const;

export default function SignalBadge({
  score,
  tier,
}: {
  score: number;
  tier: SignalTier;
}) {
  return (
    <Badge variant={TIER_VARIANT[tier]} icon={TIER_ICON[tier]}>
      {SIGNAL_TIER_LABEL[tier]}
      <span className="font-mono tabular-nums">· {score}</span>
    </Badge>
  );
}
