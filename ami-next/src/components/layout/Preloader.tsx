"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("ami-visited")) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("ami-visited", "1");
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "var(--color-oxblood)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
          }}
        >
          {/* arch overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='72' height='100' viewBox='0 0 72 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 100 L12 52 Q12 42 22 38 Q30 34 36 18 Q42 34 50 38 Q60 42 60 52 L60 100' fill='none' stroke='%23B5944A' stroke-width='0.9'/%3E%3C/svg%3E")`,
              backgroundSize: "72px 100px",
              opacity: 0.06,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <Image
              src="/assets/ami-wordmark-silk.png"
              alt="ami by arham"
              width={160}
              height={52}
              priority
              style={{ height: 48, width: "auto" }}
            />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            style={{
              font: "400 10px var(--font-ui)",
              textTransform: "uppercase",
              letterSpacing: ".38em",
              color: "rgba(240,230,210,.38)",
            }}
          >
            The beloved, made by hand.
          </motion.span>

          {/* bottom line sweep */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, var(--color-gold-lit), transparent)",
              transformOrigin: "left",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
