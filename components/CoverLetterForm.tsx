"use client";

import { useState, type FormEvent } from "react";
import { Check, Copy, Loader2, Mail } from "lucide-react";
import { Select, Textarea, labelClass } from "./ui/fields";
import Button from "./ui/Button";
import Card from "./ui/Card";

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
      <Card className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1">
            <label className={labelClass} htmlFor="jobId">
              Role
            </label>
            <Select
              id="jobId"
              value={jobId}
              onChange={(event) => setJobId(event.target.value)}
              className="mt-1.5"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.company}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Mail className="h-4 w-4" aria-hidden />
            )}
            {loading ? "Generating…" : "Generate draft"}
          </Button>
        </form>
      </Card>

      {error && <p className="mt-4 text-sm text-weak">{error}</p>}

      {letter && (
        <div className="mt-6">
          <Textarea
            value={letter}
            onChange={(event) => setLetter(event.target.value)}
            rows={14}
          />
          <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={handleCopy}>
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied ? "Copied" : "Copy to clipboard"}
          </Button>
        </div>
      )}
    </div>
  );
}
