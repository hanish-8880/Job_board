"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  Mail,
  Plus,
  Search,
  Sparkles,
  Target,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const CANDIDATE_NAV: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/browse", label: "Jobs", icon: Search },
  { href: "/dashboard/matches", label: "Matches", icon: Target },
  { href: "/dashboard/applied", label: "Applied", icon: FileText },
  { href: "/dashboard/saved", label: "Saved", icon: Bookmark },
  { href: "/dashboard/resume", label: "Resume", icon: FileText },
  { href: "/dashboard/ai-review", label: "AI Review", icon: Sparkles },
  { href: "/dashboard/cover-letter", label: "Cover Letter", icon: Mail },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const EMPLOYER_NAV: NavItem[] = [
  { href: "/employer", label: "Home", icon: LayoutDashboard },
  { href: "/employer/company", label: "Company", icon: Building2 },
  { href: "/employer/jobs", label: "My Jobs", icon: Briefcase },
  { href: "/employer/jobs/new", label: "Post a Role", icon: Plus },
];

export default function DashboardNav({
  variant,
}: {
  variant: "candidate" | "employer";
}) {
  const pathname = usePathname();
  const items = variant === "employer" ? EMPLOYER_NAV : CANDIDATE_NAV;

  return (
    <nav className="flex flex-row flex-wrap gap-1 sm:flex-col">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-primary-soft text-primary" : "text-ink-soft hover:bg-background"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
