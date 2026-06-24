import Image from "next/image";

import { Reveal } from "@/components/Reveal";

const MAKERS = [
  {
    role: "Design guide",
    src: "/team/makers/design-guide.jpg",
    objectPosition: "50% 38%",
    left: "18%",
    top: "48%",
    size: 94,
  },
  {
    role: "Stone setter",
    src: "/team/makers/stone-setter.jpg",
    objectPosition: "50% 38%",
    left: "75%",
    top: "46%",
    size: 108,
  },
  {
    role: "Finishing",
    src: "/team/makers/finishing.jpg",
    objectPosition: "51% 34%",
    left: "34%",
    top: "76%",
    size: 104,
  },
  {
    role: "Final check",
    src: "/team/makers/final-check.jpg",
    objectPosition: "62% 41%",
    left: "65%",
    top: "78%",
    size: 88,
  },
  {
    role: "Family liaison",
    src: "/team/makers/family-liaison.jpg",
    objectPosition: "50% 36%",
    left: "85%",
    top: "72%",
    size: 92,
  },
] as const;

export function MakersSection() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal>
            <p className="caption-uppercase text-muted">Made by people</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg mt-6 max-w-[14ch] text-ink">
              Your reference is read by real hands.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-body">
              Before a piece is made, the idea is checked by people who
              understand design, craft, stones, finish, and family approvals.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 grid max-w-md grid-cols-2 gap-x-8 gap-y-4 border-t border-hairline-soft pt-6 text-sm text-body">
              <p>Design direction</p>
              <p>Craft feasibility</p>
              <p>Material guidance</p>
              <p>Approval checkpoints</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative min-h-[430px] overflow-hidden">
            {MAKERS.map((maker) => (
              <figure
                key={maker.role}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: maker.left, top: maker.top }}
              >
                <div
                  className="relative overflow-hidden rounded-full border border-white/80 bg-surface-soft shadow-[0_18px_38px_rgba(48,39,31,0.14)]"
                  style={{ height: maker.size, width: maker.size }}
                >
                  <Image
                    src={maker.src}
                    alt=""
                    fill
                    loading="eager"
                    sizes={`${maker.size}px`}
                    className="object-cover"
                    style={{
                      objectPosition: maker.objectPosition,
                    }}
                  />
                </div>
                <figcaption className="mt-3 whitespace-nowrap rounded-full border border-hairline bg-canvas/90 px-3 py-1 text-xs text-body shadow-sm">
                  {maker.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
