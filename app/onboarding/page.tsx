import { Briefcase, Search } from "lucide-react";
import Card from "@/components/ui/Card";
import { chooseRole } from "./actions";

export default async function OnboardingPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">One more thing</h1>
        <p className="mt-2 text-sm text-ink-soft">Are you here to hire, or to find a job?</p>
      </div>
      <form action={chooseRole} className="mt-6 flex flex-col gap-3">
        <Card>
          <button
            type="submit"
            name="role"
            value="candidate"
            className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium text-ink-soft transition-colors hover:text-primary"
          >
            <Search className="h-5 w-5" aria-hidden />
            Find a job
          </button>
        </Card>
        <Card>
          <button
            type="submit"
            name="role"
            value="employer"
            className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium text-ink-soft transition-colors hover:text-primary"
          >
            <Briefcase className="h-5 w-5" aria-hidden />
            Hire
          </button>
        </Card>
      </form>
    </div>
  );
}
