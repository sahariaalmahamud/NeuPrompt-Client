"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Copy, Sparkles } from "@gravity-ui/icons";

// Framer Motion variant for staggering cards
export const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function FeaturedPromptCard({ prompt }) {
  const displayRating = prompt.rating ? prompt.rating.toFixed(1) : "0.0";
  const copies = prompt.copyCount || 0;

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] hover:border-white/20 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-colors h-full"
    >
      {/* Luminous Horizon Top Line on Hover */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover:w-full transition-all duration-500 z-20" />

      {/* 🖼️ Thumbnail Area */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#030303]">
        <img 
          src={prompt.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"} 
          alt={prompt.title} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
        />
        
        {/* Overlay Gradient for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
        
        {/* Badges Floating on Image */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          {prompt.featured && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
              <Sparkles size={12} /> Featured
            </span>
          )}
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-[#0a0a0c]/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-lg">
              {prompt.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* 📝 Card Body */}
      <div className="p-6 flex flex-col flex-1">
        
        {/* Category & AI Tool */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest font-mono">
            {prompt.category}
          </span>
          <span className="text-[10px] text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5 font-mono uppercase tracking-wider">
            {prompt.aiTool}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white leading-snug mb-2 line-clamp-2">
          {prompt.title}
        </h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-6 flex-1 leading-relaxed">
          {prompt.description}
        </p>

        {/* Footer: Meta & Action */}
        <div className="flex flex-col gap-5 mt-auto">
          
          {/* Creator & Metrics */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              By <span className="text-zinc-300 font-medium">{prompt.creatorName}</span>
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Copy size={14} />
                <span className="text-xs font-mono font-medium">{copies}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <Star className="text-amber-500" size={14} />
                <span className="text-xs font-mono font-medium text-zinc-300">{displayRating}</span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* Action Button */}
          <Link 
            href={`/prompts/${prompt._id}`}
            className="w-full py-3 bg-white/[0.03] hover:bg-blue-600 border border-white/5 hover:border-blue-500 text-sm font-medium text-white text-center rounded-xl transition-all duration-300 shadow-[0_0_0_rgba(37,99,235,0)] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            View Details
          </Link>
        </div>

      </div>
    </motion.div>
  );
}