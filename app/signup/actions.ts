"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateSignup, type SignupErrors } from "@/lib/validate";

export interface SignupState {
  errors: SignupErrors;
  formError?: string;
  needsConfirmation?: boolean;
}

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const fullName = String(formData.get("fullName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as "candidate" | "employer" | "";

  const errors = validateSignup({ fullName, email, password, role });
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role } },
  });

  if (error) {
    return { errors: {}, formError: error.message };
  }

  // If the project has "Confirm email" enabled, signUp succeeds but
  // doesn't return an active session — redirecting to a protected page
  // here would just bounce the user straight to /login with no
  // explanation. Tell them the truth instead.
  if (!data.session) {
    return { errors: {}, needsConfirmation: true };
  }

  redirect(role === "employer" ? "/employer" : "/dashboard");
}
