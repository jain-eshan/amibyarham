"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

/* ─── Input tab definitions ─────────────────────────────── */
const TABS = [
  {
    id: "text",
    outputImage: "/hero/polki-necklace-output.jpg",
    outputVideo: null,
    outputImageFit: "cover" as const,
    label: "WhatsApp message",
    description: "Type a rough description — the occasion, budget, who it's for. No need to be formal. We read every message personally.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    inputPreview: (
      <div className="flex h-full flex-col bg-[#e5ddd5] p-4">
        {/* WhatsApp-style header */}
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#075e54] px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-white/20" />
          <div>
            <p className="text-xs font-semibold text-white">AMI by Arham</p>
            <p className="text-[10px] text-white/70">online</p>
          </div>
        </div>
        {/* Messages */}
        <div className="flex flex-1 flex-col justify-end gap-2">
          <div className="self-end max-w-[78%] rounded-2xl rounded-br-sm bg-[#dcf8c6] px-3 py-2 shadow-sm">
            <p className="text-[13px] leading-snug text-[#1a1a1a]">
              Something like my bua&apos;s polki necklace but lighter. For daily wear, budget around ₹80k.
            </p>
            <p className="mt-1 text-right text-[10px] text-[#888]">11:42 AM ✓✓</p>
          </div>
          <div className="self-end max-w-[78%] rounded-2xl rounded-br-sm bg-[#dcf8c6] px-3 py-2 shadow-sm">
            <p className="text-[13px] leading-snug text-[#1a1a1a]">
              Occasion is my sister&apos;s wedding in December
            </p>
            <p className="mt-1 text-right text-[10px] text-[#888]">11:43 AM ✓✓</p>
          </div>
          <div className="self-start max-w-[78%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-sm">
            <p className="text-[13px] leading-snug text-[#1a1a1a]">
              Got it — I&apos;ll review this with our craftsman and share what&apos;s possible within 24 hrs. No commitment needed yet.
            </p>
            <p className="mt-1 text-[10px] text-[#888]">11:44 AM</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "image",
    outputImage: null,
    outputVideo: "/hero/making-the-necklace-video.mp4",
    outputImageFit: "cover" as const,
    label: "Saved image",
    description: "Screenshot a Pinterest pin, camera roll photo, or any image you've bookmarked. Any format works — WhatsApp, email, or Google Photos link.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={1.8}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    inputPreview: (
      <div className="relative h-full w-full bg-[#1a1a1a]">
        <Image
          src="/hero/pinterest-got-necklace.jpg"
          alt="Pinterest GOT necklace reference"
          fill
          className="object-cover opacity-90"
          sizes="600px"
        />
        {/* Pinterest badge overlay */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#e60023] px-3 py-1">
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
          </svg>
          <span className="text-[10px] font-semibold text-white">Pinterest</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-8">
          <p className="text-[12px] font-medium text-white">Dragon necklace inspo</p>
          <p className="text-[10px] text-white/60">Saved from @bridal.jewels</p>
        </div>
      </div>
    ),
  },
  {
    id: "reel",
    outputImage: "/hero/brooch-gemini.jpg",
    outputVideo: null,
    outputImageFit: "cover" as const,
    label: "Instagram reel",
    description: "Copy the link to a reel, post, or saved collection and paste it in. We'll watch it, note the design, and come back with what's makeable.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    inputPreview: (
      <div className="relative h-full w-full bg-black">
        <Image
          src="/hero/peacock-brooch.jpeg"
          alt="Peacock brooch Instagram reel reference"
          fill
          className="object-cover opacity-90"
          sizes="600px"
        />
        {/* Instagram reel UI overlay */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <span className="text-[10px] text-white/70">8.2k</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-12 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
          <p className="text-[11px] font-semibold text-white">@arham.diamonds</p>
          <p className="mt-0.5 text-[10px] text-white/70 line-clamp-2">
            Peacock brooch in emeralds & diamonds ✨ Statement piece for the ceremony look 💍
          </p>
        </div>
      </div>
    ),
  },
] as const;

/* ─── Content comparison slider ─────────────────────────── */
function ContentSlider({
  inputNode,
  tabId,
  outputImage,
  outputVideo,
  outputImageFit,
}: {
  inputNode: React.ReactNode;
  tabId: string;
  outputImage: string | null;
  outputVideo: string | null;
  outputImageFit: "cover" | "contain";
}) {
  const [pos, setPos] = useState(42);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
    setPos(Math.round(x));
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPos(Number(e.target.value));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: "4/3" }}
      onPointerMove={handlePointerMove}
    >
      {/* RIGHT side — finished jewelry output */}
      <div className="absolute inset-0 bg-[#f7f4ef]">
        {outputVideo ? (
          <video
            src={outputVideo}
            poster="/hero/polki-necklace-output.jpg"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : outputImage ? (
          <Image
            src={outputImage}
            alt="Finished AMI jewellery piece"
            fill
            className={outputImageFit === "cover" ? "object-cover" : "object-contain p-8"}
            sizes="600px"
          />
        ) : null}
        <div className="absolute inset-0 flex items-end p-4 pointer-events-none">
          <div className="ml-auto rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/90">
              What we make
            </span>
          </div>
        </div>
      </div>

      {/* LEFT side — customer input (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {inputNode}
        <div className="absolute inset-0 flex items-end p-4 pointer-events-none">
          <div className="rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/90">
              What you share
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-[1.5px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)]"
        style={{ left: `${pos}%` }}
      />

      {/* Handle */}
      <div
        className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_16px_rgba(0,0,0,0.22)]"
        style={{ left: `${pos}%` }}
      >
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
          <path d="M6 1L1 7l5 6" stroke="rgba(0,0,0,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 1l5 6-5 6" stroke="rgba(0,0,0,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Invisible range input */}
      <input
        type="range"
        min={4}
        max={96}
        value={pos}
        onChange={handleInput}
        aria-label="Compare input and output"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        style={{ zIndex: 4 }}
      />
    </div>
  );
}

/* ─── Main section ───────────────────────────────────────── */
export function ReferenceReality() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Heading row */}
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <Reveal>
              <p className="caption-uppercase text-muted">From reference to reality</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg mt-6 max-w-[16ch] text-ink">
                We do not copy blindly. We{" "}
                <em className="not-italic text-primary">translate</em>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-body md:text-lg">
              A saved image is usually only the starting point. AMI studies the
              look, checks what is practical, and suggests the craft, metal,
              stone, weight, and finish that make sense for your occasion.
            </p>
          </Reveal>
        </div>

        {/* Two-column interactive area */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-stretch">

          {/* LEFT — input type tabs */}
          <Reveal delay={0.12}>
            <div className="flex flex-col gap-4 lg:sticky lg:top-8">
              <p className="caption-uppercase text-muted">How you can share</p>

              <div className="flex flex-col gap-3">
                {TABS.map((tab, i) => {
                  const isActive = i === activeTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(i)}
                      className={[
                        "flex w-full items-start gap-3 rounded-xl border px-4 py-4 text-left transition-all duration-200",
                        isActive
                          ? "border-primary/30 bg-primary/8 text-ink shadow-[0_2px_8px_rgba(204,120,92,0.12)]"
                          : "border-hairline bg-[#fbfaf7] text-body hover:border-primary/20 hover:bg-primary/5",
                      ].join(" ")}
                    >
                      <span className={["mt-0.5 shrink-0", isActive ? "text-primary" : "text-muted"].join(" ")}>
                        {tab.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{tab.label}</span>
                          {isActive && (
                            <svg className="h-3.5 w-3.5 shrink-0 text-primary" viewBox="0 0 16 16" fill="none">
                              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <p className={["mt-1 text-xs leading-relaxed", isActive ? "text-body" : "text-muted"].join(" ")}>
                          {"description" in tab ? tab.description : ""}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted">
                Click any format above to see how it looks in the slider →
              </p>
            </div>
          </Reveal>

          {/* RIGHT — before/after slider */}
          <Reveal delay={0.18}>
            <div className="flex flex-col gap-3">
              <ContentSlider
                key={activeTab}
                inputNode={TABS[activeTab]!.inputPreview}
                tabId={TABS[activeTab]!.id}
                outputImage={TABS[activeTab]!.outputImage}
                outputVideo={TABS[activeTab]!.outputVideo}
                outputImageFit={TABS[activeTab]!.outputImageFit}
              />
              <p className="text-center text-xs text-muted">
                Drag to compare your reference with the finished piece
              </p>
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <Button href="/submit" size="lg">
              Send a reference →
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
