"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Copy, BookmarkFill, Sparkles } from "@gravity-ui/icons";

export const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function BookmarkCard({ bookmark, bookmarkId, onRemove }) {
  const { createdAt: bookmarkedAt } = bookmark;


  // Safe Fallbacks
  const displayRating = bookmark.rating ? bookmark.rating.toFixed(1) : "0.0";
  const copies = bookmark.copyCount || 0;

  // Format Date (e.g., Jun 25, 2026)
  const formattedDate = new Date(bookmarkedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] hover:border-white/20 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-colors h-full"
    >
      {/* 🖼️ Thumbnail Area */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#030303]">
        <img
          src={bookmark.thumbnail}
          alt={bookmark.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          {bookmark.featured && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-lg">
              <Sparkles size={12} /> Featured
            </span>
          )}
          <span className="px-2.5 py-1 bg-[#0a0a0c]/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-md">
            {bookmark.difficulty}
          </span>
        </div>
      </div>

      {/* 📝 Card Body */}
      <div className="p-5 flex flex-col flex-1">

        {/* Category & AI Tool */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest font-mono">
            {bookmark.category}
          </span>
          <span className="text-[10px] text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5 font-mono uppercase tracking-wider">
            {bookmark.aiTool}
          </span>
        </div>

        {/* Title & Desc */}
        <h3 className="text-lg font-bold text-white leading-snug mb-2 line-clamp-2">
          {bookmark.title}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
          {bookmark.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-col gap-3 mt-auto">

          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>By <span className="text-zinc-300 font-medium">{bookmark.creatorName}</span></span>
          </div>

          <div className="flex items-center justify-between bg-[#030303] border border-white/5 px-3 py-2 rounded-xl shadow-inner">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-zinc-400" title="Copies">
                <Copy size={14} />
                <span className="text-xs font-mono font-medium">{copies}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400" title="Rating">
                <Star className="text-amber-500" size={14} />
                <span className="text-xs font-mono font-medium text-zinc-300">{displayRating}</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] text-zinc-500 font-medium">
            Saved on {formattedDate}
          </span>

          <div className="h-px w-full bg-white/5 my-1" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href={`/prompts/${bookmark._id}`}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white text-center rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
            >
              View Prompt
            </Link>

            <button
              onClick={() => onRemove(bookmarkId, bookmark._id)}
              className="p-2.5 bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-xl transition-all"
              title="Remove Bookmark"
            >
              <BookmarkFill size={18} />
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}