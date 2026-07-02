import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import DashboardNav from "@/components/DashboardNav";

const NAV = [
  { href: "/employer", label: "Home" },
  { href: "/employer/company", label: "Company" },
  { href: "/employer/jobs", label: "My Jobs" },
  { href: "/employer/jobs/new", label: "Post a Role" },
];

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/employer");

  const profile = await getProfile(supabase, user.id);
  if (profile?.role !== "employer") redirect("/dashboard");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:flex-row sm:px-6">
      <aside className="shrink-0 sm:w-48">
        <DashboardNav items={NAV} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
