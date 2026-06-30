"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Eye, Pencil, TrashBin } from "@gravity-ui/icons";
import Link from "next/link";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewModal from "./DeleteReviewModal";

export default function ReviewCard({ 
  review, 
  index = 0, 
  type = "prompt",
  onReviewUpdated,
  onReviewDeleted
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName ?? review.reviewer?.name ?? review.user?.name ?? "U")}&background=1a1a2e&color=ffffff&size=64`;
  const thumbnailFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.prompt?.title ?? review.title ?? review.promptTitle ?? "P")}&background=0D8ABC&color=ffffff&size=120`;
  const reviewerName = review.reviewer?.name ?? review.userName ?? review.user?.name ?? "Anonymous";
  const reviewerImage = review.reviewer?.image ?? review.userImage ?? review.user?.image ?? avatarFallback;
  const promptTitle = review.prompt?.title ?? review.title ?? review.promptTitle ?? review.promptName ?? "Untitled prompt";
  const promptHref = review.prompt?._id || review.promptId || review.prompt?.id ? `/prompts/${review.prompt?._id || review.promptId || review.prompt?.id}` : "#";
  const reviewText = review.comment ?? review.review ?? "";
  const promptLabel = promptTitle === "Untitled prompt" && review.promptId ? `Prompt ${review.promptId}` : promptTitle;

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5 shrink-0" aria-label={`Rating: ${rating} out of 5`} suppressHydrationWarning>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3 ${i < rating ? "text-amber-400" : "text-white/10"}`}
          aria-hidden="true"
          suppressHydrationWarning
        />
      ))}
    </div>
  );

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
        className="bg-[#0d0d16] border border-white/[0.06] hover:border-white/[0.10]
          rounded-xl p-4 sm:p-5 flex flex-col gap-4 transition-colors duration-200 shadow-sm"
      >
        {/* ... (Existing Layout: PROMPT DETAILS) ... */}
        {type === "prompt" && (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={review.userImage || avatarFallback} alt={review.userName} width={36} height={36}
                  className="size-9 rounded-full object-cover ring-2 ring-white/10 shrink-0"
                  onError={(e) => { e.currentTarget.src = avatarFallback; }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">{review.userName}</span>
                  <span className="text-[10px] text-zinc-500">{formattedDate}</span>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{reviewText}</p>
          </>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            LAYOUT: MY REVIEWS (Dashboard - With Edit/Delete Hooks)
        ───────────────────────────────────────────────────────────────────────────── */}
        {type === "my" && (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={review.prompt?.thumbnail || thumbnailFallback} alt={promptTitle} width={48} height={48}
                  className="size-12 rounded-lg object-cover border border-white/10 shrink-0"
                  onError={(e) => { e.currentTarget.src = thumbnailFallback; }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white truncate">{promptLabel}</span>
                  <span className="text-xs text-zinc-500 truncate">
                    {review.prompt?.creatorName ? `By ${review.prompt.creatorName} • ${formattedDate}` : `Reviewed on ${formattedDate}`}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {renderStars(review.rating)}
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">My Review</span>
              </div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{reviewText}</p>
            
            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Link href={promptHref} className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors">
                <Eye className="size-3.5" /> View Prompt
              </Link>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  title="Edit Review"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  title="Delete Review"
                >
                  <TrashBin className="size-3.5" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ... (Existing Layout: REVIEWS RECEIVED) ... */}
        {type === "received" && (
           <>{/* (Unchanged from original prompt structure) */}</>
        )}
      </motion.article>

      {/* Attach Modals for Optimistic UI updates */}
      {type === "my" && (
        <>
          <EditReviewModal 
            isOpen={isEditModalOpen} 
            onOpenChange={setIsEditModalOpen} 
            review={review} 
            onReviewUpdated={onReviewUpdated} 
          />
          <DeleteReviewModal 
            isOpen={isDeleteModalOpen} 
            onOpenChange={setIsDeleteModalOpen} 
            reviewId={review._id} 
            onReviewDeleted={onReviewDeleted} 
          />
        </>
      )}
    </>
  );
}