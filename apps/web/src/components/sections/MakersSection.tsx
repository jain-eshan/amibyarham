import Image from "next/image";

import { Reveal } from "@/components/Reveal";

const MAKERS = [
  {
    role: "Design guide",
    detail: "Translates your reference into a makeable direction",
    src: "/team/makers/design-guide.jpg",
    objectPosition: "50% 38%",
  },
  {
    role: "Stone setter",
    detail: "Assesses stone type, setting style, and weight",
    src: "/team/makers/stone-setter.jpg",
    objectPosition: "50% 38%",
  },
  {
    role: "Finishing",
    detail: "Reviews texture, polish, and final surface quality",
    src: "/team/makers/finishing.jpg",
    objectPosition: "51% 34%",
  },
  {
    role: "Final check",
    detail: "Signs off before any piece leaves the bench",
    src: "/team/makers/final-check.jpg",
    objectPosition: "62% 41%",
  },
  {
    role: "Family liaison",
    detail: "Helps loop in partners, parents, and gifters",
    src: "/team/makers/family-liaison.jpg",
    objectPosition: "50% 36%",
  },
] as const;

export function MakersSection() {
  return (
    <section className="border-t border-hairline-soft bg-canvas py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Reveal>
              <p className="caption-uppercase text-muted">Made by people</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg mt-6 max-w-[18ch] text-ink">
                Your reference is read by real hands.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-body md:pb-1">
              Before a piece is made, the idea is checked by people who
              understand design, craft, stones, finish, and family approvals.
            </p>
          </Reveal>
        </div>

        {/* Makers row */}
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 md:mt-16 lg:grid-cols-5">
          {MAKERS.map((maker, i) => (
            <Reveal key={maker.role} delay={0.08 + i * 0.06}>
              <div className="flex flex-col items-center text-center">
                <div
                  className="relative overflow-hidden rounded-full border border-hairline bg-surface-soft shadow-[0_8px_24px_rgba(48,39,31,0.10)]"
                  style={{ height: 96, width: 96 }}
                >
                  <Image
                    src={maker.src}
                    alt={`AMI ${maker.role.toLowerCase()} — ${maker.detail.toLowerCase()}`}
                    fill
                    loading="eager"
                    sizes="96px"
                    className="object-cover"
                    style={{ objectPosition: maker.objectPosition }}
                  />
                </div>
                <p className="mt-4 text-sm font-medium text-ink">{maker.role}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{maker.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
