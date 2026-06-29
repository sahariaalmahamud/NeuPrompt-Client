"use client";

import { motion } from "framer-motion";
import { Star } from "@gravity-ui/icons";

// ─── ReviewCard ───────────────────────────────────────────────────────────────
// FIX: Replaced next/image with plain <img> + onError fallback.
//   next/image requires every external domain to be listed in next.config.js
//   (ibb.co, ui-avatars.com, etc.). Using <img> avoids runtime errors when
//   a new image host is added without updating the config.
//
// ANIMATION: whileInView triggers the entrance as the card scrolls into the
//   viewport — this is the "notification one by one" scroll effect requested.
// ─────────────────────────────────────────────────────────────────────────────

export default function ReviewCard({ review, index = 0 }) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName ?? "U")}&background=1a1a2e&color=ffffff&size=64`;

  return (
    <motion.article
      // Scroll-triggered entrance — each card animates in as it enters the viewport.
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="bg-[#0d0d16] border border-white/[0.06] hover:border-white/[0.10]
        rounded-xl p-4 flex flex-col gap-3 transition-colors duration-200"
      aria-label={`Review by ${review.userName}`}
    >
      {/* Author row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Plain img — avoids next/image domain config requirement */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.userImage || fallbackSrc}
            alt={review.userName}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover ring-2 ring-white/10 shrink-0"
            onError={(e) => { e.currentTarget.src = fallbackSrc; }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">{review.userName}</span>
            <span className="text-[10px] text-zinc-500">{formattedDate}</span>
          </div>
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-0.5 shrink-0" aria-label={`Rating: ${review.rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3 ${i < review.rating ? "text-amber-400" : "text-white/10"}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-zinc-300 leading-relaxed">{review.comment}</p>
    </motion.article>
  );
}