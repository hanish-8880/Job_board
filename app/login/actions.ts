"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import { validateLogin, type LoginErrors } from "@/lib/validate";

export interface LoginState {
  errors: LoginErrors;
  formError?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const errors = validateLogin({ email, password });
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { errors: {}, formError: "Incorrect email or password." };
  }

  const profile = await getProfile(supabase, data.user.id);
  redirect(profile?.role === "employer" ? "/employer" : "/dashboard");
}
