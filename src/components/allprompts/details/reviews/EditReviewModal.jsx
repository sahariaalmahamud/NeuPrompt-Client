"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Xmark, Star, Check } from "@gravity-ui/icons";

const editReviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating.").max(5),
  comment: z
    .string()
    .min(20, "Review must be at least 20 characters.")
    .max(500, "Review cannot exceed 500 characters."),
});

export default function EditReviewModal({
  isOpen,
  onOpenChange,
  review,
  onReviewUpdated,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const overlayRef = useRef(null);

  useEffect(() => setIsMounted(true), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editReviewSchema),
    defaultValues: {
      rating: review?.rating || 0,
      comment: review?.comment || review?.review || "",
    },
  });

  const currentRating = watch("rating");
  const commentLength = watch("comment")?.length ?? 0;

  // Reset form to initial review values when modal opens
  useEffect(() => {
    if (isOpen && review) {
      reset({
        rating: review.rating,
        comment: review.comment || review.review || "",
      });
      setSubmitted(false);
    }
  }, [isOpen, review, reset]);

  // Accessibility & Body Lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onOpenChange(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onOpenChange]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: data.rating,
          comment: data.comment,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to update review");

      // Optimistic UI Update
      onReviewUpdated?.({
        ...review,
        rating: data.rating,
        comment: data.comment,
        updatedAt: new Date().toISOString(),
      });

      setSubmitted(true);
      setTimeout(() => onOpenChange(false), 1500);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onOpenChange(false); }}
        >
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="relative w-full sm:max-w-md bg-[#0a0a0c] border-t sm:border border-white/[0.08] sm:rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex flex-col max-h-[92dvh] sm:max-h-[80vh]"
          >
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent shrink-0" />

            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-14 px-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Check className="size-6 text-emerald-400" />
                </motion.div>
                <div>
                  <p className="text-white font-semibold">Review updated!</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
                  <h2 className="text-base font-semibold text-white">Edit Review</h2>
                  <button type="button" onClick={() => onOpenChange(false)} className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors outline-none focus:ring-1 focus:ring-white/20">
                    <Xmark className="size-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
                  {/* Star Rating Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-400">Rating <span className="text-blue-500">*</span></label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star} type="button"
                          onClick={() => setValue("rating", star, { shouldValidate: true })}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="p-0.5 transition-transform hover:scale-110 outline-none"
                        >
                          <Star className={`size-7 transition-colors ${star <= (hoveredStar || currentRating) ? "text-amber-400" : "text-white/10"}`} />
                        </button>
                      ))}
                    </div>
                    {errors.rating && <p className="text-[11px] text-red-400">{errors.rating.message}</p>}
                  </div>

                  {/* Comment Textarea */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400">Your review <span className="text-blue-500">*</span></label>
                    <textarea
                      rows={5}
                      {...register("comment")}
                      className={`w-full px-3.5 py-2.5 bg-[#060608] border rounded-xl text-sm text-white placeholder:text-zinc-600 outline-none resize-none transition-all ${errors.comment ? "border-red-500/40" : "border-white/[0.08] hover:border-white/15 focus:border-blue-500/50"}`}
                    />
                    <div className="flex items-center justify-between px-0.5 mt-1">
                      {errors.comment ? <p className="text-[11px] text-red-400">{errors.comment.message}</p> : <span />}
                      <span className={`text-[11px] tabular-nums ${commentLength > 500 ? "text-red-400" : "text-zinc-600"}`}>
                        {commentLength} / 500
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-white/5 bg-[#060608] flex items-center justify-end gap-3 shrink-0">
                  <button type="button" onClick={() => onOpenChange(false)} className="h-9 px-4 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="h-9 px-5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(37,99,235,0.25)] flex items-center gap-2 disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "Save Changes"}
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