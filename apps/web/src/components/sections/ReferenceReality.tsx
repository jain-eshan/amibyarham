import Image from "next/image";

import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

const VISUAL_TILES = [
  {
    type: "image",
    image: "/hero/hand-rings.png",
    alt: "A ring reference held as inspiration",
    className: "object-cover",
  },
  {
    type: "copy",
    label: "01",
    title: "Pinterest ring",
    body: "We keep the mood, then solve wearability, stone size, and budget.",
  },
  {
    type: "image",
    image: "/brand/og-image.png",
    alt: "AMI by Arham logo and jewellery brand preview",
    className: "object-cover",
  },
  {
    type: "copy",
    label: "02",
    title: "Family polki",
    body: "The silhouette stays familiar while weight, clasping, and comfort improve.",
    dark: true,
  },
  {
    type: "copy",
    label: "03",
    title: "Bridal reel",
    body: "We separate craft, stone, finish, and timeline before anything is made.",
  },
  {
    type: "image",
    image: "/hero/hand-rings-nobg.png",
    alt: "Hands wearing rings for custom jewellery inspiration",
    className: "object-contain p-7",
  },
  {
    type: "copy",
    label: "04",
    title: "Your plan",
    body: "You receive a practical direction: what can be made, what should change, and why.",
  },
  {
    type: "image",
    image: "/1.svg",
    alt: "Jewellery line illustration",
    className: "object-contain p-8 opacity-80",
  },
] as const;

export function ReferenceReality() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <Reveal>
              <p className="caption-uppercase text-muted">
                From reference to reality
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg mt-6 max-w-[16ch] text-ink">
                We do not copy blindly. We{" "}
                <em className="not-italic text-primary">translate</em>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="max-w-xl">
              <p className="text-body md:text-lg">
                A saved image is usually only the starting point. AMI studies the
                look, checks what is practical, and suggests the craft, metal,
                stone, weight, and finish that make sense for your occasion.
              </p>
              <div className="mt-6">
                <Button href="/submit" size="lg">
                  Send a reference →
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-14">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {VISUAL_TILES.map((tile, index) => {
                if (tile.type === "image") {
                  return (
                    <div
                      key={`${tile.image}-${index}`}
                      className="relative min-h-[220px] overflow-hidden rounded-2xl bg-canvas shadow-[inset_2px_2px_9px_rgba(48,39,31,0.05),inset_-4px_-4px_14px_rgba(255,255,255,0.92)] sm:min-h-[240px] lg:min-h-[230px]"
                    >
                      <Image
                        src={tile.image}
                        alt={tile.alt}
                        fill
                        sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 92vw"
                        className={tile.className}
                      />
                    </div>
                  );
                }

                const isDark = "dark" in tile && tile.dark;

                return (
                  <article
                    key={`${tile.label}-${tile.title}`}
                    className={[
                      "flex min-h-[220px] flex-col justify-between rounded-2xl border p-6 sm:min-h-[240px] lg:min-h-[230px]",
                      isDark
                        ? "border-ink bg-ink text-on-dark"
                        : "border-hairline bg-[#fbfaf7] text-ink shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]",
                    ].join(" ")}
                  >
                    <p
                      className={[
                        "font-mono text-xs tracking-[0.24em]",
                        isDark ? "text-on-dark/55" : "text-muted",
                      ].join(" ")}
                    >
                      {tile.label}
                    </p>
                    <div>
                      <h3 className="text-[22px] font-medium leading-tight tracking-normal">
                        {tile.title}
                      </h3>
                      <p
                        className={[
                          "mt-5 text-sm leading-relaxed",
                          isDark ? "text-on-dark/70" : "text-body",
                        ].join(" ")}
                      >
                        {tile.body}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
