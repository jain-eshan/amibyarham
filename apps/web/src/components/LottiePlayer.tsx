"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function LottiePlayer({ src }: { src: string }) {
  return (
    <DotLottieReact
      src={src}
      autoplay
      loop
      style={{ width: "100%", height: "100%" }}
    />
  );
}
