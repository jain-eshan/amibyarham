import type { Metadata } from "next";

import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Studio Access",
  description: "Admin login for the AMI by Arham studio.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-hairline bg-white p-8 shadow-sm">
          {/* Brand mark */}
          <div className="flex justify-center">
            <BrandMark size={32} />
          </div>

          {/* Headline */}
          <h1 className="display-sm mt-6 text-center text-ink">
            Studio Access
          </h1>

          {/* Form — authentication not yet implemented */}
          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="studio@amibyarham.com"
                className="h-11 w-full rounded-md border border-hairline bg-canvas px-4 text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="--------"
                className="h-11 w-full rounded-md border border-hairline bg-canvas px-4 text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button type="submit" size="lg" fullWidth>
              Sign In
            </Button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-muted">
            Studio admin — coming soon. Contact studio for access.
          </p>
        </div>
      </div>
    </div>
  );
}
