"use client";

import { useState, useMemo } from "react";

import type { CustomRequest, CustomRequestStatus, Lead } from "@/types/database";
import { SubmissionCard, SubmissionDetailPanel } from "./SubmissionDetail";

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

export function Dashboard({
  submissions,
}: {
  submissions: SubmissionWithLead[];
}) {
  const [activeId, setActiveId] = useState<string | null>(
    submissions[0]?.id ?? null,
  );
  const [statusFilter, setStatusFilter] = useState<
    CustomRequestStatus | "all"
  >("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (typeFilter !== "all" && s.request_type !== typeFilter) return false;
      return true;
    });
  }, [submissions, statusFilter, typeFilter]);

  const activeSubmission = useMemo(
    () => filtered.find((s) => s.id === activeId) ?? null,
    [filtered, activeId],
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left panel — card list */}
      <div className="w-96 flex-shrink-0 border-r border-hairline bg-canvas overflow-hidden flex flex-col">
        <div className="border-b border-hairline p-4 space-y-3">
          <h1 className="text-lg font-semibold text-ink">Submissions</h1>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as CustomRequestStatus | "all")
              }
              className="h-8 rounded-md border border-hairline bg-white px-2 text-xs text-ink"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 rounded-md border border-hairline bg-white px-2 text-xs text-ink"
            >
              <option value="all">All types</option>
              <option value="external_link">External Link</option>
              <option value="direct_upload">Upload</option>
              <option value="swipe_board">Swipe Board</option>
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No submissions match filters
            </p>
          ) : (
            filtered.map((s) => (
              <SubmissionCard
                key={s.id}
                submission={s}
                isActive={s.id === activeId}
                onClick={() => setActiveId(s.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right panel — detail */}
      <div className="flex-1 overflow-y-auto bg-white">
        <SubmissionDetailPanel submission={activeSubmission} />
      </div>
    </div>
  );
}
