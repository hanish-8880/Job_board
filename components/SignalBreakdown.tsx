import { Check, X } from "lucide-react";
import type { SignalResult } from "@/lib/signal";
import Card from "./ui/Card";

export default function SignalBreakdown({ result }: { result: SignalResult }) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-lg font-bold text-ink">Signal Score breakdown</h2>
        <span className="text-sm font-semibold tabular-nums text-ink-soft">
          {result.score}/100
        </span>
      </div>
      <ul className="divide-y divide-border">
        {result.checks.map((check) => (
          <li key={check.id} className="flex items-start gap-3 px-5 py-3.5">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                check.passed ? "bg-strong-bg text-strong" : "bg-weak-bg text-weak"
              }`}
            >
              {check.passed ? (
                <Check className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <X className="h-3.5 w-3.5" aria-hidden />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">
                {check.label}{" "}
                <span className="font-mono text-xs text-ink-faint">
                  ({check.weight} pts)
                </span>
              </p>
              <p className="text-sm text-ink-soft">{check.detail}</p>
            </div>
            <span className="sr-only">{check.passed ? "Passed" : "Failed"}</span>
          </li>
        ))}
      </ul>
      <p className="border-t border-border px-5 py-3 text-xs text-ink-faint">
        Computed only from this listing&apos;s own text and numbers — no
        external data, no model, no guesswork.
      </p>
    </Card>
  );
}
