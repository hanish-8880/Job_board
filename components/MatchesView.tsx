"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Target } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge, { type BadgeVariant } from "./ui/Badge";
import { Textarea } from "./ui/fields";
import ResumeUploadButton from "./ResumeUploadButton";
import { saveResumeText } from "@/app/dashboard/resume/actions";

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
  initialResumeText,
  initialAtsScore,
  initialResults,
  initialComputedAt,
  model,
}: {
  initialResumeText: string;
  initialAtsScore: number | null;
  initialResults: MatchResult[];
  initialComputedAt: string | null;
  model: string;
}) {
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [editingResume, setEditingResume] = useState(!initialComputedAt);
  const [atsScore, setAtsScore] = useState(initialAtsScore);
  const [results, setResults] = useState(initialResults);
  const [computedAt, setComputedAt] = useState(initialComputedAt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFindMatches() {
    if (!resumeText.trim()) {
      setError("Add your resume text or upload a file first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const saveResult = await saveResumeText(resumeText);
      if (saveResult.error) throw new Error(saveResult.error);

      const response = await fetch("/api/ai/match-jobs", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Request failed.");

      setAtsScore(data.atsScore);
      setResults(data.results);
      setComputedAt(data.computedAt);
      setEditingResume(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (editingResume) {
    return (
      <div className="max-w-2xl">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
              Resume
            </p>
            <ResumeUploadButton onExtracted={setResumeText} />
          </div>
          <p className="mt-1.5 text-xs text-ink-faint">
            Accepts .pdf, .docx, or .txt, or paste text directly.
          </p>
          <Textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            rows={14}
            className="mt-3"
            placeholder="Paste your resume as plain text, or upload a file above."
          />
          {error && <p className="mt-2 text-sm text-weak">{error}</p>}
          <div className="mt-3 flex gap-3">
            <Button onClick={handleFindMatches} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Target className="h-4 w-4" aria-hidden />
              )}
              {loading ? "Scoring…" : "Find my matches"}
            </Button>
            {computedAt && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingResume(false)}
              >
                Cancel
              </Button>
            )}
          </div>
          {loading && (
            <p className="mt-2 text-xs text-ink-faint">
              Scoring against every listing in one pass — usually takes
              20-30 seconds.
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {computedAt &&
            `Last computed ${new Date(computedAt).toLocaleString("en-US", {
              timeZone: "UTC",
              dateStyle: "medium",
              timeStyle: "short",
            })} UTC, via Google ${model}`}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setEditingResume(true)}
          >
            Update resume
          </Button>
          <Button onClick={handleFindMatches} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Target className="h-4 w-4" aria-hidden />
            )}
            {loading ? "Scoring…" : "Recompute matches"}
          </Button>
        </div>
      </div>
      {loading && (
        <p className="mt-2 text-xs text-ink-faint">
          Scoring against every listing in one pass — usually takes 20-30
          seconds.
        </p>
      )}

      {error && <p className="mt-4 text-sm text-weak">{error}</p>}

      {atsScore !== null && (
        <Card className="mt-6 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
            ATS score
          </p>
          <p className="mt-1 text-4xl font-extrabold tabular-nums text-primary">{atsScore}</p>
          <p className="mt-1 text-sm text-ink-soft">
            Overall resume quality and formatting for automated screening —
            independent of any specific job.
          </p>
        </Card>
      )}

      {results.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
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
