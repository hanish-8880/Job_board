import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
}: {
  icon?: LucideIcon;
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background">
        <Icon className="h-6 w-6 text-ink-faint" aria-hidden />
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-faint">
        {title}
      </p>
      <p className="mt-2 text-sm text-ink-soft">{message}</p>
    </div>
  );
}
