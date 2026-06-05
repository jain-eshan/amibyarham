"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function handler(e: Event) {
      const { message, type } = (e as CustomEvent<{ message: string; type: "success" | "error" }>).detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      const tid = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
      timeoutIds.current.push(tid);
    }
    window.addEventListener("ami-toast", handler);
    return () => {
      window.removeEventListener("ami-toast", handler);
      timeoutIds.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.75rem",
        right: "1.75rem",
        zIndex: 400,
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "var(--color-kohl)",
              color: "var(--color-silk)",
              padding: "0.875rem 1.25rem",
              borderRadius: 6,
              font: "400 13.5px var(--font-ui)",
              letterSpacing: ".02em",
              maxWidth: 340,
              border: "1px solid rgba(181,148,74,.28)",
              boxShadow: "0 8px 32px rgba(0,0,0,.4)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              pointerEvents: "auto",
            }}
          >
            {t.type === "success" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-lit)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e57373" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            )}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
