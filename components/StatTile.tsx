import type { LucideIcon } from "lucide-react";
import Card from "./ui/Card";

export default function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon?: LucideIcon;
}) {
  return (
    <Card className="px-5 py-4">
      {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden />}
      <p className="mt-2 text-3xl font-extrabold tabular-nums text-ink">{value}</p>
      <p className="text-sm text-ink-soft">{label}</p>
    </Card>
  );
}
