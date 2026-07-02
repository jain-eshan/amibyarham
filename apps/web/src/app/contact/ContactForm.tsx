"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const inputClass =
  "h-11 w-full rounded-md border border-hairline bg-canvas px-4 text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const textareaClass =
  "w-full rounded-md border border-hairline bg-canvas px-4 py-3 text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 rounded-md bg-surface-card p-6">
        <p className="text-primary">
          <span aria-hidden="true">✦ </span>
          Your message has been received. We&rsquo;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      {status === "error" && (
        <p className="rounded-md bg-surface-card p-4 text-sm text-ink">
          Something went wrong. Please try again or email us directly at{" "}
          <a
            href="mailto:amibyarham@gmail.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            amibyarham@gmail.com
          </a>
          .
        </p>
      )}

      <div>
        <label
          htmlFor="contact-name"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          placeholder="Your name"
          className={inputClass}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-primary">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="Your email address"
          className={inputClass}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-primary">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell us what you have in mind..."
          className={textareaClass}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-primary">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
