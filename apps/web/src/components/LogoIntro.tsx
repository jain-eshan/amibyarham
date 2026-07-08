"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "ami-logo-intro-seen";
const easeOut = [0.16, 1, 0.3, 1] as const;
const totalDurationMs = 6300;
const apertureDurationSeconds = 5.4;
const apertureStartHeight = "18vh";

const storyFrames = [
  {
    index: "001",
    word: "legacy",
    note: "50 years of Arham",
  },
  {
    index: "002",
    word: "crafted",
    note: "made with trusted karigars",
  },
  {
    index: "003",
    word: "online",
    note: "your family jeweller, anywhere",
  },
] as const;

type IntroPhase = -1 | 0 | 1 | 2;

export function LogoIntro() {
  const reduceMotion = useReducedMotion();
  const previousOverflow = useRef<string | null>(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [active, setActive] = useState(true);
  const [phase, setPhase] = useState<IntroPhase>(-1);

  function restoreBodyScroll() {
    if (previousOverflow.current === null) return;
    document.body.style.overflow = previousOverflow.current;
    previousOverflow.current = null;
  }

  useEffect(() => {
    if (reduceMotion) return;

    // Ad-attributed landings skip the intro — every second before content
    // costs conversion on paid traffic.
    const params = new URLSearchParams(window.location.search);
    if (
      params.has("fbclid") ||
      params.has("gclid") ||
      params.has("utm_source")
    ) {
      return;
    }

    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      // Claim this browser session before starting, so reloads cannot restart
      // the intro while it is still playing.
      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // sessionStorage can be unavailable in private browsing; the intro can still run.
    }

    setShouldPlay(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (!shouldPlay) return;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const phaseTimers = [
      // Start with a visible opening so the first word can arrive early.
      window.setTimeout(() => setPhase(0), 1300),
      window.setTimeout(() => setPhase(1), 2850),
      window.setTimeout(() => setPhase(2), 4400),
    ];
    const exitTimer = window.setTimeout(() => setActive(false), totalDurationMs);

    return () => {
      phaseTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(exitTimer);
      restoreBodyScroll();
    };
  }, [shouldPlay]);

  // Do not render an overlay until the browser has confirmed this is the
  // session's first visit. This prevents a reload flash for returning visitors.
  if (!shouldPlay) return null;

  const currentFrame =
    phase === 0 || phase === 1 || phase === 2 ? storyFrames[phase] : null;
  const railScale =
    phase === 0 ? 0.86 : phase === 1 ? 0.68 : phase === 2 ? 0.5 : 1;

  return (
    <AnimatePresence
      onExitComplete={() => {
        restoreBodyScroll();
        setShouldPlay(false);
      }}
    >
      {active && (
        <motion.div
          aria-hidden="true"
          onClick={() => setActive(false)}
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-[#050505] text-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, delay: 0.52, ease: easeOut }}
        >
          <motion.div
            className="absolute left-0 top-1/2 w-full -translate-y-1/2 bg-canvas"
            initial={{ height: apertureStartHeight }}
            animate={{ height: "100vh" }}
            exit={{ height: "150vh" }}
            style={{ transformOrigin: "50% 50%" }}
            transition={{
              duration: apertureDurationSeconds,
              delay: 0.08,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute left-0 top-1/2 flex w-full -translate-y-1/2 items-center justify-center overflow-hidden"
            initial={{ height: apertureStartHeight, opacity: 1 }}
            animate={{ height: "100vh", opacity: 1 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{
              height: {
                duration: apertureDurationSeconds,
                delay: 0.08,
                ease: "linear",
              },
              opacity: { duration: 0.48, ease: easeOut },
              y: { duration: 0.48, ease: easeOut },
            }}
          >
            <motion.div
              className="absolute inset-x-0 top-0 h-px bg-ink/70"
              initial={{ opacity: 0, scaleX: 1 }}
              animate={{ opacity: phase >= 0 ? 0.65 : 0, scaleX: railScale }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.72, ease: easeOut }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 h-px bg-ink/70"
              initial={{ opacity: 0, scaleX: 1 }}
              animate={{ opacity: phase >= 0 ? 0.65 : 0, scaleX: railScale }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.72, ease: easeOut }}
            />

            <div className="relative flex h-full w-full max-w-[1200px] items-center justify-center px-7">
              <AnimatePresence>
                {currentFrame && <StoryWord key={currentFrame.word} frame={currentFrame} />}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StoryWord({ frame }: { frame: (typeof storyFrames)[number] }) {
  const letters = frame.word.split("");

  return (
    <motion.div
      className="absolute inset-0 flex w-full flex-col items-center justify-center px-7 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -22 }}
      transition={{ duration: 0.62, ease: easeOut }}
    >
      <p
        className="flex items-center justify-center font-brand text-[4.75rem] leading-[1.04] tracking-[0] text-ink sm:text-[6.5rem] md:text-[9rem] lg:text-[11rem]"
        aria-label={frame.word}
      >
        {letters.map((letter, index) => (
          <span
            key={`${frame.word}-${letter}-${index}`}
            className="block overflow-hidden px-[0.01em] py-[0.12em]"
          >
            <motion.span
              className="block"
              aria-hidden="true"
              initial={{ y: "112%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-112%", opacity: 0 }}
              transition={{
                duration: 0.72,
                delay: index * 0.048,
                ease: easeOut,
              }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </p>
      <motion.p
        className="mt-6 max-w-[24ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-primary md:mt-7"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.54, delay: 0.38, ease: easeOut }}
      >
        {frame.note}
      </motion.p>
    </motion.div>
  );
}
