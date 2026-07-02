import { chooseRole } from "./actions";

export default async function OnboardingPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <div className="border-b border-rule pb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">One more thing</h1>
        <p className="mt-2 text-sm text-ink-soft">Are you here to hire, or to find a job?</p>
      </div>
      <form action={chooseRole} className="mt-6 flex flex-col gap-4">
        <button
          type="submit"
          name="role"
          value="candidate"
          className="rounded-sm border border-rule-strong px-5 py-4 text-left font-mono text-xs uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-navy hover:text-navy"
        >
          Find a job
        </button>
        <button
          type="submit"
          name="role"
          value="employer"
          className="rounded-sm border border-rule-strong px-5 py-4 text-left font-mono text-xs uppercase tracking-[0.08em] text-ink-soft transition-colors hover:border-navy hover:text-navy"
        >
          Hire
        </button>
      </form>
    </div>
  );
}
