import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type BadgeVariant = "strong" | "moderate" | "weak" | "neutral" | "primary";

const variantClasses: Record<BadgeVariant, string> = {
  strong: "border-strong/25 bg-strong-bg text-strong",
  moderate: "border-moderate/25 bg-moderate-bg text-moderate",
  weak: "border-weak/25 bg-weak-bg text-weak",
  neutral: "border-border bg-background text-ink-soft",
  primary: "border-primary/20 bg-primary-soft text-primary",
};

export default function Badge({
  children,
  variant = "neutral",
  icon: Icon,
  className = "",
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </span>
  );
}
