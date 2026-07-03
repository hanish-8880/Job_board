"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Target } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge, { type BadgeVariant } from "./ui/Badge";

interface MatchResult {
  jobId: string;
  title: string;
  company: string;
  matchScore: number;
}

function scoreVariant(score: number): BadgeVariant {
  if (score >= 75) return "strong";
  if (score >= 45) return "moderate";
  return "weak";
}

export default function MatchesView({
  initialResults,
  initialComputedAt,
  model,
}: {
  initialResults: MatchResult[];
  initialComputedAt: string | null;
  model: string;
}) {
  const [results, setResults] = useState<MatchResult[]>(initialResults);
  const [computedAt, setComputedAt] = useState<string | null>(initialComputedAt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCompute() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/match-jobs", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Request failed.");
      setResults(data.results);
      setComputedAt(data.computedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {computedAt
            ? `Last computed ${new Date(computedAt).toLocaleString("en-US")}, via Google ${model}`
            : "Not computed yet — one Gemini call scores every published role against your resume at once."}
        </p>
        <Button onClick={handleCompute} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Target className="h-4 w-4" aria-hidden />
          )}
          {loading ? "Matching…" : results.length > 0 ? "Recompute matches" : "Find my matches"}
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-weak">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {results.map((result) => (
            <Card
              key={result.jobId}
              className="flex items-center justify-between gap-4 px-4 py-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/jobs/${result.jobId}`}
                  className="font-bold text-ink hover:underline"
                >
                  {result.title}
                </Link>
                <p className="text-sm text-ink-soft">{result.company}</p>
              </div>
              <Badge variant={scoreVariant(result.matchScore)}>
                {result.matchScore}% match
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
