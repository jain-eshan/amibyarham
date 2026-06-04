export function showToast(
  message: string,
  type: "success" | "error" = "success"
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("ami-toast", { detail: { message, type } })
  );
}
