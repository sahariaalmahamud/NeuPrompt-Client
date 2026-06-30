"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronDown } from "@gravity-ui/icons";


const SORT_OPTIONS = [
  { value: "newest",  label: "Newest first"    },
  { value: "oldest",  label: "Oldest first"    },
  { value: "highest", label: "Highest rating"  },
  { value: "lowest",  label: "Lowest rating"   },
];

export default function ReviewsSection({ promptId, user, reviews = [], stats, type = "prompt" }) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  
  // States specific to "prompt" view
  const [reviewList, setReviewList] = useState(reviews);
  const [averageRating, setAverageRating] = useState(stats?.rating ?? 0);
  const [totalRatings, setTotalRatings] = useState(stats?.total ?? reviews.length ?? 0);

  const displayRating = averageRating.toFixed(1);
  const ratingRounded = Math.round(averageRating);

  const handleWriteReview = () => {
    if (!user?.id) {
      alert("Please sign in to leave a review.");
      return;
    }
    setIsReviewModalOpen(true);
  };

  // Client-side sort for immediate feedback
  const sortedReviews = [...(type === "prompt" ? reviewList : reviews)].sort((a, b) => {
    if (sortOrder === "newest")  return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "oldest")  return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOrder === "highest") return b.rating - a.rating;
    if (sortOrder === "lowest")  return a.rating - b.rating;
    return 0;
  });

  const isPromptView = type === "prompt";

  return (
    <section aria-labelledby="reviews-heading" className="flex flex-col gap-4">

      {/* Conditionally render Community Reviews Header for Prompts */}
      {isPromptView && (
        <div className="flex items-center justify-between gap-3">
          <h2 id="reviews-heading" className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">
            Community Reviews
          </h2>
          <span className="text-[10px] text-zinc-600 tabular-nums">{totalRatings} review{totalRatings !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Conditionally render Rating Summary + Write Review Button */}
      {isPromptView && (
        <div className="bg-[#0d0d16] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 shadow-inner">
          <div className="flex flex-col items-center shrink-0">
            <span className="text-3xl font-bold text-white leading-none">{displayRating}</span>
            <div className="flex items-center gap-0.5 mt-1.5" suppressHydrationWarning>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`size-3 ${i < ratingRounded ? "text-amber-400" : "text-white/10"}`} aria-hidden="true" suppressHydrationWarning />
              ))}
            </div>
          </div>
          <div className="w-px h-10 bg-white/[0.06] shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-400 leading-snug mb-2">Based on {totalRatings} review{totalRatings !== 1 ? "s" : ""}</p>
            <button
              type="button"
              onClick={handleWriteReview}
              className="w-full h-8 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-[0_4px_10px_rgba(37,99,235,0.25)] outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Write review
            </button>
          </div>
        </div>
      )}

      {/* Sort Dropdown (Visible across all views if reviews exist) */}
      {reviews.length > 1 && (
        <div className="relative">
          <select
            id="reviews-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Sort reviews"
            className="w-full appearance-none h-10 pl-4 pr-8 bg-[#0d0d16] border border-white/[0.06] rounded-xl text-sm text-zinc-300 outline-none cursor-pointer transition-all duration-200 hover:border-white/15 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/40 shadow-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0d0d10] text-zinc-200">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" aria-hidden="true" />
        </div>
      )}

      {/* Review Cards List */}
      <div className="flex flex-col gap-3">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, index) => (
            <ReviewCard key={review._id} review={review} index={index} type={type} />
          ))
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center bg-[#0d0d16]/50 border border-white/5 rounded-xl border-dashed">
            <p className="text-sm font-medium text-zinc-400">No reviews found.</p>
            {isPromptView && <p className="text-xs text-zinc-500 mt-1">Be the first to share your thoughts!</p>}
          </motion.div>
        )}
      </div>

      {/* Review Modal (Only renders logic if in prompt view) */}
      {isPromptView && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
          promptId={promptId}
          user={user}
          onReviewCreated={(newReview) => {
            setReviewList((prev) => [newReview, ...prev]);
            const newTotal = totalRatings + 1;
            const newAverage = (averageRating * totalRatings + newReview.rating) / newTotal;
            setAverageRating(Number(newAverage.toFixed(1)));
            setTotalRatings(newTotal);
          }}
        />
      )}
    </section>
  );
}