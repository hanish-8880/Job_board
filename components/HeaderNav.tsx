"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import type { UserRole } from "@/lib/types";

const linkClass =
  "whitespace-nowrap rounded-sm px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors sm:px-3 sm:text-xs sm:tracking-[0.1em]";

function linksForRole(role: UserRole | null) {
  if (role === "employer") {
    return [
      { href: "/", label: "Browse" },
      { href: "/employer", label: "Dashboard" },
      { href: "/employer/jobs", label: "My Jobs" },
      { href: "/employer/jobs/new", label: "Post a Role" },
    ];
  }
  if (role === "candidate") {
    return [
      { href: "/", label: "Browse" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/saved", label: "Saved" },
    ];
  }
  return [
    { href: "/", label: "Browse" },
    { href: "/login", label: "Log in" },
    { href: "/signup", label: "Sign up" },
  ];
}

export default function HeaderNav({ role }: { role: UserRole | null }) {
  const pathname = usePathname();
  const links = linksForRole(role);

  return (
    <nav aria-label="Primary" className="flex items-center gap-1">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`${linkClass} ${
              active ? "bg-navy text-paper" : "text-ink-soft hover:bg-rule/40 hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      {role && (
        <form action={signOut}>
          <button
            type="submit"
            className={`${linkClass} text-ink-soft hover:bg-rule/40 hover:text-ink`}
          >
            Log out
          </button>
        </form>
      )}
    </nav>
  );
}
