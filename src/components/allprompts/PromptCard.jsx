"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Copy } from "@gravity-ui/icons";

export default function PromptCard({ prompt }) {
  // Safe default parsing
  const displayRating = prompt.rating ? prompt.rating.toFixed(1) : "0.0";
  const copies = prompt.copyCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] hover:border-white/20 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-colors h-full"
    >
      {/* Thumbnail Area */}
      <div className="relative w-full h-40 overflow-hidden bg-white/5">
        <img 
          src={prompt.thumbnail} 
          alt={prompt.title} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {prompt.featured && (
            <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg">
              Featured
            </span>
          )}
          <span className="px-2.5 py-1 bg-[#0a0a0c]/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-medium rounded-md w-max">
            {prompt.difficulty}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Category & Tool */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest font-mono">
            {prompt.category}
          </span>
          <span className="text-xs text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {prompt.aiTool}
          </span>
        </div>

        {/* Title & Desc */}
        <h3 className="text-lg font-bold text-white leading-snug mb-2 line-clamp-2">
          {prompt.title}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-6 flex-1">
          {prompt.description}
        </p>

        {/* Footer Info */}
        <div className="flex flex-col gap-4 mt-auto">
          {/* Creator Line */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>By <span className="text-zinc-300 font-medium">{prompt.creatorName}</span></span>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* Metrics & Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-zinc-400" title="Total Copies">
                <Copy size={14} />
                <span className="text-sm font-mono font-medium">{copies}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400" title="Rating">
                <Star className="text-amber-500" size={14} />
                <span className="text-sm font-mono font-medium text-zinc-300">{displayRating}</span>
              </div>
            </div>

            <Link 
              href={`/all-prompts/${prompt._id}`}
              className="text-sm font-medium text-white bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 px-4 py-1.5 rounded-lg transition-all"
            >
              View Details
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}