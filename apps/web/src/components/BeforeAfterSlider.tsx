"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel = "Reference",
  afterLabel = "Finished piece",
}: Props) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.buttons === 0) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setPos(Math.round(x * 100));
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPos(Number(e.target.value));
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ aspectRatio: "4/3" }}
      onPointerMove={handlePointerMove}
    >
      {/* After (bottom) */}
      <div className="absolute inset-0">
        <Image src={afterSrc} alt={afterAlt} fill className="object-cover" />
      </div>

      {/* Before (clipped on right) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image src={beforeSrc} alt={beforeAlt} fill className="object-cover" />
        {/* before label */}
        <span className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium tracking-widest text-white/90 uppercase backdrop-blur-sm">
          {beforeLabel}
        </span>
      </div>

      {/* After label */}
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium tracking-widest text-white/90 uppercase backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_6px_rgba(0,0,0,0.3)]"
        style={{ left: `${pos}%` }}
      />

      {/* Handle */}
      <div
        className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
        style={{ left: `${pos}%` }}
      >
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
          <path d="M6 1L1 7l5 6" stroke="rgba(0,0,0,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 1l5 6-5 6" stroke="rgba(0,0,0,0.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Invisible range input */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={handleInputChange}
        aria-label="Image comparison slider"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        style={{ zIndex: 4 }}
      />
    </div>
  );
}
