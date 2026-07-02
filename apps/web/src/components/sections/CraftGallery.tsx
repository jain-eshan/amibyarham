import Image from "next/image";

import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

const PIECES = [
  {
    src: "/hero/polki-necklace-output.jpg",
    alt: "Layered polki necklace set with matching earrings beside its design sketch and Arham Diamond card",
    caption: "Polki bridal set",
    detail: "Made from a client's reference sketch",
    aspect: "aspect-square",
  },
  {
    src: "/hero/hand-rings.png",
    alt: "Gold solitaire ring and plain band displayed on a sculpted hand",
    caption: "Solitaire & band",
    detail: "18k gold, everyday classic",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/hero/brooch-gemini.jpg",
    alt: "Peacock brooch in emeralds and diamonds in the Arham Diamonds atelier display case",
    caption: "At the atelier",
    detail: "Emerald & diamond suite",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/hero/peacock-brooch.jpeg",
    alt: "Peacock brooch in emeralds and diamonds worn on a navy suit lapel",
    caption: "Peacock brooch",
    detail: "Emeralds & diamonds, worn",
    aspect: "aspect-[3/4]",
  },
] as const;

export function CraftGallery() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Reveal>
              <p className="caption-uppercase text-muted">From our benches</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg mt-6 max-w-[18ch] text-ink">
                Pieces that began as{" "}
                <em className="not-italic text-primary">someone&rsquo;s reference</em>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-body md:pb-1">
              Every piece here started the way yours will — a saved image, a
              sketch, a conversation.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          {PIECES.map((piece, i) => (
            <Reveal key={piece.src} delay={0.08 + i * 0.06}>
              <figure>
                <div
                  className={`relative overflow-hidden rounded-xl border border-hairline bg-surface-soft ${piece.aspect}`}
                >
                  <Image
                    src={piece.src}
                    alt={piece.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </div>
                <figcaption className="mt-3">
                  <p className="text-sm font-medium text-ink">{piece.caption}</p>
                  <p className="mt-0.5 text-xs text-muted">{piece.detail}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button href="/submit" size="lg">
              Start with your reference →
            </Button>
            <Button href="/discover" variant="secondary" size="lg">
              Browse more inspiration
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
