import { NextResponse } from "next/server";
import { Type } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { getJobById } from "@/lib/queries/jobs";
import { getProfile } from "@/lib/queries/profiles";
import { AI_MODEL, MAX_AI_INPUT_CHARS, getGeminiClient } from "@/lib/ai";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    atsScore: {
      type: Type.INTEGER,
      description:
        "Score from 0 to 100 (not 0-10) for general resume quality, clarity, and formatting for automated screening.",
    },
    matchScore: {
      type: Type.INTEGER,
      description: "Score from 0 to 100 (not 0-10) for fit against this specific job.",
    },
    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["atsScore", "matchScore", "missingSkills", "strengths", "weaknesses"],
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "You need to be logged in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const jobId = body?.jobId;
  if (typeof jobId !== "string") {
    return NextResponse.json({ error: "Missing jobId." }, { status: 400 });
  }

  const [job, profile] = await Promise.all([
    getJobById(supabase, jobId),
    getProfile(supabase, user.id),
  ]);

  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  const resumeText = profile?.resumeText?.trim();
  if (!resumeText) {
    return NextResponse.json(
      { error: "Add your resume text on the Resume page first." },
      { status: 400 }
    );
  }

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: `Job title: ${job.title}\nJob description:\n${job.description.slice(
        0,
        MAX_AI_INPUT_CHARS
      )}\n\nResume:\n${resumeText.slice(0, MAX_AI_INPUT_CHARS)}`,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        systemInstruction:
          "You are an ATS resume reviewer. Given a resume and a single job description, score it honestly, " +
          "using the full 0-100 range for both scores rather than clustering near a 0-10 scale — a 0-100 " +
          "score of 45 should look like 45, not 4 or 5. atsScore reflects general resume quality, clarity, " +
          "and formatting for automated screening. matchScore reflects fit against this specific job. " +
          "Keep each array to at most 5 concise items.",
      },
    });

    const raw = response.text;
    if (!raw) throw new Error("Empty response from model.");
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      atsScore: parsed.atsScore,
      matchScore: parsed.matchScore,
      missingSkills: parsed.missingSkills ?? [],
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      model: AI_MODEL,
    });
  } catch (error) {
    console.error("AI resume review failed", error);
    return NextResponse.json(
      { error: "The AI review call failed. Try again in a moment." },
      { status: 502 }
    );
  }
}
