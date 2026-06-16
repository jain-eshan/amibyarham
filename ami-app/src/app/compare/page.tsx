import { CompareHero } from "./CompareHero";

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-canvas pt-24 pb-20">
      <div className="mx-auto max-w-[1400px] px-6">
        <h1 className="display-lg text-center text-ink">
          Hero Video Iterations
        </h1>
        <p className="mt-4 text-center text-body">
          Compare the three video options for the hero section.
        </p>

        <div className="mt-16 space-y-24">
          {/* Iteration 1: Edited video v2 (1440x1080, no BG, arrows baked in) — no code overlay */}
          <CompareHero
            label="Iteration 1"
            description="Edited video v2, 1440×1080 (no BG, arrows & text baked in) — no code overlay, full frame visible"
            videoSrc="/Edited-Ring-withoutBG-v2.mp4"
            showOverlay={false}
            aspectRatio="4 / 3"
            objectFit="contain"
          />

          {/* Iteration 2: Video without BG — code arrows & text overlaid */}
          <CompareHero
            label="Iteration 2"
            description="Video without background + multiply blend — arrows & text overlaid via code"
            videoSrc="/Ring-withoutBG.mp4"
            showOverlay={true}
          />

          {/* Iteration 3: Video with BG — code arrows & text overlaid */}
          <CompareHero
            label="Iteration 3"
            description="Video with background + multiply blend — arrows & text overlaid via code"
            videoSrc="/Ring-withBG.mp4"
            showOverlay={true}
          />
        </div>
      </div>
    </div>
  );
}
