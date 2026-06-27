"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Xmark, ShieldExclamation, Check } from "@gravity-ui/icons";
import { createReport } from "@/lib/actions/reports";

// ─── Validation schema ────────────────────────────────────────────────────────
const reportSchema = z.object({
  reason: z.string().min(1, "Please select a reason."),
  description: z
    .string()
    .min(20, "Please provide more details (min 20 characters).")
    .max(500, "Description cannot exceed 500 characters."),
});

const REPORT_REASONS = [
  "Spam",
  "Copyright Violation",
  "Harmful Content",
  "NSFW Content",
  "Misleading Information",
  "Low Quality",
  "Other",
];


export default function ReportModal({ isOpen, onOpenChange, promptId, creatorId, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const overlayRef                      = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: { reason: "", description: "" },
  });

  const descriptionLength = watch("description")?.length ?? 0;
  const reasonValue       = watch("reason");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSubmitted(false);
    }
  }, [isOpen, reset]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onOpenChange(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onOpenChange]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const onSubmit = async (data) => {
    if (!user?.id) {
      alert("Please sign in to report a prompt.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReport({
        promptId,
        reporterId:  user.id,
        creatorId,
        reason:      data.reason,      // ← plain string value, no React Aria key
        description: data.description,
      });

      if (result?.success === false) {
        alert(result.message ?? "Failed to submit report.");
        return;
      }

      setSubmitted(true);
      // Auto-close after showing success state
      setTimeout(() => onOpenChange(false), 1800);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          aria-describedby="report-modal-desc"
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onOpenChange(false); }}
        >
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel — bottom sheet on mobile, centred card on sm+ */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 40, scale: 0.97  }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:max-w-md bg-[#0a0a0c] border-t sm:border border-red-500/15
              sm:rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(239,68,68,0.08)]
              flex flex-col max-h-[92dvh] sm:max-h-[85vh]"
          >
            {/* Drag handle (mobile only) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/10" />
            </div>

            {/* Top accent line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent shrink-0" />

            {/* ── Submitted success state ────────────────────────────────── */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-14 px-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20
                    flex items-center justify-center"
                >
                  <Check className="size-6 text-emerald-400" aria-hidden="true" />
                </motion.div>
                <div>
                  <p className="text-white font-semibold">Report submitted</p>
                  <p className="text-sm text-zinc-500 mt-1">Our team will review it shortly.</p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-label="Report prompt form"
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between px-5 py-4 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-red-500/10 border border-red-500/20
                      flex items-center justify-center shrink-0">
                      <ShieldExclamation className="size-4 text-red-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h2
                        id="report-modal-title"
                        className="text-base font-semibold text-white"
                      >
                        Report prompt
                      </h2>
                      <p
                        id="report-modal-desc"
                        className="text-xs text-zinc-500 mt-0.5"
                      >
                        Help us keep the marketplace safe.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close report dialog"
                    className="size-8 rounded-lg flex items-center justify-center text-zinc-500
                      hover:text-white hover:bg-white/5 transition-colors outline-none
                      focus:ring-1 focus:ring-white/20 shrink-0"
                  >
                    <Xmark className="size-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

                  {/* ── Reason — native <select>, value is the actual string ── */}
                  {/*
                    FIX: The original HeroUI Select + ListBox.Item compound API
                    was setting key="Spam" etc. on ListBox.Item, but
                    onSelectionChange returned React Aria's internal key
                    ("react-aria-1", "react-aria-2" ...) instead of the value.
                    A native <select> returns the option's value string directly.
                  */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="report-reason"
                      className="text-xs font-medium text-zinc-400 select-none"
                    >
                      Reason <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="report-reason"
                        aria-required="true"
                        aria-invalid={!!errors.reason}
                        aria-describedby={errors.reason ? "reason-error" : undefined}
                        {...register("reason")}
                        className={`w-full appearance-none h-11 px-3.5 pr-9 bg-[#060608] border rounded-xl
                          text-sm outline-none cursor-pointer transition-all duration-200
                          hover:border-white/15 focus:ring-1 focus:ring-red-500/40 focus:border-red-500/40
                          ${errors.reason ? "border-red-500/40" : "border-white/[0.08]"}
                          ${reasonValue ? "text-zinc-200" : "text-zinc-500"}`}
                      >
                        <option value="" disabled>Select a reason…</option>
                        {REPORT_REASONS.map((reason) => (
                          <option key={reason} value={reason} className="bg-[#0d0d10] text-zinc-200">
                            {reason}
                          </option>
                        ))}
                      </select>
                      {/* Custom chevron */}
                      <svg
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500"
                        viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {errors.reason && (
                      <p id="reason-error" role="alert" className="text-[11px] text-red-400 flex items-center gap-1">
                        <span className="inline-block size-1 rounded-full bg-red-400 shrink-0" aria-hidden="true" />
                        {errors.reason.message}
                      </p>
                    )}
                  </div>

                  {/* ── Description — native <textarea> ───────────────────── */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="report-description"
                      className="text-xs font-medium text-zinc-400 select-none"
                    >
                      Details <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="report-description"
                      aria-required="true"
                      aria-invalid={!!errors.description}
                      aria-describedby="description-count report-desc-error"
                      placeholder="Describe specifically why you are reporting this prompt…"
                      rows={4}
                      {...register("description")}
                      className={`w-full px-3.5 py-2.5 bg-[#060608] border rounded-xl text-sm text-white
                        placeholder:text-zinc-600 outline-none resize-none transition-all duration-200
                        hover:border-white/15 focus:ring-1 focus:ring-red-500/40 focus:border-red-500/40
                        ${errors.description ? "border-red-500/40" : "border-white/[0.08]"}`}
                    />
                    <div className="flex items-center justify-between px-0.5">
                      {errors.description ? (
                        <p id="report-desc-error" role="alert" className="text-[11px] text-red-400 flex items-center gap-1">
                          <span className="inline-block size-1 rounded-full bg-red-400 shrink-0" aria-hidden="true" />
                          {errors.description.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span
                        id="description-count"
                        aria-live="polite"
                        className={`text-[11px] tabular-nums
                          ${descriptionLength > 500 ? "text-red-400" : "text-zinc-600"}`}
                      >
                        {descriptionLength} / 500
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-white/5 bg-[#060608] flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="h-9 px-4 text-sm font-medium text-zinc-400 hover:text-white
                      transition-colors rounded-lg outline-none focus:ring-1 focus:ring-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? "Submitting report, please wait" : "Submit report"}
                    className="h-9 px-5 text-sm font-semibold bg-red-600 hover:bg-red-500
                      active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
                      text-white rounded-xl transition-colors
                      shadow-[0_4px_12px_rgba(239,68,68,0.25)]
                      outline-none focus:ring-2 focus:ring-red-500/40
                      flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Submitting…
                      </>
                    ) : (
                      <>
                        <ShieldExclamation className="size-3.5" aria-hidden="true" />
                        Submit report
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}