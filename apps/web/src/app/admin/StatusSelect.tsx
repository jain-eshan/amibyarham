"use client";

import { useTransition } from "react";

import type { CustomRequestStatus } from "@/types/database";
import { updateRequestStatus } from "./actions";

const STATUS_OPTIONS: { value: CustomRequestStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

export function StatusSelect({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: CustomRequestStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={currentStatus}
      disabled={isPending}
      onChange={(e) => {
        startTransition(async () => {
          await updateRequestStatus(
            requestId,
            e.target.value as CustomRequestStatus,
          );
        });
      }}
      className="h-9 rounded-md border border-hairline bg-canvas px-3 text-sm text-ink disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
