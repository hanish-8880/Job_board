"use client";

import { useState, type FormEvent } from "react";
import { inputClass, labelClass, submitClass } from "./formStyles";

export default function CoverLetterForm({
  jobs,
}: {
  jobs: { id: string; title: string; company: string }[];
}) {
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const [letter, setLetter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (jobs.length === 0) {
    return <p className="text-sm text-ink-soft">No published roles to write for yet.</p>;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const response = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Request failed.");
      setLetter(data.letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[240px] flex-1">
          <label className={labelClass} htmlFor="jobId">
            Role
          </label>
          <select
            id="jobId"
            value={jobId}
            onChange={(event) => setJobId(event.target.value)}
            className={`${inputClass} mt-1`}
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.company}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading} className={submitClass}>
          {loading ? "Generating…" : "Generate draft"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-weak">{error}</p>}

      {letter && (
        <div className="mt-6">
          <textarea
            value={letter}
            onChange={(event) => setLetter(event.target.value)}
            rows={14}
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="mt-2 rounded-sm border border-rule-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-navy hover:text-navy"
          >
            {copied ? "Copied" : "Copy to clipboard"}
          </button>
        </div>
      )}
    </div>
  );
}
