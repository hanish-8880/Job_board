"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Browse" },
  { href: "/saved", label: "Saved" },
  { href: "/post", label: "Post a Role" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6">
        <Link href="/" className="group">
          <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Signalboard
          </span>
          <span className="ml-2 hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint sm:inline">
            No fake AI, no backend
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-sm px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors sm:px-3 sm:text-xs sm:tracking-[0.1em] ${
                  active
                    ? "bg-navy text-paper"
                    : "text-ink-soft hover:bg-rule/40 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
