"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// dotlottie-web fetches its WASM runtime from a CDN at runtime. If that
// request is blocked (corporate firewall, CDN outage, ad-blocker) the canvas
// stays empty — this glyph sits behind it so the card is never a blank void.
export function LottiePlayer({ src }: { src: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <span
        aria-hidden
        className="pointer-events-none absolute text-4xl text-ink/15"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ✦
      </span>
      <DotLottieReact
        src={src}
        autoplay
        loop
        style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
      />
    </div>
  );
}
