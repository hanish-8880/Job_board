import { AlertTriangle } from "lucide-react";
import type { RedFlag } from "@/lib/redflags";

export default function RedFlagBanner({ flags }: { flags: RedFlag[] }) {
  if (flags.length === 0) return null;

  return (
    <div role="alert" className="rounded-xl border border-weak/30 bg-weak-bg px-5 py-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-weak">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        {flags.length} potential red flag{flags.length === 1 ? "" : "s"} in this
        listing
      </p>
      <ul className="mt-3 space-y-3">
        {flags.map((flag) => (
          <li key={flag.id} className="text-sm text-ink">
            <p className="font-medium">{flag.label}</p>
            <p className="mt-0.5 font-mono text-xs text-ink-soft">
              &ldquo;{flag.evidence}&rdquo;
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-weak/20 pt-3 text-xs text-ink-faint">
        Flagged by matching this listing&apos;s own wording against patterns
        common in exploitative postings — not a judgment of the employer.
        Check the quoted text yourself.
      </p>
    </div>
  );
}
