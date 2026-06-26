"use client";

import { motion } from "framer-motion";
import { Avatar } from "@heroui/react";
import { Star } from "@gravity-ui/icons";
import Image from "next/image";

export default function ReviewCard({ review }) {

  console.log('review', review);

  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-[#0a0a0c]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3 transition-all hover:border-white/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={review.userImage}
            alt={review.userName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{review.userName}</span>
            <span className="text-[10px] text-zinc-500">{formattedDate}</span>
          </div>
        </div>

        {/* Star Rating Render */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating ? "text-amber-500" : "text-white/10"}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-zinc-300 leading-relaxed mt-1">
        {review.comment}
      </p>
    </motion.div>
  );
}