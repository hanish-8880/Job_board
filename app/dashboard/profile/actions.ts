"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/queries/profiles";

export interface ProfileFormState {
  formError?: string;
  saved?: boolean;
}

export async function saveProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) {
    return { formError: "Enter your name." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { formError: "You need to be logged in." };
  }

  await updateProfile(supabase, user.id, { fullName });
  revalidatePath("/dashboard/profile");
  return { saved: true };
}
