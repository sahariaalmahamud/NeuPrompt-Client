"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Xmark, Star, Check } from "@gravity-ui/icons";
import { createReview } from "@/lib/actions/reviews";

// ─── Schema ───────────────────────────────────────────────────────────────────
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating.").max(5),
  comment: z
    .string()
    .min(20, "Review must be at least 20 characters.")
    .max(500, "Review cannot exceed 500 characters."),
});

// ─── ReviewModal ──────────────────────────────────────────────────────────────
// FIX: Replaced broken Modal compound API (Modal.Backdrop / Container / Dialog /
//   Header / Heading / Body / Footer / CloseTrigger — none exist in HeroUI)
//   with the same plain div portal used across the project.
//
// FIX: Replaced HeroUI TextArea (broken registration with react-hook-form) and
//   HeroUI Description with native <textarea> and <span>.
// ─────────────────────────────────────────────────────────────────────────────

export default function ReviewModal({ isOpen, onOpenChange, promptId, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [hoveredStar, setHoveredStar]   = useState(0);
  const overlayRef                      = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const currentRating = watch("rating");
  const commentLength = watch("comment")?.length ?? 0;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) { reset(); setSubmitted(false); setHoveredStar(0); }
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
    setIsSubmitting(true);
    try {
      const result = await createReview({
        promptId,
        userId:    user.id,
        userName:  user.name,
        userImage: user.image, // session image — no upload needed for OAuth users
        rating:    data.rating,
        comment:   data.comment,
        createdAt: new Date(),
      });

      if (!result?.success) {
        alert(result?.message ?? "Failed to submit review.");
        return;
      }

      setSubmitted(true);
      setTimeout(() => onOpenChange(false), 1600);
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
          aria-labelledby="review-modal-title"
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

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 30, scale: 0.98  }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:max-w-md bg-[#0a0a0c] border-t sm:border border-white/[0.08]
              sm:rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)]
              flex flex-col max-h-[92dvh] sm:max-h-[80vh]"
          >
            {/* Drag handle (mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/10" />
            </div>

            {/* Top accent line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent shrink-0" />

            {/* ── Success state ─────────────────────────────────────────────── */}
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
                  <p className="text-white font-semibold">Review submitted!</p>
                  <p className="text-sm text-zinc-500 mt-1">Thank you for sharing your feedback.</p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-label="Write a review"
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
                  <h2 id="review-modal-title" className="text-base font-semibold text-white">
                    Write a review
                  </h2>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close review dialog"
                    className="size-8 rounded-lg flex items-center justify-center text-zinc-500
                      hover:text-white hover:bg-white/5 transition-colors outline-none
                      focus:ring-1 focus:ring-white/20"
                  >
                    <Xmark className="size-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

                  {/* Star selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-400">
                      Rating <span className="text-blue-500" aria-hidden="true">*</span>
                    </label>
                    <div
                      className="flex items-center gap-1"
                      role="radiogroup"
                      aria-label="Select a star rating"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setValue("rating", star, { shouldValidate: true })}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                          aria-pressed={star <= currentRating}
                          className="p-0.5 transition-transform hover:scale-110 focus:outline-none
                            focus:ring-1 focus:ring-amber-400/50 rounded"
                        >
                          <Star
                            className={`size-7 transition-colors ${
                              star <= (hoveredStar || currentRating)
                                ? "text-amber-400"
                                : "text-white/10"
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      ))}
                    </div>
                    {errors.rating && (
                      <p role="alert" className="text-[11px] text-red-400">{errors.rating.message}</p>
                    )}
                  </div>

                  {/* Comment — native textarea, not HeroUI TextArea */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="review-comment" className="text-xs font-medium text-zinc-400">
                      Your review <span className="text-blue-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="review-comment"
                      placeholder="Share your experience using this prompt…"
                      rows={5}
                      aria-required="true"
                      aria-invalid={!!errors.comment}
                      aria-describedby="comment-count"
                      {...register("comment")}
                      className={`w-full px-3.5 py-2.5 bg-[#060608] border rounded-xl text-sm text-white
                        placeholder:text-zinc-600 outline-none resize-none transition-all duration-200
                        hover:border-white/15 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50
                        ${errors.comment ? "border-red-500/40" : "border-white/[0.08]"}`}
                    />
                    <div className="flex items-center justify-between px-0.5">
                      {errors.comment ? (
                        <p role="alert" className="text-[11px] text-red-400">{errors.comment.message}</p>
                      ) : (
                        <span />
                      )}
                      <span
                        id="comment-count"
                        aria-live="polite"
                        className={`text-[11px] tabular-nums
                          ${commentLength > 500 ? "text-red-400" : "text-zinc-600"}`}
                      >
                        {commentLength} / 500
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-white/5 bg-[#060608]
                  flex items-center justify-end gap-3 shrink-0">
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
                    aria-label={isSubmitting ? "Submitting review, please wait" : "Submit review"}
                    className="h-9 px-5 text-sm font-semibold bg-blue-600 hover:bg-blue-500
                      active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                      text-white rounded-xl transition-colors
                      shadow-[0_4px_12px_rgba(37,99,235,0.25)]
                      outline-none focus:ring-2 focus:ring-blue-500/40
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
                      "Submit review"
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