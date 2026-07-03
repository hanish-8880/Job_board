"use client";

import { useRef, useState, type ClipboardEvent } from "react";
import Link from "next/link";
import { Briefcase, Loader2, MapPin, Target } from "lucide-react";
import Card from "./ui/Card";
import Button, { buttonVariants } from "./ui/Button";
import { Textarea } from "./ui/fields";
import ResumeUploadButton from "./ResumeUploadButton";
import MatchProgress from "./MatchProgress";
import MatchScoreRing from "./MatchScoreRing";
import SaveButton from "./SaveButton";
import { saveResumeText } from "@/app/dashboard/resume/actions";
import type { ExperienceLevel, WorkMode } from "@/lib/types";

// A paste shorter than this reads as an edit to existing text, not someone
// dropping in a whole resume — so it doesn't auto-trigger scoring.
const MIN_PASTE_LENGTH_TO_AUTOSCORE = 200;

interface MatchResult {
  jobId: string;
  title: string;
  company: string;
  location: string;
  mode: WorkMode;
  level: ExperienceLevel;
  tags: string[];
  postedLabel: string;
  matchScore: number;
}

export default function MatchesView({
  initialResumeText,
  initialAtsScore,
  initialResults,
  initialComputedAt,
  initialBookmarkedIds,
  model,
}: {
  initialResumeText: string;
  initialAtsScore: number | null;
  initialResults: MatchResult[];
  initialComputedAt: string | null;
  initialBookmarkedIds: string[];
  model: string;
}) {
  const bookmarkedIds = new Set(initialBookmarkedIds);
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [editingResume, setEditingResume] = useState(!initialComputedAt);
  const [atsScore, setAtsScore] = useState(initialAtsScore);
  const [results, setResults] = useState(initialResults);
  const [computedAt, setComputedAt] = useState(initialComputedAt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleFindMatches(textOverride?: string) {
    const text = (textOverride ?? resumeText).trim();
    if (!text) {
      setError("Add your resume text or upload a file first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const saveResult = await saveResumeText(text);
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

  function handleResumeExtracted(text: string) {
    setResumeText(text);
    handleFindMatches(text);
  }

  function handleTextareaPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const pasted = event.clipboardData.getData("text");
    if (pasted.trim().length < MIN_PASTE_LENGTH_TO_AUTOSCORE) return;
    // Let the browser finish inserting the pasted text before reading the
    // textarea's real value — onChange hasn't fired yet at this point.
    requestAnimationFrame(() => {
      const fullText = textareaRef.current?.value ?? pasted;
      setResumeText(fullText);
      handleFindMatches(fullText);
    });
  }

  if (editingResume) {
    return (
      <div className="max-w-2xl">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
              Resume
            </p>
            <ResumeUploadButton onExtracted={handleResumeExtracted} disabled={loading} />
          </div>
          <p className="mt-1.5 text-xs text-ink-faint">
            Accepts .pdf, .docx, or .txt, or paste text directly — either
            one scores your matches automatically, no extra click needed.
          </p>
          <Textarea
            ref={textareaRef}
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            onPaste={handleTextareaPaste}
            rows={14}
            className="mt-3"
            placeholder="Paste your resume as plain text, or upload a file above."
            disabled={loading}
          />
          {error && <p className="mt-2 text-sm text-weak">{error}</p>}

          {loading ? (
            <div className="mt-4">
              <MatchProgress />
            </div>
          ) : (
            <div className="mt-3 flex gap-3">
              <Button onClick={() => handleFindMatches()}>
                <Target className="h-4 w-4" aria-hidden />
                Find my matches
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
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
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
            disabled={loading}
          >
            Update resume
          </Button>
          <Button onClick={() => handleFindMatches()} disabled={loading}>
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
        <div className="mt-4">
          <MatchProgress />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-weak">{error}</p>}

      {!loading && atsScore !== null && (
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

      {!loading && results.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {results.map((result) => (
            <Card key={result.jobId} className="p-5">
              <div className="flex items-start gap-4">
                <MatchScoreRing score={result.matchScore} />

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/jobs/${result.jobId}`}
                    className="font-bold text-ink hover:text-primary hover:underline"
                  >
                    {result.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {result.company} · {result.postedLabel}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-ink-faint" aria-hidden />
                      {result.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-ink-faint" aria-hidden />
                      {result.mode} · {result.level}
                    </span>
                  </div>

                  {result.tags.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {result.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-background px-2.5 py-0.5 text-xs text-ink-soft"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <SaveButton
                    jobId={result.jobId}
                    initialSaved={bookmarkedIds.has(result.jobId)}
                    isLoggedIn
                  />
                  <Link
                    href={`/jobs/${result.jobId}`}
                    className={buttonVariants({ size: "sm" })}
                  >
                    View & Apply
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
