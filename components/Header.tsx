import Link from "next/link";
import { Radio } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import HeaderNav from "./HeaderNav";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getProfile(supabase, user.id) : null;

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Radio className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-ink">Signalboard</span>
        </Link>
        <HeaderNav role={profile?.role ?? null} />
      </div>
    </header>
  );
}
