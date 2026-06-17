"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  referenceMode: z.enum(["url", "upload"]),
  referenceUrl: z.string().optional(),
  metal: z.enum(["18k", "22k", "unsure"]).optional(),
  occasion: z
    .enum(["myself", "gift", "anniversary", "engagement", "wedding", "other"])
    .optional(),
  designNotes: z.string().max(600, "Keep it under 600 characters").optional(),
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
  const [step, setStep] = useState<1 | 2 | 3 | "done">(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { referenceMode: "url", metal: "unsure" },
  });

  const referenceMode = watch("referenceMode");
  const metal = watch("metal");
  const occasion = watch("occasion");

  // ─── File handling ──────────────────────────────────────────────────────────

  const applyFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setFileError("Please upload an image file (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File must be under 10 MB");
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
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      setDirection(1);
      setStep(3);
    }
  }, [step, referenceMode, watch, uploadFile]);

  const back = useCallback(() => {
    setDirection(-1);
    setStep((s) => (s === 2 ? 1 : s === 3 ? 2 : s) as 1 | 2 | 3);
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
        occasion: data.occasion,
        designNotes: data.designNotes,
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

      setDirection(1);
      setStep("done");
    } catch (err) {
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
          Your vision is pinned to the bench.
        </h2>
        <p className="mt-4 max-w-sm text-body">
          We&rsquo;ll review your reference and reach out on WhatsApp within 24
          hours with a confirmed design and quote.
        </p>
        <Button href="/" variant="secondary" size="lg" className="mt-10">
          Back to home →
        </Button>
      </motion.div>
    );
  }

  // ─── Step indicator ─────────────────────────────────────────────────────────

  const STEP_LABELS = ["Reference", "Vision", "Contact"];

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
      {/* Step indicator */}
      <div className="mb-12 flex items-center gap-2">
        {STEP_LABELS.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const isActive = step === n;
          const isDone = typeof step === "number" && step > n;
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className={`h-px w-8 transition-colors ${isDone ? "bg-primary" : "bg-hairline"}`}
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
                  className={`hidden text-sm sm:block ${isActive ? "text-ink" : "text-muted"}`}
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
                  Share your reference.
                </h1>
                <p className="mt-3 max-w-md text-body">
                  A Pinterest board, Instagram screenshot, reel — anything that
                  captures the piece you have in mind.
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
                            JPG, PNG, WEBP — max 10 MB
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

            {/* ── Step 2: Vision ──────────────────────────────────────────── */}
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
                  Tell us about the piece.
                </h1>
                <p className="mt-3 max-w-md text-body">
                  Nothing here is required — any detail you share helps the
                  karigar understand your vision.
                </p>

                <div className="mt-8 space-y-8">
                  {/* Metal */}
                  <div>
                    <p className="mb-3 text-sm text-muted">Metal preference</p>
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

                  {/* Occasion */}
                  <div>
                    <p className="mb-3 text-sm text-muted">Occasion</p>
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

                  {/* Notes */}
                  <div>
                    <label className="mb-2 block text-sm text-muted">
                      Anything else?{" "}
                      <span className="text-muted/60">(optional)</span>
                    </label>
                    <textarea
                      {...register("designNotes")}
                      rows={4}
                      placeholder="E.g. I want a thinner band, similar stone size. It's for my mother's 60th birthday in 22k gold…"
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
                  Stay in touch.
                </h1>
                <p className="mt-3 max-w-md text-body">
                  We&rsquo;ll send your quote and confirmed design on WhatsApp
                  within 24 hours.
                </p>

                <div className="mt-8 space-y-6">
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
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending…" : "Send my reference →"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
