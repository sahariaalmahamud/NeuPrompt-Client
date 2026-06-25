"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Check, Xmark, Star, TrashBin } from "@gravity-ui/icons";
import { FeaturedBadge, StatusBadge, VisibilityBadge } from "./Badges";


export default function PromptMobileCard({ prompt, onOpenModal, onToggleFeature, index = 0 }) {
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-4"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">{prompt.category}</span>
            <span className="size-1 rounded-full bg-white/20 shrink-0" aria-hidden="true" />
            <span className="text-[10px] text-zinc-500">{prompt.aiTool}</span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">{prompt.title}</h3>
        </div>
        <StatusBadge status={prompt.status} />
      </div>

      {/* Meta block */}
      <div className="bg-[#060608] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Creator</span>
          <span className="text-zinc-200 font-medium truncate max-w-[160px]">{prompt.creatorName}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Date</span>
          <span className="text-zinc-400 tabular-nums">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-white/5 flex-wrap">
          <VisibilityBadge visibility={prompt.visibility} />
          <FeaturedBadge featured={prompt.featured} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
        <Link
          href={`/admin/prompts/${prompt._id}`}
          aria-label={`View "${prompt.title}"`}
          className={`size-9 flex items-center justify-center rounded-xl bg-white/5 text-zinc-400
            hover:text-white hover:bg-white/10 transition-colors`}
        >
          <Eye className="size-4" aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={() => onOpenModal("approve", prompt)}
          aria-label={`Approve "${prompt.title}"`}
          className={`flex-1 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold
            hover:bg-emerald-500/20 transition-colors`}
        >
          Approve
        </button>

        <button
          type="button"
          onClick={() => onOpenModal("reject", prompt)}
          aria-label={`Reject "${prompt.title}"`}
          className={`flex-1 h-9 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-semibold
            hover:bg-amber-500/20 transition-colors`}
        >
          Reject
        </button>

        <button
          type="button"
          onClick={() => onToggleFeature(prompt._id, prompt.featured)}
          aria-label={prompt.featured ? `Remove feature from "${prompt.title}"` : `Feature "${prompt.title}"`}
          className={`size-9 flex items-center justify-center rounded-xl transition-colors
            ${prompt.featured
              ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
              : "bg-white/5 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10"}`}
        >
          <Star className="size-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onOpenModal("delete", prompt)}
          aria-label={`Delete "${prompt.title}"`}
          className={`size-9 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500
            hover:text-red-400 hover:bg-red-500/10 transition-colors`}
        >
          <TrashBin className="size-4" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
}