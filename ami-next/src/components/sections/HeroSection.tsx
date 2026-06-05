"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useModal } from "@/context/ModalContext";

const BEATS = [
  { id: "beat1", range: [0.0, 0.18] as [number, number] },
  { id: "beat2", range: [0.22, 0.46] as [number, number] },
  { id: "beat3", range: [0.5, 0.72] as [number, number] },
  { id: "beat4", range: [0.76, 1.01] as [number, number] },
];

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Time constant for the scrub easing (seconds). Smaller = tighter scroll tracking.
const SMOOTH_TAU = 0.08;


export default function HeroSection() {
  const { openModal } = useModal();
  const prefersReducedMotion = useReducedMotion();
  const runwayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scrubFillRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const canScrub = !prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  // Video scale: 1.02 → 1.08
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.08]);

  // Imperatively drive video currentTime and other DOM refs for performance
  const progressRef = useRef(0); // latest scroll progress 0→1
  const seekCurrentRef = useRef(0); // smoothed video time we're easing toward target
  const lastFrameRef = useRef(0); // timestamp of previous RAF, for time-based smoothing
  const rafRef = useRef<number>(0);
  const durationRef = useRef<number>(0); // populated once metadata loads

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!canScrub) {
      video.loop = true;
      video.muted = true;
      video.play().catch(() => {});
      return;
    }

    // Keep video paused — we scrub manually
    const pause = () => video.pause();
    video.addEventListener("play", pause);
    video.load();

    // Hoisted declaration so the loop can re-request itself without tripping
    // the "used before declared" hooks rule a useCallback self-reference hits.
    function seekLoop(now: number) {
      const duration = durationRef.current;

      // Frame-rate-independent delta. Clamp so a backgrounded tab doesn't jump.
      const last = lastFrameRef.current || now;
      const dt = Math.min((now - last) / 1000, 0.05);
      lastFrameRef.current = now;

      if (video && duration > 0) {
        // Recompute target from the current duration every frame, so a late
        // loadedmetadata never leaves us mapping scroll → 0.
        const target = progressRef.current * (duration - 0.05);
        // Exponential smoothing, driven by elapsed time rather than frame count.
        const k = 1 - Math.exp(-dt / SMOOTH_TAU);
        seekCurrentRef.current += (target - seekCurrentRef.current) * k;

        // Only issue a seek when the previous one has finished — avoids queueing
        // seeks the decoder will drop, which is what makes the video trail scroll.
        if (!video.seeking) {
          const settled = Math.abs(target - seekCurrentRef.current) <= 0.01;
          const next = settled ? target : seekCurrentRef.current;
          if (Math.abs(video.currentTime - next) > 0.01) {
            try {
              video.currentTime = next;
            } catch {}
          }
        }
      }
      rafRef.current = requestAnimationFrame(seekLoop);
    }

    lastFrameRef.current = 0;
    rafRef.current = requestAnimationFrame(seekLoop);
    return () => {
      video.removeEventListener("play", pause);
      cancelAnimationFrame(rafRef.current);
    };
  }, [canScrub]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!canScrub) return;

    // The RAF loop reads this every frame and maps it through the current
    // video duration — no need to know the duration here.
    progressRef.current = p;

    if (glowRef.current)
      glowRef.current.style.opacity = (p * 0.55).toFixed(3);
    if (scrubFillRef.current)
      scrubFillRef.current.style.width = `${p * 100}%`;
    if (hintRef.current)
      hintRef.current.classList.toggle("opacity-0", p > 0.04);

    beatRefs.current.forEach((el, i) => {
      if (!el) return;
      const [from, to] = BEATS[i].range;
      const active = p >= from && p < to;
      el.style.opacity = active ? "1" : "0";
      el.style.transform = active ? "translateY(0)" : "translateY(28px)";
      el.style.pointerEvents = active ? "auto" : "none";
    });
  });

  return (
    <>
      {/* ── RUNWAY (340vh desktop / 100dvh mobile) ── */}
      <div
        ref={runwayRef}
        className="relative"
        style={{
          height: canScrub ? "340vh" : "100dvh",
        }}
      >
        {/* ── STICKY VIEWPORT ── */}
        <div
          className="sticky top-0 h-dvh overflow-hidden"
          style={{ background: "#4A0F1E" }}
        >
          {/* Video */}
          <motion.video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ scale: canScrub ? videoScale : 1 }}
            muted
            playsInline
            preload="auto"
            poster="/assets/hero-karigar.jpg"
            aria-label="A master karigar hammers gold at his workbench as light streams through an ornate jaali window."
            onLoadedMetadata={() => {
              const video = videoRef.current;
              if (video) durationRef.current = video.duration;
            }}
          >
            <source src="/assets/hero-karigar.mp4" type="video/mp4" />
          </motion.video>

          {/* Atmospheric overlays */}
          <div
            aria-hidden
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 40%, transparent 60%, rgba(74,15,30,.34) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute left-0 right-0 top-0 h-[24%] z-[3] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(26,20,17,.6) 0%, transparent 100%)",
            }}
          />
          <div
            ref={glowRef}
            aria-hidden
            className="absolute inset-0 z-[3] pointer-events-none"
            style={{
              opacity: 0,
              background:
                "radial-gradient(ellipse 55% 60% at 58% 38%, rgba(203,168,92,.20) 0%, transparent 70%)",
              willChange: "opacity",
            }}
          />
          <div
            aria-hidden
            className="absolute left-0 right-0 bottom-0 h-[64%] z-[3] pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(40,9,18,.95) 0%, rgba(74,15,30,.78) 26%, rgba(74,15,30,.34) 52%, transparent 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 z-[4] pointer-events-none"
            style={{
              opacity: 0.13,
              mixBlendMode: "overlay",
              backgroundImage: GRAIN_SVG,
              backgroundSize: "200px 200px",
            }}
          />

          {/* Gold dust particles */}
          {!prefersReducedMotion && (
            <div aria-hidden className="absolute inset-0 z-[5] pointer-events-none">
              {[
                { left: "16%", dur: "15s", delay: "0s", size: 3 },
                { left: "31%", dur: "19s", delay: "3s", size: 2 },
                { left: "49%", dur: "16s", delay: "7s", size: 3 },
                { left: "64%", dur: "21s", delay: "2s", size: 2 },
                { left: "80%", dur: "15s", delay: "5s", size: 3 },
                { left: "39%", dur: "23s", delay: "9s", size: 1.5 },
              ].map((p, i) => (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    background: "#CBA85C",
                    boxShadow: "0 0 6px 1px rgba(203,168,92,.4)",
                    animation: `float-up ${p.dur} linear ${p.delay} infinite`,
                  }}
                />
              ))}
            </div>
          )}

          {/* ── DESKTOP SCROLL BEATS ── */}
          {canScrub && (
            <div
              className="absolute z-[10] hidden md:block"
              style={{
                left: "clamp(1.5rem, 6vw, 5.5rem)",
                right: "clamp(1.5rem, 6vw, 5.5rem)",
                bottom: "clamp(4rem, 12vh, 7.5rem)",
              }}
            >
              {/* Beat 1 — Hindi + logo + tagline */}
              <div
                ref={(el) => { beatRefs.current[0] = el; }}
                className="absolute left-0 bottom-0 max-w-[680px] pointer-events-none"
                style={{
                  opacity: 0,
                  transform: "translateY(28px)",
                  transition: "opacity .8s cubic-bezier(0.16,1,0.3,1), transform .8s cubic-bezier(0.16,1,0.3,1)",
                  willChange: "opacity, transform",
                }}
              >
                <p
                  className="mb-[1.1rem]"
                  style={{
                    fontFamily: "var(--font-hindi)",
                    fontSize: "clamp(.85rem,1.5vw,1rem)",
                    color: "#CBA85C",
                    letterSpacing: ".03em",
                    textShadow: "0 1px 14px rgba(26,20,17,.7)",
                  }}
                >
                  हस्तनिर्मित, दिल से
                </p>
                <Image
                  src="/assets/ami-wordmark-silk.png"
                  alt="ami by arham"
                  width={300}
                  height={60}
                  priority
                  style={{ width: "clamp(190px,26vw,300px)", height: "auto" }}
                />
                <p
                  className="mt-[1.1rem]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "clamp(1.15rem,2.2vw,1.6rem)",
                    color: "#F0E6D2",
                    letterSpacing: ".02em",
                    textShadow: "0 1px 14px rgba(26,20,17,.55)",
                  }}
                >
                  The beloved, made by hand.
                </p>
              </div>

              {/* Beat 2 — H1 title */}
              <div
                ref={(el) => { beatRefs.current[1] = el; }}
                className="absolute left-0 bottom-0 max-w-[680px] pointer-events-none"
                style={{
                  opacity: 0,
                  transform: "translateY(28px)",
                  transition: "opacity .8s cubic-bezier(0.16,1,0.3,1), transform .8s cubic-bezier(0.16,1,0.3,1)",
                  willChange: "opacity, transform",
                }}
              >
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(2.6rem,6.5vw,5rem)",
                    lineHeight: 1,
                    color: "#F0E6D2",
                    textShadow: "0 2px 26px rgba(26,20,17,.55)",
                    textWrap: "balance" as never,
                  }}
                >
                  Your design,
                  <br />
                  <em style={{ fontStyle: "normal", fontWeight: 600, color: "#CBA85C" }}>
                    made by hand.
                  </em>
                </h1>
              </div>

              {/* Beat 3 — Story pullquote */}
              <div
                ref={(el) => { beatRefs.current[2] = el; }}
                className="absolute left-0 bottom-0 max-w-[680px] pointer-events-none"
                style={{
                  opacity: 0,
                  transform: "translateY(28px)",
                  transition: "opacity .8s cubic-bezier(0.16,1,0.3,1), transform .8s cubic-bezier(0.16,1,0.3,1)",
                  willChange: "opacity, transform",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "clamp(1.6rem,3.6vw,2.6rem)",
                    lineHeight: 1.28,
                    color: "#F0E6D2",
                    maxWidth: "20ch",
                    textWrap: "balance" as never,
                    textShadow: "0 2px 20px rgba(26,20,17,.55)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color: "#CBA85C",
                      fontSize: "1.6em",
                      lineHeight: 0,
                      marginBottom: ".2em",
                    }}
                  >
                    ·
                  </span>
                  We do not sell what we have made.
                  <br />
                  We make what you love.
                </p>
              </div>

              {/* Beat 4 — CTA */}
              <div
                ref={(el) => { beatRefs.current[3] = el; }}
                className="absolute left-0 bottom-0 max-w-[680px]"
                style={{
                  opacity: 0,
                  transform: "translateY(28px)",
                  transition: "opacity .8s cubic-bezier(0.16,1,0.3,1), transform .8s cubic-bezier(0.16,1,0.3,1)",
                  willChange: "opacity, transform",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "clamp(2rem,4.6vw,3.4rem)",
                    lineHeight: 1.1,
                    color: "#F0E6D2",
                    marginBottom: "1.6rem",
                    maxWidth: "16ch",
                    textWrap: "balance" as never,
                    textShadow: "0 2px 20px rgba(26,20,17,.55)",
                  }}
                >
                  Show us what you love.{" "}
                  <em style={{ fontStyle: "normal", fontWeight: 600, color: "#CBA85C" }}>
                    We&apos;ll make it real.
                  </em>
                </p>
                <div className="flex gap-4 flex-wrap">
                  <button
  onClick={openModal}
  className="btn btn-gold"
>
                    Start your piece
                  </button>
                  <a href="#process" className="btn btn-ghost">
                    How it works
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── STATIC HERO (mobile / reduced-motion) ── */}
          <div
            className={`absolute z-[10] ${canScrub ? "md:hidden" : ""}`}
            style={{
              left: "clamp(1.5rem,6vw,5rem)",
              right: "clamp(1.5rem,6vw,5rem)",
              bottom: "clamp(3rem,12vh,6rem)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-hindi)",
                fontSize: "clamp(.85rem,1.5vw,1rem)",
                color: "#CBA85C",
                letterSpacing: ".03em",
                marginBottom: "1.1rem",
                textShadow: "0 1px 14px rgba(26,20,17,.7)",
              }}
            >
              हस्तनिर्मित, दिल से
            </p>
            <Image
              src="/assets/ami-wordmark-silk.png"
              alt="ami by arham"
              width={260}
              height={52}
              priority
              style={{ width: "min(260px,64vw)", height: "auto" }}
            />
            <p
              className="mt-[1.1rem]"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(1.15rem,2.2vw,1.6rem)",
                color: "#F0E6D2",
                letterSpacing: ".02em",
                textShadow: "0 1px 14px rgba(26,20,17,.55)",
              }}
            >
              The beloved, made by hand.
            </p>
            <div className="flex gap-4 flex-wrap mt-[1.6rem]">
              <button
  onClick={openModal}
  className="btn btn-gold"
>
                Start your piece
              </button>
              <a href="#process" className="btn btn-ghost">
                How it works
              </a>
            </div>
          </div>

          {/* Scroll hint */}
          <div
            ref={hintRef}
            aria-hidden
            className="absolute bottom-[1.4rem] z-[12] flex items-center gap-[.6rem] opacity-[.72] transition-opacity duration-[400ms] md:flex hidden"
            style={{ right: "clamp(1.5rem,6vw,5rem)" }}
          >
            <span
              style={{
                font: "500 9.5px var(--font-ui)",
                textTransform: "uppercase",
                letterSpacing: ".2em",
                color: "#F0E6D2",
              }}
            >
              Scroll to watch
            </span>
            <span
              className="block w-[30px] h-px"
              style={{
                background: "linear-gradient(to right, transparent, #CBA85C)",
                animation: "hint 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Scrub bar */}
          {canScrub && (
            <div
              aria-hidden
              className="absolute left-0 right-0 bottom-0 h-[3px] z-[11] hidden md:block"
              style={{ background: "rgba(240,230,210,.14)" }}
            >
              <div
                ref={scrubFillRef}
                className="h-full w-0"
                style={{
                  background: "#CBA85C",
                  boxShadow: "0 0 12px rgba(203,168,92,.5)",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(100vh) scale(0); opacity: 0; }
          10%  { opacity: .5; }
          50%  { opacity: .22; }
          90%  { opacity: .4; }
          100% { transform: translateY(-20vh) scale(1); opacity: 0; }
        }
        @keyframes hint {
          0%, 100% { opacity: .4; transform: scaleX(1); }
          50%       { opacity: .9; transform: scaleX(1.25); }
        }
        .btn {
          display: inline-flex; align-items: center; gap: .6rem;
          font: 500 11px var(--font-ui);
          text-transform: uppercase; letter-spacing: .16em;
          padding: 1rem 1.9rem; border-radius: 3px;
          cursor: pointer; border: none;
          transition: background .3s, color .3s, transform .25s, box-shadow .3s;
        }
        .btn-gold { background: #CBA85C; color: #1A1411; }
        .btn-gold:hover { background: #B5944A; transform: translateY(-2px); box-shadow: 0 10px 26px rgba(74,15,30,.25); }
        .btn-ghost {
          background: rgba(26,20,17,.28); color: #F0E6D2;
          border: 1px solid rgba(240,230,210,.32);
          backdrop-filter: blur(6px);
        }
        .btn-ghost:hover { color: #fff; border-color: rgba(240,230,210,.6); background: rgba(26,20,17,.45); }
      `}</style>
    </>
  );
}
