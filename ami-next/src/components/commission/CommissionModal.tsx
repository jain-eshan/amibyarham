"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { supabase } from "@/lib/supabase";
import { EMAILJS_CONFIG, WHATSAPP_NUMBER } from "@/lib/emailjs";
import { useModal } from "@/context/ModalContext";

/* ─── types ─────────────────────────────────────────────── */
interface FormState {
  occasion: string;
  occasionNote: string;
  description: string;
  imageUrl: string;
  budgetRange: string;
  name: string;
  phone: string;
  email: string;
  city: string;
}

/* ─── constants ──────────────────────────────────────────── */
const OCCASIONS = [
  "Wedding",
  "Anniversary",
  "Birthday",
  "Daily Wear",
  "Gift",
  "Other",
];

const BUDGETS = [
  { label: "Under ₹50k", value: "under_50k" },
  { label: "₹50k – ₹1L", value: "50k_1l" },
  { label: "₹1L – ₹3L", value: "1l_3l" },
  { label: "₹3L+", value: "3l_plus" },
  { label: "Let's discuss", value: "discuss" },
];

const TOTAL_STEPS = 4;

/* ─── variants ───────────────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

/* ─── sub-components ─────────────────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        font: "500 10.5px var(--font-ui)",
        textTransform: "uppercase",
        letterSpacing: ".22em",
        color: "rgba(181,148,74,.75)",
        marginBottom: 10,
      }}
    >
      {children}
    </span>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  type = "text",
  required,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      style={{
        width: "100%",
        background: "rgba(240,230,210,.06)",
        border: "1px solid rgba(240,230,210,.18)",
        borderRadius: 4,
        padding: ".75rem 1rem",
        color: "var(--color-silk)",
        font: "400 15px var(--font-ui)",
        outline: "none",
        transition: "border-color .2s",
        boxSizing: "border-box",
      }}
      onFocus={(e) =>
        (e.currentTarget.style.borderColor = "rgba(181,148,74,.6)")
      }
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = "rgba(240,230,210,.18)")
      }
    />
  );
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: ".55rem 1.1rem",
        borderRadius: 4,
        border: selected
          ? "1px solid var(--color-gold-lit)"
          : "1px solid rgba(240,230,210,.2)",
        background: selected ? "rgba(181,148,74,.15)" : "transparent",
        color: selected ? "var(--color-gold-lit)" : "rgba(240,230,210,.7)",
        font: "500 12px var(--font-ui)",
        letterSpacing: ".08em",
        cursor: "pointer",
        transition: "all .2s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

/* ─── step content ───────────────────────────────────────── */
function StepInspiration({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <FieldLabel>What&apos;s this piece for?</FieldLabel>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: ".5rem",
          }}
        >
          {OCCASIONS.map((occ) => (
            <Chip
              key={occ}
              label={occ}
              selected={form.occasion === occ}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  occasion: f.occasion === occ ? "" : occ,
                }))
              }
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Describe your vision</FieldLabel>
        <textarea
          placeholder="A solitaire ring in white gold… a necklace similar to the one my grandmother wore… or paste a Pinterest link."
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={4}
          style={{
            width: "100%",
            background: "rgba(240,230,210,.06)",
            border: "1px solid rgba(240,230,210,.18)",
            borderRadius: 4,
            padding: ".75rem 1rem",
            color: "var(--color-silk)",
            font: "400 15px var(--font-ui)",
            outline: "none",
            resize: "vertical",
            transition: "border-color .2s",
            boxSizing: "border-box",
            lineHeight: 1.6,
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "rgba(181,148,74,.6)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(240,230,210,.18)")
          }
        />
      </div>

      <div>
        <FieldLabel>Reference image URL (optional)</FieldLabel>
        <TextInput
          placeholder="https://pinterest.com/pin/… or any image link"
          value={form.imageUrl}
          onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))}
        />
      </div>
    </div>
  );
}

function StepBudget({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p
        style={{
          font: "400 15px var(--font-ui)",
          color: "rgba(240,230,210,.65)",
          lineHeight: 1.7,
          marginBottom: ".25rem",
        }}
      >
        Every budget makes something beautiful. We&apos;ll suggest the best
        metals and stones within your range — no pressure, full transparency.
      </p>
      <div
        style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}
      >
        {BUDGETS.map((b) => (
          <button
            key={b.value}
            type="button"
            onClick={() =>
              setForm((f) => ({ ...f, budgetRange: b.value }))
            }
            style={{
              width: "100%",
              textAlign: "left",
              padding: ".9rem 1.25rem",
              borderRadius: 5,
              border:
                form.budgetRange === b.value
                  ? "1px solid var(--color-gold-lit)"
                  : "1px solid rgba(240,230,210,.15)",
              background:
                form.budgetRange === b.value
                  ? "rgba(181,148,74,.12)"
                  : "rgba(240,230,210,.03)",
              color:
                form.budgetRange === b.value
                  ? "var(--color-gold-lit)"
                  : "rgba(240,230,210,.8)",
              font: "500 14px var(--font-ui)",
              letterSpacing: ".04em",
              cursor: "pointer",
              transition: "all .2s",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {b.label}
            {form.budgetRange === b.value && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepDetails({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <FieldLabel>Your name *</FieldLabel>
        <TextInput
          placeholder="Full name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
      </div>
      <div>
        <FieldLabel>WhatsApp number *</FieldLabel>
        <TextInput
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          type="tel"
          required
        />
      </div>
      <div>
        <FieldLabel>Email (optional)</FieldLabel>
        <TextInput
          placeholder="hello@you.com"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          type="email"
        />
      </div>
      <div>
        <FieldLabel>City (optional)</FieldLabel>
        <TextInput
          placeholder="Mumbai, Delhi, Jaipur…"
          value={form.city}
          onChange={(v) => setForm((f) => ({ ...f, city: v }))}
        />
      </div>
    </div>
  );
}

function StepDone({ form }: { form: FormState }) {
  const budgetLabel =
    BUDGETS.find((b) => b.value === form.budgetRange)?.label ?? form.budgetRange;

  const waMessage = encodeURIComponent(
    `Hi, I just submitted a commission request on amibyarham.com.\n\nName: ${form.name}\nOccasion: ${form.occasion || "Not specified"}\nBudget: ${budgetLabel}\n\n${form.description}`.trim()
  );
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "1.5rem",
        paddingTop: "1rem",
      }}
    >
      {/* check circle */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "2px solid var(--color-gold-lit)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-gold-lit)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>

      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.5rem,3vw,2rem)",
            color: "var(--color-silk)",
            marginBottom: ".5rem",
          }}
        >
          Your piece is on its way.
        </h3>
        <p
          style={{
            font: "400 14px var(--font-ui)",
            color: "rgba(240,230,210,.6)",
            lineHeight: 1.7,
            maxWidth: "38ch",
            margin: "0 auto",
          }}
        >
          We&apos;ll review your vision and reach out within{" "}
          <strong style={{ color: "rgba(240,230,210,.85)" }}>24 hours</strong>{" "}
          with a mockup and a clear price.
        </p>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: ".5rem",
          padding: ".8rem 1.6rem",
          borderRadius: 4,
          background: "#25D366",
          color: "#fff",
          font: "600 12px var(--font-ui)",
          textTransform: "uppercase",
          letterSpacing: ".12em",
          textDecoration: "none",
          transition: "opacity .2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = ".85")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "1")
        }
      >
        {/* WhatsApp icon */}
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Continue on WhatsApp
      </a>

      <p
        style={{
          font: "400 12px var(--font-ui)",
          color: "rgba(240,230,210,.35)",
          letterSpacing: ".04em",
        }}
      >
        Or we&apos;ll write to you at{" "}
        {form.email || "the phone number you shared"}.
      </p>
    </div>
  );
}

/* ─── main modal ─────────────────────────────────────────── */
export default function CommissionModal() {
  const { open, closeModal } = useModal();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    occasion: "",
    occasionNote: "",
    description: "",
    imageUrl: "",
    budgetRange: "",
    name: "",
    phone: "",
    email: "",
    city: "",
  });

  /* reset on close */
  useEffect(() => {
    if (!open) {
      setStep(1);
      setDirection(1);
      setError("");
      setSubmitting(false);
      setForm({
        occasion: "",
        occasionNote: "",
        description: "",
        imageUrl: "",
        budgetRange: "",
        name: "",
        phone: "",
        email: "",
        city: "",
      });
    }
  }, [open]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* escape key */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeModal]);

  /* ── step validation ── */
  function canAdvance() {
    if (step === 1) return form.occasion !== "" || form.description.trim() !== "";
    if (step === 2) return form.budgetRange !== "";
    if (step === 3) return form.name.trim() !== "" && form.phone.trim() !== "";
    return true;
  }

  function advance() {
    if (!canAdvance()) return;
    if (step === 3) { void handleSubmit(); return; }
    setDirection(1);
    setStep((s) => s + 1);
  }

  function back() {
    if (step === 1) return;
    setDirection(-1);
    setStep((s) => s - 1);
  }

  /* ── submit ── */
  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const budgetLabel =
        BUDGETS.find((b) => b.value === form.budgetRange)?.label ??
        form.budgetRange;

      /* Supabase insert */
      const { error: dbError } = await supabase.from("commission_leads").insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        city: form.city.trim() || null,
        occasion: form.occasion || "Not specified",
        occasion_note: form.description.trim() || null,
        budget_range: form.budgetRange,
        image_url: form.imageUrl.trim() || null,
        status: "new",
      });

      if (dbError) console.error("Supabase insert error:", dbError);

      /* EmailJS notification */
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || "—",
          city: form.city.trim() || "—",
          occasion: form.occasion || "Not specified",
          description: form.description.trim() || "—",
          budget: budgetLabel,
          image_url: form.imageUrl.trim() || "—",
        },
        EMAILJS_CONFIG.publicKey
      );

      setDirection(1);
      setStep(4);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again or WhatsApp us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── step titles ── */
  const stepTitles: Record<number, string> = {
    1: "Tell us your vision",
    2: "Your budget",
    3: "How to reach you",
    4: "",
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Commission your piece"
      onClick={(e) => {
        if (e.target === overlayRef.current) closeModal();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(10,6,4,.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 540,
          maxHeight: "92dvh",
          background: "var(--color-oxblood)",
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* arch overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='72' height='100' viewBox='0 0 72 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 100 L12 52 Q12 42 22 38 Q30 34 36 18 Q42 34 50 38 Q60 42 60 52 L60 100' fill='none' stroke='%23B5944A' stroke-width='0.9'/%3E%3C/svg%3E")`,
            backgroundSize: "72px 100px",
            opacity: 0.05,
            zIndex: 0,
          }}
        />

        {/* header */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "1.5rem 1.75rem 0",
            flexShrink: 0,
          }}
        >
          {/* progress bar */}
          {step < 4 && (
            <div
              style={{
                height: 2,
                background: "rgba(240,230,210,.1)",
                borderRadius: 1,
                marginBottom: "1.5rem",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background: "var(--color-gold-lit)",
                  borderRadius: 1,
                }}
                animate={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              {step < 4 && (
                <span
                  style={{
                    display: "block",
                    font: "500 10px var(--font-ui)",
                    textTransform: "uppercase",
                    letterSpacing: ".28em",
                    color: "rgba(181,148,74,.6)",
                    marginBottom: 6,
                  }}
                >
                  Step {step} of {TOTAL_STEPS - 1}
                </span>
              )}
              {stepTitles[step] && (
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(1.35rem,3vw,1.7rem)",
                    color: "var(--color-silk)",
                    lineHeight: 1.2,
                  }}
                >
                  {stepTitles[step]}
                </h2>
              )}
            </div>

            <button
              onClick={closeModal}
              aria-label="Close"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "rgba(240,230,210,.45)",
                padding: 4,
                lineHeight: 0,
                transition: "color .2s",
                flexShrink: 0,
                marginLeft: "1rem",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(240,230,210,.9)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(240,230,210,.45)")
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* step content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem 1.75rem",
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 1 && (
                <StepInspiration form={form} setForm={setForm} />
              )}
              {step === 2 && (
                <StepBudget form={form} setForm={setForm} />
              )}
              {step === 3 && (
                <StepDetails form={form} setForm={setForm} />
              )}
              {step === 4 && <StepDone form={form} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer */}
        {step < 4 && (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "1rem 1.75rem 1.5rem",
              borderTop: "1px solid rgba(240,230,210,.08)",
              flexShrink: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* error */}
            {error && (
              <p
                style={{
                  font: "400 12px var(--font-ui)",
                  color: "#e57373",
                  flex: 1,
                }}
              >
                {error}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: ".75rem",
                marginLeft: "auto",
              }}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  style={{
                    font: "500 11px var(--font-ui)",
                    textTransform: "uppercase",
                    letterSpacing: ".14em",
                    color: "rgba(240,230,210,.55)",
                    background: "transparent",
                    border: "1px solid rgba(240,230,210,.18)",
                    padding: ".65rem 1.2rem",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(240,230,210,.9)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(240,230,210,.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(240,230,210,.55)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(240,230,210,.18)";
                  }}
                >
                  Back
                </button>
              )}

              <button
                type="button"
                onClick={advance}
                disabled={!canAdvance() || submitting}
                style={{
                  font: "500 11px var(--font-ui)",
                  textTransform: "uppercase",
                  letterSpacing: ".14em",
                  color: "var(--color-kohl)",
                  background: canAdvance()
                    ? "var(--color-gold-lit)"
                    : "rgba(181,148,74,.3)",
                  border: "none",
                  padding: ".65rem 1.4rem",
                  borderRadius: 4,
                  cursor: canAdvance() && !submitting ? "pointer" : "default",
                  transition: "background .2s, transform .2s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".4rem",
                }}
                onMouseEnter={(e) => {
                  if (canAdvance() && !submitting)
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    canAdvance() ? "var(--color-gold-lit)" : "rgba(181,148,74,.3)";
                }}
              >
                {submitting ? (
                  "Sending…"
                ) : step === 3 ? (
                  "Send request"
                ) : (
                  <>
                    Next
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
