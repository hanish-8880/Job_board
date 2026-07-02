export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-border pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">{description}</p>
      )}
    </div>
  );
}
