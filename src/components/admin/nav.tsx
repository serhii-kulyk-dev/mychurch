"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* Меню кабінету. На сторінці входу ховається — там нема куди йти. */

const LINKS = [
  { href: "/admin", label: "Огляд" },
  { href: "/admin/people", label: "Люди" },
  { href: "/admin/sessions", label: "Візити" },
];

export default function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <div className="flex items-center gap-1">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active ? "bg-surface-3 text-ink" : "text-ink-3 hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <form action="/api/admin/logout" method="post" className="ml-2">
        <button type="submit" className="rounded-lg px-3 py-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
          Вийти
        </button>
      </form>
    </div>
  );
}
