"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import type { CustomRequestStatus } from "@/types/database";

export async function updateRequestStatus(
  requestId: string,
  status: CustomRequestStatus,
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("custom_requests")
    .update({ status })
    .eq("id", requestId);

  if (error) throw new Error("Failed to update status");

  revalidatePath("/admin");
}
