"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { addBookmark, isBookmarked, removeBookmark } from "@/lib/queries/bookmarks";
import { applyToJob } from "@/lib/queries/applications";

export async function toggleBookmarkAction(jobId: string): Promise<{ saved: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to log in to save a role.");

  const currentlySaved = await isBookmarked(supabase, jobId, user.id);
  if (currentlySaved) {
    await removeBookmark(supabase, jobId, user.id);
  } else {
    await addBookmark(supabase, jobId, user.id);
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard/saved");
  return { saved: !currentlySaved };
}

export async function applyToJobAction(jobId: string, coverLetter: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to log in to apply.");

  await applyToJob(supabase, jobId, user.id, coverLetter);
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard/applied");
}
