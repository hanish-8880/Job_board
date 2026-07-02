import type { SignalResult } from "@/lib/signal";

export default function SignalBreakdown({ result }: { result: SignalResult }) {
  return (
    <div className="rounded-sm border border-rule bg-paper-raised">
      <div className="flex items-center justify-between border-b border-rule px-4 py-3 sm:px-5">
        <h2 className="font-serif text-lg font-semibold text-ink">
          Signal Score breakdown
        </h2>
        <span className="font-mono text-sm tabular-nums text-ink-soft">
          {result.score}/100
        </span>
      </div>
      <ul className="divide-y divide-rule">
        {result.checks.map((check) => (
          <li key={check.id} className="flex items-start gap-3 px-4 py-3 sm:px-5">
            <span
              aria-hidden
              className={`mt-0.5 font-mono text-sm ${
                check.passed ? "text-strong" : "text-weak"
              }`}
            >
              {check.passed ? "✓" : "✗"}
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
      <p className="border-t border-rule px-4 py-3 font-mono text-xs text-ink-faint sm:px-5">
        Computed only from this listing&apos;s own text and numbers — no
        external data, no model, no guesswork.
      </p>
    </div>
  );
}
