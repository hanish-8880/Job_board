"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Briefcase,
  LayoutDashboard,
  LogOut,
  LogIn,
  Plus,
  Search,
  UserPlus,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import type { UserRole } from "@/lib/types";

const linkClass =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors";

function linksForRole(role: UserRole | null) {
  if (role === "employer") {
    return [
      { href: "/", label: "Browse", icon: Search },
      { href: "/employer", label: "Dashboard", icon: LayoutDashboard },
      { href: "/employer/jobs", label: "My Jobs", icon: Briefcase },
      { href: "/employer/jobs/new", label: "Post a Role", icon: Plus },
    ];
  }
  if (role === "candidate") {
    return [
      { href: "/", label: "Browse", icon: Search },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/saved", label: "Saved", icon: Bookmark },
    ];
  }
  return [
    { href: "/", label: "Browse", icon: Search },
    { href: "/login", label: "Log in", icon: LogIn },
    { href: "/signup", label: "Sign up", icon: UserPlus },
  ];
}

export default function HeaderNav({ role }: { role: UserRole | null }) {
  const pathname = usePathname();
  const links = linksForRole(role);

  return (
    <nav aria-label="Primary" className="flex items-center gap-1">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`${linkClass} ${
              active
                ? "bg-primary text-white"
                : "text-ink-soft hover:bg-primary-soft hover:text-primary"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
      {role && (
        <form action={signOut}>
          <button
            type="submit"
            className={`${linkClass} text-ink-soft hover:bg-primary-soft hover:text-primary`}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </form>
      )}
    </nav>
  );
}
