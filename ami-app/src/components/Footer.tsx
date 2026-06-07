import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";

const FOOTER_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "Our Story", href: "/story" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Begin",
    links: [
      { label: "Submit Your Vision", href: "/submit" },
      { label: "Discover Inspiration", href: "/discover" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Admin Login", href: "/admin/login" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-surface-dark text-on-dark-soft">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandMark tone="cream" size={26} />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            Bespoke lab-grown diamonds set in heritage gold. Each piece is
            commissioned, never catalogued.
          </p>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="caption-uppercase text-on-dark">{group.title}</h2>
            <ul className="mt-4 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-on-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-on-dark-soft md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} AMI by Arham. All rights reserved.</span>
          <span>Crafted with intention.</span>
        </div>
      </div>
    </footer>
  );
}
