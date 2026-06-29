"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "@gravity-ui/icons";
import { ChevronDown } from "@gravity-ui/icons";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";

// ─── ReviewsSection ───────────────────────────────────────────────────────────
// LAYOUT CHANGE: This component is now rendered inside the RIGHT sidebar column,
//   not at the bottom of the left content column. It uses a compact sidebar
//   layout rather than the previous full-width layout.
//
// FIX: Replaced broken HeroUI Select compound API
//   (Select.Trigger / Select.Value / Select.Indicator / Select.Popover +
//   ListBox / ListBox.Item) with a native <select>.
//   The original code had the same react-aria-X key bug as ReportModal.
//
// ANIMATION: Each ReviewCard uses whileInView — they animate in one-by-one
//   as the user scrolls down the right sidebar ("notification" effect).
//
// NOTE: Sorting is UI-only for now.
//   BACKEND INTEGRATION: When ready, pass `sortOrder` to the reviews API:
//   GET /api/reviews?promptId=${promptId}&sort=${sortOrder}
// ─────────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "newest",  label: "Newest first"    },
  { value: "oldest",  label: "Oldest first"    },
  { value: "highest", label: "Highest rating"  },
  { value: "lowest",  label: "Lowest rating"   },
];

export default function ReviewsSection({ promptId, user, reviews = [], stats }) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const displayRating = stats?.rating ? stats.rating.toFixed(1) : "0.0";
  const totalRatings  = stats?.total  ?? 0;
  const ratingRounded = Math.round(stats?.rating ?? 0);

  const handleWriteReview = () => {
    if (!user?.id) {
      alert("Please sign in to leave a review.");
      return;
    }
    setIsReviewModalOpen(true);
  };

  // BACKEND INTEGRATION (sort):
  //   Replace this with a server fetch when backend sorting is ready:
  //   const sortedReviews = await getReviews(promptId, { sort: sortOrder });
  //   For now, client-sort the already-fetched reviews as a placeholder:
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === "newest")  return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "oldest")  return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOrder === "highest") return b.rating - a.rating;
    if (sortOrder === "lowest")  return a.rating - b.rating;
    return 0;
  });

  return (
    <section aria-labelledby="reviews-heading" className="flex flex-col gap-4">

      {/* Section heading */}
      <div className="flex items-center justify-between gap-3">
        <h2
          id="reviews-heading"
          className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono"
        >
          Community Reviews
        </h2>
        <span className="text-[10px] text-zinc-600 tabular-nums">{totalRatings} review{totalRatings !== 1 ? "s" : ""}</span>
      </div>

      {/* Compact rating summary + write review */}
      <div className="bg-[#0d0d16] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
        {/* Score */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-3xl font-bold text-white leading-none">{displayRating}</span>
          <div className="flex items-center gap-0.5 mt-1.5" aria-label={`Average rating: ${displayRating} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${i < ratingRounded ? "text-amber-400" : "text-white/10"}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-white/[0.06] shrink-0" aria-hidden="true" />

        {/* Write review */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-400 leading-snug mb-2">Based on {totalRatings} review{totalRatings !== 1 ? "s" : ""}</p>
          <button
            type="button"
            onClick={handleWriteReview}
            aria-label="Write a review for this prompt"
            className="w-full h-8 bg-blue-600 hover:bg-blue-500 active:bg-blue-700
              text-white text-xs font-semibold rounded-lg transition-colors
              shadow-[0_4px_10px_rgba(37,99,235,0.25)]
              outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            Write review
          </button>
        </div>
      </div>

      {/* Sort select */}
      {reviews.length > 1 && (
        <div className="relative">
          <select
            id="reviews-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Sort reviews"
            className="w-full appearance-none h-9 pl-3 pr-8 bg-[#0d0d16] border border-white/[0.06]
              rounded-xl text-xs text-zinc-300 outline-none cursor-pointer transition-all duration-200
              hover:border-white/15 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/40"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0d0d10] text-zinc-200">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-zinc-500"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Review cards — each animates in on scroll (whileInView in ReviewCard) */}
      <div className="flex flex-col gap-3">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, index) => (
            <ReviewCard key={review._id} review={review} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center"
          >
            <p className="text-sm text-zinc-500">No reviews yet.</p>
            <p className="text-xs text-zinc-600 mt-1">Be the first to share your thoughts!</p>
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        promptId={promptId}
        user={user}
      />
    </section>
  );
}