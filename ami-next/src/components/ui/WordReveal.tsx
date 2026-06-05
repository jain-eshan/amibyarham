"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";

interface WordRevealProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  startOffset?: string;
  endOffset?: string;
}

function WordUnit({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blur = useTransform(progress, range, ["blur(5px)", "blur(0px)"]);
  return (
    <motion.span
      aria-hidden="true"
      style={{
        opacity,
        filter: blur,
        marginRight: "0.28em",
        display: "inline-block",
      }}
    >
      {word}
    </motion.span>
  );
}

export default function WordReveal({
  text,
  className,
  style,
  startOffset = "start 0.88",
  endOffset = "end 0.32",
}: WordRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [startOffset, endOffset] as any,
  });

  const words = text.split(" ");

  if (prefersReducedMotion) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "block", ...style }}
      aria-label={text}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min((i + 1.8) / words.length, 1);
        return (
          <WordUnit
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </span>
  );
}
