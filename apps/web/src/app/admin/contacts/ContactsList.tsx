"use client";

import { useState } from "react";

import type { ContactSubmission } from "@/types/database";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export function ContactsList({
  contacts,
}: {
  contacts: ContactSubmission[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (contacts.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        No contact submissions yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <button
          key={contact.id}
          onClick={() =>
            setExpandedId(expandedId === contact.id ? null : contact.id)
          }
          className="w-full text-left rounded-lg border border-hairline bg-white p-4 transition-colors hover:border-primary/40"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{contact.name}</p>
              <p className="text-sm text-muted">{contact.email}</p>
            </div>
            <p className="flex-shrink-0 text-xs text-muted">
              {formatDate(contact.created_at)}
            </p>
          </div>
          {expandedId === contact.id ? (
            <p className="mt-3 text-sm text-body whitespace-pre-wrap border-t border-hairline pt-3">
              {contact.message}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted truncate">
              {contact.message}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
