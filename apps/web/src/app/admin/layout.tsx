import type { ReactNode } from "react";

import { auth, signOut } from "@/lib/auth";
import { BrandMark } from "@/components/BrandMark";
import { AdminNav } from "./AdminNav";

// Auth-gated, Supabase-backed pages — never prerender. Without this, the
// root loading.tsx's Suspense boundary lets the build attempt a static shell
// for /admin/* and it crashes when Supabase env vars are absent at build time.
export const dynamic = "force-dynamic";

async function AdminTopBar() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <header className="flex h-14 items-center justify-between border-b border-hairline bg-white px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <BrandMark size={22} />
          <span className="text-xs font-medium uppercase tracking-widest text-muted">
            Studio
          </span>
        </div>
        <div className="h-5 w-px bg-hairline" />
        <AdminNav />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">{session.user.email}</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="text-sm font-medium text-muted hover:text-ink transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminTopBar />
      <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
    </>
  );
}
