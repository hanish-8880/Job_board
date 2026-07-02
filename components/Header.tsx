import Link from "next/link";
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
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6">
        <Link href="/" className="group">
          <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Signalboard
          </span>
        </Link>
        <HeaderNav role={profile?.role ?? null} />
      </div>
    </header>
  );
}
