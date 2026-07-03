"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { buttonVariants } from "./ui/Button";

/**
 * Just the "read a file into text" control — the caller owns where that
 * text goes (a textarea, form state, etc.), so this can sit inside both
 * the plain Resume page and the unified Matches upload flow without
 * duplicating the fetch/error-handling logic.
 */
export default function ResumeUploadButton({
  onExtracted,
}: {
  onExtracted: (text: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/resume/parse", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't read that file.");
      onExtracted(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read that file.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={buttonVariants({ variant: "secondary", size: "sm" })}
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : (
          <Upload className="h-3.5 w-3.5" aria-hidden />
        )}
        {uploading ? "Reading file…" : "Upload from computer"}
      </button>
      {error && <p className="mt-1.5 text-sm text-weak">{error}</p>}
    </div>
  );
}
