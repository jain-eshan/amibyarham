"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Submissions" },
  { href: "/admin/contacts", label: "Contacts" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1">
      {links.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-surface-soft text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
