import type { Metadata } from "next";

import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import { ContactsList } from "./ContactsList";

export const metadata: Metadata = {
  title: "Contact Submissions",
  robots: { index: false, follow: false },
};

export default async function ContactsPage() {
  const supabase = createSupabaseServiceRoleClient();

  const { data: contacts } = await supabase
    .from("contact_submissions")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-lg font-semibold text-ink mb-6">
        Contact Submissions
      </h1>
      <ContactsList contacts={contacts ?? []} />
    </div>
  );
}
