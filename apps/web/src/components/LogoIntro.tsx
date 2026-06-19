"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "ami-logo-intro-seen";
const easeOut = [0.16, 1, 0.3, 1] as const;
const totalDurationMs = 9800;

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

type IntroPhase = -1 | 0 | 1 | 2 | 3;

export function LogoIntro() {
  const reduceMotion = useReducedMotion();
  const previousOverflow = useRef<string | null>(null);
  const [mounted, setMounted] = useState(true);
  const [active, setActive] = useState(true);
  const [phase, setPhase] = useState<IntroPhase>(-1);

  function restoreBodyScroll() {
    if (previousOverflow.current === null) return;
    document.body.style.overflow = previousOverflow.current;
    previousOverflow.current = null;
  }

  useEffect(() => {
    if (reduceMotion) {
      setMounted(false);
      return;
    }

    const forceReplay = new URLSearchParams(window.location.search).has("intro");

    try {
      if (window.sessionStorage.getItem(SESSION_KEY) && !forceReplay) {
        setMounted(false);
        return;
      }
    } catch {
      // sessionStorage can be unavailable in private browsing; the intro can still run.
    }

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const phaseTimers = [
      window.setTimeout(() => setPhase(0), 900),
      window.setTimeout(() => setPhase(1), 3000),
      window.setTimeout(() => setPhase(2), 5100),
      window.setTimeout(() => setPhase(3), 7350),
    ];
    const exitTimer = window.setTimeout(() => setActive(false), totalDurationMs);

    return () => {
      phaseTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(exitTimer);
      restoreBodyScroll();
    };
  }, [reduceMotion]);

  if (!mounted) return null;

  const currentFrame =
    phase === 0 || phase === 1 || phase === 2 ? storyFrames[phase] : null;
  const railScale =
    phase === 0 ? 0.86 : phase === 1 ? 0.72 : phase === 2 ? 0.58 : phase === 3 ? 0.44 : 1;

  return (
    <AnimatePresence
      onExitComplete={() => {
        restoreBodyScroll();
        try {
          window.sessionStorage.setItem(SESSION_KEY, "true");
        } catch {
          // Non-essential; avoid blocking the animation when storage is restricted.
        }
        setMounted(false);
      }}
    >
      {active && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] overflow-hidden bg-[#050505] text-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, delay: 0.62, ease: easeOut }}
        >
          <motion.div
            className="absolute left-0 top-1/2 h-[min(54vh,470px)] w-full -translate-y-1/2 bg-canvas"
            initial={{ scaleY: 0.004 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 2.45 }}
            style={{ transformOrigin: "50% 50%" }}
            transition={{ duration: 1.1, delay: 0.12, ease: easeOut }}
          />

          <motion.div
            className="absolute left-0 top-1/2 flex h-[min(54vh,470px)] w-full -translate-y-1/2 items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.48, ease: easeOut }}
          >
            <motion.div
              className="absolute inset-x-0 top-0 h-px bg-ink/70"
              initial={{ opacity: 0, scaleX: 1 }}
              animate={{ opacity: phase >= 0 ? 0.65 : 0, scaleX: railScale }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.95, ease: easeOut }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 h-px bg-ink/70"
              initial={{ opacity: 0, scaleX: 1 }}
              animate={{ opacity: phase >= 0 ? 0.65 : 0, scaleX: railScale }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.95, ease: easeOut }}
            />

            <div className="relative flex h-full w-full max-w-[1200px] items-center justify-center px-7">
              <motion.div
                className="absolute left-7 top-7 font-mono text-[10px] uppercase tracking-[0.18em] text-muted md:left-10 md:top-9"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 0 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                AMI by Arham
              </motion.div>

              <motion.div
                className="absolute bottom-7 left-7 font-mono text-xs text-muted md:bottom-9 md:left-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 0 && phase < 3 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                {currentFrame?.index ?? "003"}
              </motion.div>

              <motion.div
                className="absolute bottom-7 right-7 font-mono text-xs text-muted md:bottom-9 md:right-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 0 && phase < 3 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                ©2026
              </motion.div>

              <AnimatePresence>
                {currentFrame && <StoryWord key={currentFrame.word} frame={currentFrame} />}
                {phase === 3 && <AmiLogoLockup key="ami-logo" />}
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
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
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
                duration: 0.7,
                delay: index * 0.045,
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
        transition={{ duration: 0.55, delay: 0.34, ease: easeOut }}
      >
        {frame.note}
      </motion.p>
    </motion.div>
  );
}

function AmiLogoLockup() {
  return (
    <motion.div
      className="absolute inset-0 flex w-full items-center justify-center px-7"
      initial={{ opacity: 0, scale: 0.92, y: 32 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.62, ease: easeOut }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1551 770"
        className="h-auto w-[min(76vw,420px)] md:w-[min(42vw,520px)]"
        role="img"
      >
        <title>AMI by Arham</title>
        <motion.g
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.09, delayChildren: 0.04 }}
          fill="currentColor"
        >
          <LogoPath
            d="M297.75 530.262C277.401 580.455 232.635 609.621 188.552 609.621C149.891 609.621 122.76 588.595 108.516 569.601C81.3854 532.976 80.7083 493.637 80.7083 442.773V337.642C80.7083 272.528 91.5625 239.293 112.589 215.559C132.255 193.174 157.354 180.288 189.229 180.288C223.818 180.288 252.307 195.887 269.943 220.304C290.969 248.793 297.75 279.314 297.75 343.069V530.262ZM378.458 372.231C378.458 307.121 364.219 265.069 326.911 224.371C292.323 187.069 239.422 166.043 189.229 166.043C107.161 166.043 33.2344 218.267 10.1719 294.236C2.03125 320.007 0 341.033 0 370.2V419.71C0 478.715 16.276 525.517 48.8333 562.142C81.3854 598.767 132.255 623.861 185.161 623.861C233.318 623.861 277.401 596.731 298.427 560.783V617.08H425.26V602.835H378.458V372.231Z"
          />
          <LogoPath
            d="M786.762 617.08H958.361V602.835H912.919V370.2C912.919 320.007 900.71 275.918 880.361 250.148C912.236 209.455 963.106 180.288 1016.69 180.288C1056.71 180.288 1085.87 196.564 1102.82 220.981C1122.5 248.793 1129.96 282.705 1129.96 337.642V602.835H1084.51V617.08H1257.47V602.835H1210.67V367.486C1210.67 292.2 1184.22 239.976 1131.31 201.314C1099.43 178.252 1060.1 166.043 1022.12 166.043C966.497 166.043 916.986 187.746 871.544 237.262C859.335 220.981 842.377 206.741 824.742 195.21C796.257 176.898 758.955 166.043 724.361 166.043C652.471 166.043 585.325 206.059 552.768 272.528C535.809 307.121 534.455 347.814 534.455 398.007V602.835H487.653V617.08H660.606V602.835H615.163V318.653C615.163 231.835 660.606 180.288 723.684 180.288C786.762 180.288 832.205 231.835 832.205 318.653V602.835H786.762V617.08Z"
          />
          <LogoPath
            d="M1511.8 617.08V602.835H1466.36V172.147H1338.85V186.392H1385.65V602.835H1338.85V617.08H1511.8Z"
          />
        </motion.g>

        <motion.path
          d="M1425.53 0C1433.33 65.8724 1439.64 72.2135 1505.54 80.0065L1505.14 80.0651C1439.64 87.832 1433.3 94.2513 1425.53 160.02C1417.73 94.1146 1411.43 87.806 1345.52 80.0065C1411.43 72.2135 1417.73 65.8984 1425.53 0Z"
          fill="#CC785C"
          initial={{ opacity: 0, scale: 0.2, rotate: -30 }}
          animate={{ opacity: 1, scale: [0.2, 1.18, 1], rotate: [-30, 8, 0] }}
          transition={{ duration: 0.58, delay: 0.44, ease: easeOut }}
          style={{ transformOrigin: "1425px 80px" }}
        />

        <motion.text
          x="1138"
          y="748"
          fill="currentColor"
          fontSize="145"
          letterSpacing="0"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-brand), var(--font-display)" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.44, delay: 0.42, ease: easeOut }}
        >
          by arham
        </motion.text>
      </motion.svg>
    </motion.div>
  );
}

function LogoPath({ d }: { d: string }) {
  return (
    <motion.path
      d={d}
      variants={{
        hidden: { opacity: 0, y: 38, rotateX: -16 },
        visible: { opacity: 1, y: 0, rotateX: 0 },
      }}
      transition={{ duration: 0.58, ease: easeOut }}
      style={{ transformOrigin: "50% 50%" }}
    />
  );
}
