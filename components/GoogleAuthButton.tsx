"use client";

import { createClient } from "@/lib/supabase/client";

export default function GoogleAuthButton() {
  async function handleClick() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-sm border border-rule-strong px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-navy hover:text-navy"
    >
      Continue with Google
    </button>
  );
}
