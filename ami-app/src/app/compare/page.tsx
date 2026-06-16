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
          {/* Iteration 1: Edited video (arrows baked in) — no overlay */}
          <CompareHero
            label="Iteration 1"
            description="Video without background — arrows & text baked into the video itself"
            videoSrc="/Ring-withoutBG.mp4"
            showOverlay={false}
          />

          {/* Iteration 2: Ring with BG — overlay arrows & text */}
          <CompareHero
            label="Iteration 2"
            description="Video with background + multiply blend — arrows & text overlaid via code"
            videoSrc="/Ring-withBG.mp4"
            showOverlay={true}
          />

          {/* Iteration 3: Original video — overlay arrows & text */}
          <CompareHero
            label="Iteration 3"
            description="Original video + multiply blend — arrows & text overlaid via code"
            videoSrc="/Generate_a_smooth_second_ani.mp4"
            showOverlay={true}
          />
        </div>
      </div>
    </div>
  );
}
