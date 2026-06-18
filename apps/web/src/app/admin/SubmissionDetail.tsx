"use client";

import Image from "next/image";
import { useState } from "react";

import type { CustomRequest, Lead, Json } from "@/types/database";
import { StatusSelect } from "./StatusSelect";

type FavoriteImage = {
  image_id: string;
  image_url: string;
  alt_text: string | null;
  jewelry_type: string | null;
};

type SubmissionWithLead = CustomRequest & {
  leads: Lead;
  favorites?: FavoriteImage[];
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    contacted: "bg-blue-100 text-blue-800",
    converted: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    external_link: "External Link",
    direct_upload: "Upload",
    swipe_board: "Swipe Board",
  };
  return (
    <span className="inline-flex items-center rounded-full bg-surface-soft px-2.5 py-0.5 text-xs font-medium text-body">
      {labels[type] ?? type}
    </span>
  );
}

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

function renderFilters(filters: Json | null) {
  if (!filters || typeof filters !== "object" || Array.isArray(filters))
    return null;
  const entries = Object.entries(filters).filter(
    ([, v]) =>
      v !== null &&
      v !== undefined &&
      !(Array.isArray(v) && v.length === 0) &&
      v !== "",
  );
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(([key, val]) => (
        <span
          key={key}
          className="inline-flex items-center rounded-md bg-surface-soft px-2 py-1 text-xs text-body"
        >
          <span className="font-medium text-muted mr-1">{key}:</span>
          {Array.isArray(val) ? val.join(", ") : String(val)}
        </span>
      ))}
    </div>
  );
}

export function SubmissionCard({
  submission,
  isActive,
  onClick,
}: {
  submission: SubmissionWithLead;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-4 transition-colors ${
        isActive
          ? "border-primary bg-white shadow-sm"
          : "border-hairline bg-white hover:border-primary/40"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink truncate">
            {submission.leads.full_name}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <TypeBadge type={submission.request_type} />
            <StatusBadge status={submission.status} />
          </div>
        </div>
        {submission.uploaded_media_url && (
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-surface-soft">
            <Image
              src={submission.uploaded_media_url}
              alt="Upload thumbnail"
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted">
        {formatDate(submission.created_at)}
      </p>
    </button>
  );
}

export function SubmissionDetailPanel({
  submission,
}: {
  submission: SubmissionWithLead | null;
}) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  if (!submission) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        <p className="text-sm">Select a submission to view details</p>
      </div>
    );
  }

  const lead = submission.leads;
  const whatsappLink = lead.whatsapp_number
    ? `https://wa.me/${lead.whatsapp_number.replace(/\D/g, "")}`
    : null;

  return (
    <div className="space-y-6 p-6">
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-8"
          onClick={() => setLightboxUrl(null)}
        >
          <Image
            src={lightboxUrl}
            alt="Full preview"
            width={800}
            height={800}
            className="max-h-[80vh] w-auto rounded-lg object-contain"
          />
        </div>
      )}

      <div>
        <h2 className="display-sm text-ink">{lead.full_name}</h2>
        <div className="mt-3 space-y-1.5">
          {whatsappLink && (
            <p className="text-sm">
              <span className="text-muted">WhatsApp: </span>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {lead.whatsapp_number}
              </a>
            </p>
          )}
          {lead.email && (
            <p className="text-sm">
              <span className="text-muted">Email: </span>
              <a
                href={`mailto:${lead.email}`}
                className="font-medium text-ink hover:underline"
              >
                {lead.email}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <TypeBadge type={submission.request_type} />
        <StatusSelect
          requestId={submission.id}
          currentStatus={submission.status}
        />
      </div>

      {submission.request_type === "direct_upload" &&
        submission.uploaded_media_url && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              Uploaded Image
            </p>
            <button
              onClick={() => setLightboxUrl(submission.uploaded_media_url!)}
              className="relative block overflow-hidden rounded-lg border border-hairline"
            >
              <Image
                src={submission.uploaded_media_url}
                alt="Uploaded reference"
                width={400}
                height={400}
                className="h-auto w-full max-w-sm object-contain"
              />
            </button>
          </div>
        )}

      {submission.request_type === "external_link" &&
        submission.external_url && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              External Link
            </p>
            <a
              href={submission.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline break-all"
            >
              {submission.external_url}
            </a>
          </div>
        )}

      {submission.request_type === "swipe_board" &&
        submission.favorites &&
        submission.favorites.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              Favorited Pieces ({submission.favorites.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {submission.favorites.map((fav) => (
                <button
                  key={fav.image_id}
                  onClick={() => setLightboxUrl(fav.image_url)}
                  className="relative aspect-square overflow-hidden rounded-md border border-hairline bg-surface-soft"
                >
                  <Image
                    src={fav.image_url}
                    alt={fav.alt_text ?? "Inspiration"}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

      {submission.design_notes && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
            Design Notes
          </p>
          <p className="text-sm text-body whitespace-pre-wrap">
            {submission.design_notes}
          </p>
        </div>
      )}

      {renderFilters(submission.applied_filters) && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
            Applied Filters
          </p>
          {renderFilters(submission.applied_filters)}
        </div>
      )}

      <div className="border-t border-hairline pt-4">
        <p className="text-xs text-muted">
          Submitted {formatDate(submission.created_at)}
        </p>
      </div>
    </div>
  );
}
