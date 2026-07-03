"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/queries/profiles";

export interface ResumeFormState {
  formError?: string;
  saved?: boolean;
}

export async function saveResume(
  _prevState: ResumeFormState,
  formData: FormData
): Promise<ResumeFormState> {
  const resumeText = String(formData.get("resumeText") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { formError: "You need to be logged in." };
  }

  await updateProfile(supabase, user.id, { resumeText: resumeText.trim() });
  revalidatePath("/dashboard/resume");
  return { saved: true };
}

/**
 * Plain callable version of the same save, for flows (like Matches) that
 * need to save resume text and immediately continue with another action
 * rather than submitting a standalone form.
 */
export async function saveResumeText(resumeText: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You need to be logged in." };
  }

  await updateProfile(supabase, user.id, { resumeText: resumeText.trim() });
  revalidatePath("/dashboard/resume");
  revalidatePath("/dashboard/matches");
  return {};
}
