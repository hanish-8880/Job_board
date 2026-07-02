import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import DashboardNav from "@/components/DashboardNav";

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
        <DashboardNav variant="employer" />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
