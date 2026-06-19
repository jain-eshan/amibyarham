"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  referenceMode: z.enum(["url", "upload"]),
  referenceUrl: z.string().optional(),
  metal: z.enum(["18k", "22k", "unsure"]).optional(),
  budget: z
    .enum(["under-50k", "50k-1l", "1l-3l", "3l-plus", "unsure"])
    .optional(),
  designIntent: z.enum(["close-match", "inspired", "unsure"]).optional(),
  wearContext: z.enum(["daily", "occasion", "bridal", "unsure"]).optional(),
  timeline: z
    .enum(["no-rush", "this-month", "two-three-months", "date-fixed"])
    .optional(),
  occasion: z
    .enum(["myself", "gift", "anniversary", "engagement", "wedding", "other"])
    .optional(),
  designNotes: z.string().max(800, "Keep it under 800 characters").optional(),
  contactPreference: z.enum(["whatsapp-message", "whatsapp-call"]).optional(),
  fullName: z.string().min(2, "Name is required"),
  whatsapp: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z
    .union([z.string().email("Enter a valid email"), z.literal("")])
    .optional(),
});

type FormData = z.infer<typeof schema>;

// ─── Options ─────────────────────────────────────────────────────────────────

const METAL_OPTIONS = [
  { value: "18k" as const, label: "18k Gold" },
  { value: "22k" as const, label: "22k Gold" },
  { value: "unsure" as const, label: "Not sure yet" },
];

const OCCASION_OPTIONS = [
  { value: "myself" as const, label: "For myself" },
  { value: "gift" as const, label: "Gift" },
  { value: "anniversary" as const, label: "Anniversary" },
  { value: "engagement" as const, label: "Engagement" },
  { value: "wedding" as const, label: "Wedding" },
  { value: "other" as const, label: "Other" },
];

const DESIGN_INTENT_OPTIONS = [
  { value: "close-match" as const, label: "Close to the reference" },
  { value: "inspired" as const, label: "Inspired, not exact" },
  { value: "unsure" as const, label: "Need guidance" },
];

const WEAR_CONTEXT_OPTIONS = [
  { value: "daily" as const, label: "Daily wear" },
  { value: "occasion" as const, label: "Occasion wear" },
  { value: "bridal" as const, label: "Bridal / wedding" },
  { value: "unsure" as const, label: "Not sure yet" },
];

const TIMELINE_OPTIONS = [
  { value: "no-rush" as const, label: "No rush" },
  { value: "this-month" as const, label: "This month" },
  { value: "two-three-months" as const, label: "2-3 months" },
  { value: "date-fixed" as const, label: "Fixed date" },
];

const BUDGET_OPTIONS = [
  { value: "under-50k" as const, label: "Under ₹50k" },
  { value: "50k-1l" as const, label: "₹50k–₹1L" },
  { value: "1l-3l" as const, label: "₹1L–₹3L" },
  { value: "3l-plus" as const, label: "₹3L+" },
  { value: "unsure" as const, label: "Not sure yet" },
];

const CONTACT_OPTIONS = [
  { value: "whatsapp-message" as const, label: "WhatsApp message" },
  { value: "whatsapp-call" as const, label: "WhatsApp call" },
];

const GUIDE_STEPS = [
  {
    eyebrow: "Step 1",
    title: "Share whatever holds the idea.",
    body: "A screenshot, reel, Pinterest board, old family photo, or rough sketch is enough. You do not need a polished brief before AMI can help.",
    bullets: [
      "Upload an image or paste a link",
      "Add what you want to keep or change",
      "Share a planning range if you have one",
    ],
    visualLabel: "Reference",
    visualTitle: "Saved image, reel, board, or family photo",
  },
  {
    eyebrow: "Step 2",
    title: "AMI checks what can actually be made.",
    body: "Your reference is reviewed for craft, wearability, metal, stone options, timeline, and budget fit before it goes into a making conversation.",
    bullets: [
      "What can be made closely",
      "What may need to change",
      "Which making route fits best",
    ],
    visualLabel: "Feasibility",
    visualTitle: "Craft, budget, wearability, and timeline check",
  },
  {
    eyebrow: "Step 3",
    title: "You get a clear WhatsApp response.",
    body: "Within 24 hours, AMI replies with feasibility, likely changes, and the next step. No obligation, no spam, no pressure to proceed.",
    bullets: [
      "Private response on WhatsApp",
      "Expected changes explained clearly",
      "Next step only if you want to continue",
    ],
    visualLabel: "Response",
    visualTitle: "Feasibility note and next step",
  },
] as const;

// ─── Animation ───────────────────────────────────────────────────────────────

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0 }),
};

const transition = { duration: 0.26, ease: [0.32, 0, 0.67, 0] as const };

// ─── Shared input class ───────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border border-hairline bg-canvas px-4 py-3 text-ink " +
  "placeholder:text-muted/50 outline-none transition " +
  "focus:border-primary focus:ring-1 focus:ring-primary";

// ─── Component ───────────────────────────────────────────────────────────────

export function SubmitForm() {
  const ph = usePostHog();
  const [showGuide, setShowGuide] = useState(true);
  const [guideStep, setGuideStep] = useState<0 | 1 | 2>(0);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | "done">(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formShellRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      referenceMode: "url",
      metal: "unsure",
      budget: "unsure",
      designIntent: "unsure",
      wearContext: "unsure",
      contactPreference: "whatsapp-message",
    },
  });

  const referenceMode = watch("referenceMode");
  const metal = watch("metal");
  const budget = watch("budget");
  const designIntent = watch("designIntent");
  const wearContext = watch("wearContext");
  const timeline = watch("timeline");
  const occasion = watch("occasion");
  const contactPreference = watch("contactPreference");
  const referenceUrl = watch("referenceUrl");
  const designNotes = watch("designNotes");
  const fullName = watch("fullName");
  const whatsapp = watch("whatsapp");
  const email = watch("email");

  useEffect(() => {
    ph?.capture("submit_guide_viewed");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step !== 1 && step !== "done") {
      formShellRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  // ─── File handling ──────────────────────────────────────────────────────────

  const applyFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setFileError("Please upload an image file (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFileError("File must be under 4 MB");
      return;
    }
    setFileError(null);
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
  }, []);

  const clearFile = useCallback(() => {
    setUploadFile(null);
    setUploadPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ─── Step navigation ────────────────────────────────────────────────────────

  const advance = useCallback(async () => {
    if (step === 1) {
      if (referenceMode === "url") {
        const url = watch("referenceUrl")?.trim();
        if (!url) {
          setUrlError("Paste a link to your inspiration");
          return;
        }
        setUrlError(null);
      } else {
        if (!uploadFile) {
          setFileError("Please select a file to upload");
          return;
        }
      }
      ph?.capture("submit_step_completed", {
        step: 1,
        step_name: "reference",
        reference_mode: referenceMode,
      });
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      ph?.capture("submit_step_completed", { step: 2, step_name: "details" });
      setDirection(1);
      setStep(3);
    } else if (step === 3) {
      const isValid = await trigger(["fullName", "whatsapp", "email"]);
      if (!isValid) return;
      ph?.capture("submit_step_completed", { step: 3, step_name: "contact" });
      setDirection(1);
      setStep(4);
    }
  }, [step, referenceMode, watch, uploadFile, trigger, ph]);

  const back = useCallback(() => {
    setDirection(-1);
    setStep((s) =>
      s === 2 ? 1 : s === 3 ? 2 : s === 4 ? 3 : s,
    );
  }, []);

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const metadata = {
        referenceMode: data.referenceMode,
        referenceUrl: data.referenceUrl,
        metal: data.metal,
        budget: data.budget,
        designIntent: data.designIntent,
        wearContext: data.wearContext,
        timeline: data.timeline,
        occasion: data.occasion,
        designNotes: data.designNotes,
        contactPreference: data.contactPreference,
        fullName: data.fullName,
        whatsapp: data.whatsapp,
        email: data.email || "",
      };

      let res: Response;
      if (data.referenceMode === "upload" && uploadFile) {
        const form = new FormData();
        form.append("metadata", JSON.stringify(metadata));
        form.append("file", uploadFile);
        res = await fetch("/api/submit-request", { method: "POST", body: form });
      } else {
        res = await fetch("/api/submit-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metadata),
        });
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Something went wrong");

      ph?.capture("submit_request_sent", {
        reference_mode: data.referenceMode,
        metal: data.metal,
        budget: data.budget,
        design_intent: data.designIntent,
        wear_context: data.wearContext,
        timeline: data.timeline,
        occasion: data.occasion,
        contact_preference: data.contactPreference,
        has_notes: Boolean(data.designNotes?.trim()),
        has_email: Boolean(data.email),
      });
      setDirection(1);
      setStep("done");
    } catch (err) {
      ph?.capture("submit_request_failed", {
        error: err instanceof Error ? err.message : "unknown",
      });
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong — please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Chip helper ────────────────────────────────────────────────────────────

  const chipCls = (active: boolean) =>
    [
      "rounded-full border px-4 py-1.5 text-sm transition-colors cursor-pointer",
      active
        ? "border-primary bg-primary text-on-primary"
        : "border-hairline text-ink hover:border-primary/50",
    ].join(" ");

  const labelFor = <T extends string>(
    options: Array<{ value: T; label: string }>,
    value?: T,
  ) => options.find((opt) => opt.value === value)?.label ?? "Not shared";

  const startForm = (source: "guide_completed" | "skipped") => {
    ph?.capture("submit_form_started", { source });
    setShowGuide(false);
    setStep(1);
    setDirection(1);
  };

  // ─── Guided explainer ──────────────────────────────────────────────────────

  if (showGuide) {
    const current = GUIDE_STEPS[guideStep];
    const progress = ((guideStep + 1) / GUIDE_STEPS.length) * 100;
    const isLastGuideStep = guideStep === GUIDE_STEPS.length - 1;

    return (
      <section className="min-h-[calc(100vh-4rem)] bg-canvas px-6 py-8 md:py-12">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <button
            type="button"
            onClick={() =>
              guideStep === 0 ? history.back() : setGuideStep((s) => (s - 1) as 0 | 1 | 2)
            }
            className="text-sm font-medium text-ink transition-colors hover:text-primary"
          >
            ← {guideStep === 0 ? "Back" : "Previous"}
          </button>
          <button
            type="button"
            onClick={() => startForm("skipped")}
            className="rounded-full border border-hairline px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-primary/50 hover:text-primary"
          >
            Skip
          </button>
        </div>

        <div className="mx-auto grid max-w-[980px] grid-cols-12 items-center gap-10 pt-14 md:min-h-[70vh] md:pt-8">
          <div className="col-span-12 md:col-span-6">
            <div className="mb-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-card">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="caption-uppercase text-muted">{current.eyebrow}</p>
            <h1
              className="display-lg mt-4 max-w-[12ch] text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {current.title}
            </h1>
            <p className="mt-5 max-w-lg text-body md:text-lg">{current.body}</p>
            <ul className="mt-7 space-y-3">
              {current.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-body">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-medium text-primary">
                    ✓
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() =>
                  isLastGuideStep
                    ? startForm("guide_completed")
                    : setGuideStep((s) => (s + 1) as 0 | 1 | 2)
                }
              >
                {isLastGuideStep ? "Start with a reference →" : "Next →"}
              </Button>
              {!isLastGuideStep && (
                <button
                  type="button"
                  onClick={() => startForm("skipped")}
                  className="px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
                >
                  I know what to send
                </button>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="relative overflow-hidden rounded-lg border border-hairline bg-surface-card p-5 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-10 border-b border-hairline bg-canvas/70" />
              <div className="relative pt-12">
                <p className="caption-uppercase text-muted">
                  {current.visualLabel}
                </p>
                <div className="mt-4 aspect-[4/3] rounded-md border border-dashed border-hairline bg-canvas p-5">
                  <div className="grid h-full grid-cols-3 gap-3">
                    <div className="col-span-1 rounded-md bg-surface-soft p-3">
                      <div className="h-3 w-12 rounded-full bg-hairline" />
                      <div className="mt-3 h-16 rounded-md bg-primary/15" />
                      <div className="mt-3 h-2 w-16 rounded-full bg-hairline" />
                      <div className="mt-2 h-2 w-10 rounded-full bg-hairline" />
                    </div>
                    <div className="col-span-2 space-y-3">
                      {[0, 1, 2].map((item) => (
                        <div
                          key={item}
                          className="rounded-md border border-hairline bg-surface-soft p-3"
                        >
                          <div className="h-2 w-24 rounded-full bg-hairline" />
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="h-10 rounded bg-canvas" />
                            <div className="h-10 rounded bg-canvas" />
                            <div className="h-10 rounded bg-canvas" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted">
                  Image / lottie slot: {current.visualTitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Done screen ────────────────────────────────────────────────────────────

  if (step === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-[55vh] flex-col items-center justify-center px-6 py-24 text-center"
      >
        <span className="text-5xl text-primary">✦</span>
        <h2
          className="display-lg mt-6 max-w-lg text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your reference has reached AMI.
        </h2>
        <p className="mt-4 max-w-sm text-body">
          We&rsquo;ll review it privately with the right making route in mind
          and reply on WhatsApp within 24 hours with feasibility, possible
          changes, and the next step.
        </p>
        <Button href="/" variant="secondary" size="lg" className="mt-10">
          Back to home →
        </Button>
      </motion.div>
    );
  }

  // ─── Step indicator ─────────────────────────────────────────────────────────

  const STEP_LABELS = ["Reference", "Details", "Contact", "Review"];

  return (
    <div
      ref={formShellRef}
      className="mx-auto grid max-w-[1200px] grid-cols-12 gap-10 px-6 py-14 md:py-20"
    >
      <aside className="col-span-12 md:col-span-4">
        <div className="sticky top-24 space-y-5">
          <div className="rounded-lg border border-hairline bg-surface-card p-6">
            <p className="caption-uppercase text-muted">What happens next</p>
            <div className="mt-5 space-y-4">
              {[
                ["1", "AMI checks your reference for craft, wearability, and budget fit."],
                ["2", "The right making route is discussed with trusted craftsmen."],
                ["3", "You hear back on WhatsApp with feasibility and next steps."],
              ].map(([number, copy]) => (
                <div key={number} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                    {number}
                  </span>
                  <p className="text-sm text-body">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-hairline bg-canvas p-6">
            <p className="caption-uppercase text-muted">Image slot</p>
            <div className="mt-4 aspect-[4/3] rounded-md border border-dashed border-hairline bg-surface-soft p-4">
              <div className="flex h-full items-end">
                <p className="text-sm text-muted">
                  Add a buyer-safe visual here: WhatsApp feasibility note,
                  reference board, or craft consultation illustration.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted">
            Private reference. No spam. No obligation to proceed after the first
            feasibility response.
          </p>
        </div>
      </aside>

      <div className="col-span-12 md:col-span-8">
        {/* Step indicator */}
        <div className="mb-10 flex flex-wrap items-center gap-2 md:mb-12">
        {STEP_LABELS.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3 | 4;
          const isActive = step === n;
          const isDone = typeof step === "number" && step > n;
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className={`h-px w-4 transition-colors sm:w-8 ${isDone ? "bg-primary" : "bg-hairline"}`}
                />
              )}
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary text-on-primary"
                      : isDone
                        ? "bg-primary/20 text-primary"
                        : "bg-surface-card text-muted",
                  ].join(" ")}
                >
                  {isDone ? "✓" : n}
                </span>
                <span
                  className={`text-xs sm:text-sm ${isActive ? "text-ink" : "text-muted"}`}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
        </div>

        {/* Steps */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="relative overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            {/* ── Step 1: Reference ───────────────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                <h1
                  className="display-md text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Start with one reference.
                </h1>
                <p className="mt-3 max-w-md text-body">
                  Send the clearest link or image you have. If you have more,
                  mention them later in the notes or share them when AMI
                  replies on WhatsApp.
                </p>

                {/* Mode toggle */}
                <div className="mt-8 flex gap-1 rounded-lg bg-surface-card p-1">
                  {(["url", "upload"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setValue("referenceMode", mode);
                        setUrlError(null);
                        setFileError(null);
                      }}
                      className={[
                        "flex-1 rounded-md py-2.5 text-sm font-medium transition-colors",
                        referenceMode === mode
                          ? "bg-canvas text-ink shadow-sm"
                          : "text-muted hover:text-ink",
                      ].join(" ")}
                    >
                      {mode === "url" ? "Share a link" : "Upload a file"}
                    </button>
                  ))}
                </div>

                {referenceMode === "url" ? (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm text-muted">
                      Reference URL
                    </label>
                    <input
                      {...register("referenceUrl")}
                      type="url"
                      placeholder="https://www.pinterest.com/pin/…"
                      className={inputCls}
                      onChange={(e) => {
                        setValue("referenceUrl", e.target.value);
                        if (e.target.value.trim()) setUrlError(null);
                      }}
                    />
                    {urlError && (
                      <p className="mt-2 text-sm text-primary">{urlError}</p>
                    )}
                  </div>
                ) : (
                  <div className="mt-6">
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label="Upload inspiration image"
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) applyFile(file);
                      }}
                      className={[
                        "relative flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors",
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-hairline hover:border-primary/40",
                      ].join(" ")}
                    >
                      {uploadPreview ? (
                        <img
                          src={uploadPreview}
                          alt="Your uploaded reference"
                          className="h-40 w-auto rounded-lg object-cover"
                        />
                      ) : (
                        <>
                          <span className="text-4xl text-primary/40">✦</span>
                          <p className="text-sm text-muted">
                            Drop your image here, or{" "}
                            <span className="text-primary underline">
                              browse
                            </span>
                          </p>
                          <p className="text-xs text-muted/60">
                            JPG, PNG, WEBP — max 4 MB
                          </p>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) applyFile(file);
                        }}
                      />
                    </div>
                    {fileError && (
                      <p className="mt-2 text-sm text-primary">{fileError}</p>
                    )}
                    {uploadFile && (
                      <button
                        type="button"
                        onClick={clearFile}
                        className="mt-2 text-xs text-muted transition-colors hover:text-ink"
                      >
                        Remove file
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-10 flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={advance}
                  >
                    Continue →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Details ─────────────────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                <h1
                  className="display-md text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Help us brief the craftsman.
                </h1>
                <p className="mt-3 max-w-md text-body">
                  These answers are optional, but they help AMI judge what can
                  be made, what should change, and which making route fits.
                </p>

                <div className="mt-8 space-y-8">
                  {/* Intent */}
                  <div>
                    <p className="mb-3 text-sm text-muted">
                      How close should it be?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DESIGN_INTENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setValue("designIntent", opt.value)}
                          className={chipCls(designIntent === opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wear context */}
                  <div>
                    <p className="mb-3 text-sm text-muted">
                      Where will it be worn?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {WEAR_CONTEXT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setValue("wearContext", opt.value)}
                          className={chipCls(wearContext === opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Metal */}
                  <div>
                    <p className="mb-3 text-sm text-muted">
                      Metal, if you know it
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {METAL_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setValue("metal", opt.value)}
                          className={chipCls(metal === opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <p className="mb-3 text-sm text-muted">Planning range</p>
                    <div className="flex flex-wrap gap-2">
                      {BUDGET_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setValue("budget", opt.value)}
                          className={chipCls(budget === opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      This helps AMI suggest the right metal, stone, and
                      craftsmanship route before quoting.
                    </p>
                  </div>

                  {/* Occasion and timeline */}
                  <div>
                    <p className="mb-3 text-sm text-muted">
                      Occasion or reason
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {OCCASION_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setValue("occasion", opt.value)}
                          className={chipCls(occasion === opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm text-muted">
                      When do you need it?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TIMELINE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setValue("timeline", opt.value)}
                          className={chipCls(timeline === opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-2 block text-sm text-muted">
                      What should we keep, change, or avoid?{" "}
                      <span className="text-muted/60">(optional)</span>
                    </label>
                    <textarea
                      {...register("designNotes")}
                      rows={4}
                      placeholder="E.g. Keep the oval centre stone mood, make the band thinner, avoid a very high setting. It is for my mother's 60th birthday…"
                      className={inputCls + " resize-none"}
                    />
                    {errors.designNotes && (
                      <p className="mt-1 text-sm text-primary">
                        {errors.designNotes.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={back}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    ← Back
                  </button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={advance}
                  >
                    Continue →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Contact ─────────────────────────────────────────── */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                <h1
                  className="display-md text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Where should AMI reach you?
                </h1>
                <p className="mt-3 max-w-md text-body">
                  We&rsquo;ll use this only for your reference. No spam, no
                  catalogue blasts, no obligation to continue after the first
                  feasibility response.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <p className="mb-3 text-sm text-muted">
                      Preferred first response
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CONTACT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setValue("contactPreference", opt.value)}
                          className={chipCls(contactPreference === opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      AMI replies within 24 hours with feasibility, likely
                      changes, and the next step.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-muted">
                      Full name *
                    </label>
                    <input
                      {...register("fullName")}
                      type="text"
                      placeholder="Priya Mehta"
                      autoComplete="name"
                      className={inputCls}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-primary">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-muted">
                      WhatsApp number *
                    </label>
                    <div className="flex items-stretch gap-2">
                      <span className="flex items-center rounded-lg border border-hairline bg-surface-card px-3 text-sm text-muted">
                        +91
                      </span>
                      <input
                        {...register("whatsapp")}
                        type="tel"
                        placeholder="9876543210"
                        autoComplete="tel-national"
                        maxLength={10}
                        inputMode="numeric"
                        className={inputCls}
                      />
                    </div>
                    {errors.whatsapp && (
                      <p className="mt-1 text-sm text-primary">
                        {errors.whatsapp.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-muted">
                      Email{" "}
                      <span className="text-muted/60">(optional)</span>
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="priya@example.com"
                      autoComplete="email"
                      className={inputCls}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-primary">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="mt-6 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
                    {submitError}
                  </div>
                )}

                <div className="mt-10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={back}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    ← Back
                  </button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={advance}
                  >
                    Review →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Review ─────────────────────────────────────────── */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                <h1
                  className="display-md text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Review before sending.
                </h1>
                <p className="mt-3 max-w-md text-body">
                  This is the brief AMI will use to start the feasibility check.
                  You can still refine everything over WhatsApp.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="rounded-lg border border-hairline bg-surface-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="caption-uppercase text-muted">Reference</p>
                        <p className="mt-2 break-words text-sm text-ink">
                          {referenceMode === "url"
                            ? referenceUrl || "Link shared"
                            : uploadFile?.name || "Image uploaded"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDirection(-1);
                          setStep(1);
                        }}
                        className="text-sm text-primary"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-hairline bg-canvas p-5">
                    <div className="flex items-start justify-between gap-4">
                      <p className="caption-uppercase text-muted">Making brief</p>
                      <button
                        type="button"
                        onClick={() => {
                          setDirection(-1);
                          setStep(2);
                        }}
                        className="text-sm text-primary"
                      >
                        Edit
                      </button>
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted">Direction</dt>
                        <dd className="text-ink">
                          {labelFor(DESIGN_INTENT_OPTIONS, designIntent)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">Wear context</dt>
                        <dd className="text-ink">
                          {labelFor(WEAR_CONTEXT_OPTIONS, wearContext)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">Metal</dt>
                        <dd className="text-ink">{labelFor(METAL_OPTIONS, metal)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted">Budget</dt>
                        <dd className="text-ink">
                          {labelFor(BUDGET_OPTIONS, budget)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">Occasion</dt>
                        <dd className="text-ink">
                          {labelFor(OCCASION_OPTIONS, occasion)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">Timeline</dt>
                        <dd className="text-ink">
                          {labelFor(TIMELINE_OPTIONS, timeline)}
                        </dd>
                      </div>
                    </dl>
                    {designNotes?.trim() && (
                      <p className="mt-4 whitespace-pre-wrap rounded-md bg-surface-soft p-4 text-sm text-body">
                        {designNotes.trim()}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border border-hairline bg-canvas p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="caption-uppercase text-muted">Contact</p>
                        <p className="mt-2 text-sm text-ink">
                          {fullName} · +91 {whatsapp}
                        </p>
                        {email && <p className="mt-1 text-sm text-muted">{email}</p>}
                        <p className="mt-2 text-sm text-muted">
                          First response:{" "}
                          {labelFor(CONTACT_OPTIONS, contactPreference)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDirection(-1);
                          setStep(3);
                        }}
                        className="text-sm text-primary"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="mt-6 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
                    {submitError}
                  </div>
                )}

                <div className="mt-10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={back}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    ← Back
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending…" : "Send to AMI →"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
      </div>
    </div>
  );
}
