"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** Pixels translated up while fading in. */
  y?: number;
  /** Seconds of delay before the reveal starts. */
  delay?: number;
  className?: string;
};

/**
 * Fades + translates child content in once it enters the viewport. Used to
 * pace the editorial reveal of the landing page bands. Always renders a div
 * wrapper — pass any semantic element as a child if you need an <li>, <h2>,
 * etc.
 */
export function Reveal({ children, y = 24, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-15% 0px -10% 0px",
  });

  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: easeOut },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
