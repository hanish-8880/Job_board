import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import DashboardNav from "@/components/DashboardNav";

const NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/applied", label: "Applied" },
  { href: "/dashboard/saved", label: "Saved" },
  { href: "/dashboard/resume", label: "Resume" },
  { href: "/dashboard/ai-review", label: "AI Review" },
  { href: "/dashboard/cover-letter", label: "Cover Letter" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const profile = await getProfile(supabase, user.id);
  if (profile?.role === "employer") redirect("/employer");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:flex-row sm:px-6">
      <aside className="shrink-0 sm:w-48">
        <DashboardNav items={NAV} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
