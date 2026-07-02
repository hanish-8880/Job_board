"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setProfileRole } from "@/lib/queries/profiles";

export async function chooseRole(formData: FormData): Promise<void> {
  const role = String(formData.get("role") ?? "");
  if (role !== "candidate" && role !== "employer") {
    redirect("/onboarding");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await setProfileRole(supabase, user.id, role);
  // Keep auth metadata in sync so the callback route doesn't re-trigger
  // onboarding on a future OAuth sign-in.
  await supabase.auth.updateUser({ data: { role } });

  redirect(role === "employer" ? "/employer" : "/dashboard");
}
