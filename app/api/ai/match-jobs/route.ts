import { NextResponse } from "next/server";
import { Type } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { getPublishedJobs } from "@/lib/queries/jobs";
import { getProfile, saveResumeMatches } from "@/lib/queries/profiles";
import { AI_MODEL, getGeminiClient } from "@/lib/ai";
import { formatPostedLabel } from "@/lib/format";
import type { ResumeMatch } from "@/lib/types";

// Scoring 30 jobs in one prompt regularly takes ~25-30s — comfortably under
// Vercel's default Hobby-plan function timeout (10s) without this, but well
// inside it once raised explicitly.
export const maxDuration = 60;

// Capped so this stays a single request: one Gemini call scored against
// every job, not one call per job. Bounds cost, latency, and prompt size
// as the board grows past a handful of listings.
const MAX_JOBS_TO_SCORE = 30;
const DESCRIPTION_SNIPPET_CHARS = 260;
const MAX_RESUME_CHARS = 6000;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    atsScore: {
      type: Type.INTEGER,
      description:
        "Score from 0 to 100 (not 0-10) for overall resume quality, clarity, and formatting for automated screening — independent of any specific job.",
    },
    matches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          jobId: {
            type: Type.STRING,
            description: "Must exactly match one of the job IDs given in the prompt.",
          },
          matchScore: {
            type: Type.INTEGER,
            description: "Fit score from 0 to 100 (not 0-10) for this specific job.",
          },
        },
        required: ["jobId", "matchScore"],
      },
    },
  },
  required: ["atsScore", "matches"],
};

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "You need to be logged in." }, { status: 401 });
  }

  const [profile, jobs] = await Promise.all([
    getProfile(supabase, user.id),
    getPublishedJobs(supabase),
  ]);

  const resumeText = profile?.resumeText?.trim();
  if (!resumeText) {
    return NextResponse.json(
      { error: "Add your resume text on the Resume page first." },
      { status: 400 }
    );
  }

  if (jobs.length === 0) {
    return NextResponse.json(
      { error: "There are no published roles to match against yet." },
      { status: 400 }
    );
  }

  const candidates = jobs.slice(0, MAX_JOBS_TO_SCORE);
  const knownIds = new Set(candidates.map((job) => job.id));
  const jobListing = candidates
    .map(
      (job) =>
        `ID: ${job.id}\nTitle: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description.slice(
          0,
          DESCRIPTION_SNIPPET_CHARS
        )}`
    )
    .join("\n\n");

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: `Resume:\n${resumeText.slice(0, MAX_RESUME_CHARS)}\n\nJobs:\n${jobListing}`,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        systemInstruction:
          "You review a candidate's resume. atsScore is one overall score (0-100) for resume quality, " +
          "clarity, and formatting for automated screening, independent of any specific job. matches gives " +
          "one matchScore (0-100) per job listed below, for fit against that specific job. Use the full " +
          "0-100 range rather than clustering near a 0-10 scale — a genuine 45 should read as 45, not 4 or 5. " +
          "Return exactly one match entry per job id given, using the id string exactly as provided.",
      },
    });

    const raw = response.text;
    if (!raw) throw new Error("Empty response from model.");
    const parsed = JSON.parse(raw) as { atsScore?: number; matches?: ResumeMatch[] };

    const atsScore = typeof parsed.atsScore === "number" ? parsed.atsScore : 0;
    const matches = (parsed.matches ?? [])
      .filter((match) => knownIds.has(match.jobId))
      .sort((a, b) => b.matchScore - a.matchScore);

    await saveResumeMatches(supabase, user.id, { atsScore, matches });

    const jobById = new Map(candidates.map((job) => [job.id, job]));
    const results = matches.map((match) => {
      const job = jobById.get(match.jobId)!;
      return {
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        mode: job.mode,
        level: job.level,
        tags: job.tags,
        postedLabel: formatPostedLabel(job.postedAt),
        matchScore: match.matchScore,
      };
    });

    return NextResponse.json({
      atsScore,
      results,
      model: AI_MODEL,
      computedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI match-jobs failed", error);
    return NextResponse.json(
      { error: "The AI matching call failed. Try again in a moment." },
      { status: 502 }
    );
  }
}
