import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getJobById } from "@/lib/queries/jobs";
import { getProfile } from "@/lib/queries/profiles";
import { AI_MODEL, MAX_AI_INPUT_CHARS, getGeminiClient } from "@/lib/ai";

export const maxDuration = 30;

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
      contents: `Job title: ${job.title}\nCompany: ${job.company}\nJob description:\n${job.description.slice(
        0,
        MAX_AI_INPUT_CHARS
      )}\n\nCandidate resume:\n${resumeText.slice(
        0,
        MAX_AI_INPUT_CHARS
      )}\n\nWrite the cover letter.`,
      config: {
        temperature: 0.5,
        systemInstruction:
          "You write concise, specific cover letters (under 300 words) grounded only in the resume and job description provided. No generic filler, no invented experience. Return only the letter text.",
      },
    });

    const letter = response.text;
    if (!letter) throw new Error("Empty response from model.");

    return NextResponse.json({ letter, model: AI_MODEL });
  } catch (error) {
    console.error("AI cover letter failed", error);
    return NextResponse.json(
      { error: "The AI generation call failed. Try again in a moment." },
      { status: 502 }
    );
  }
}
