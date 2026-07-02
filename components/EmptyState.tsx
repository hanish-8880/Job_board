export default function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-sm border border-dashed border-rule-strong bg-paper-raised px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
        {title}
      </p>
      <p className="mt-2 text-sm text-ink-soft">{message}</p>
    </div>
  );
}
