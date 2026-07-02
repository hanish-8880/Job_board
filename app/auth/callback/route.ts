import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth code-exchange endpoint. Google sign-ins don't pass through our
 * signup form's role picker, so a first-time OAuth user (no `role` in
 * their auth metadata) is routed to /onboarding to choose one instead of
 * silently defaulting.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && !user.user_metadata?.role) {
        return NextResponse.redirect(
          `${origin}/onboarding?next=${encodeURIComponent(next)}`
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
