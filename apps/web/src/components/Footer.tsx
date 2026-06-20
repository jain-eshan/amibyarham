import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";

const FOOTER_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "Our Legacy", href: "/story" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Begin",
    links: [
      { label: "Send Your Reference", href: "/submit" },
      // { label: "Browse Inspiration", href: "/discover" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Studio Login", href: "/admin/login" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-surface-dark text-on-dark-soft">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandMark tone="cream" size={64} />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            Custom fine jewellery from your references, backed by Arham&rsquo;s
            jewellery legacy and a trusted network of craftsmen.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <a href="https://www.instagram.com/amibyarham/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-on-dark-soft transition-colors hover:text-on-dark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/arham-diamond" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-on-dark-soft transition-colors hover:text-on-dark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61590698912033" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-on-dark-soft transition-colors hover:text-on-dark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
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
