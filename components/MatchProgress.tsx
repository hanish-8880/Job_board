"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STAGES = [
  "Reading your resume…",
  "Scoring against every published listing…",
  "Ranking your matches…",
];

/**
 * The real Gemini call this covers takes ~20-30 seconds — these stages
 * describe what's actually happening in that window, not a fake fast
 * loader. Timings are approximate, not tied to real request progress.
 */
export default function MatchProgress() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStageIndex(1), 2500),
      setTimeout(() => setStageIndex(2), 15000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-ink">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden />
        {STAGES[stageIndex]}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/3 rounded-full bg-primary [animation:progress-slide_1.8s_ease-in-out_infinite]" />
      </div>

      <p className="text-xs text-ink-faint">
        One real Gemini call, scored against every listing in one pass —
        usually takes 20-30 seconds.
      </p>

      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-background"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
