"use client";

import { motion } from "framer-motion";
import { Copy, Bookmark, Star } from "@gravity-ui/icons";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function TopPrompts({ topPrompts }) {
  const cards = [
    {
      title: "Most Copied",
      data: topPrompts.mostCopied,
      statValue: topPrompts.mostCopied?.copyCount.toLocaleString(),
      statLabel: "Total Copies",
      icon: <Copy size={14} className="text-blue-400" />,
      colorClass: "text-blue-400"
    },
    {
      title: "Most Bookmarked",
      data: topPrompts.mostBookmarked,
      statValue: topPrompts.mostBookmarked?.bookmarkCount.toLocaleString(),
      statLabel: "Total Saves",
      icon: <Bookmark size={14} className="text-purple-400" />,
      colorClass: "text-purple-400"
    },
    {
      title: "Highest Rated",
      data: topPrompts.highestRated,
      statValue: `${topPrompts.highestRated?.rating.toFixed(1)} / 5.0`,
      statLabel: `${topPrompts.highestRated?.totalRatings} Reviews`,
      icon: <Star size={14} className="text-amber-400" />,
      colorClass: "text-amber-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        if (!card.data) return null; // Safe fallback

        return (
          <motion.div 
            key={idx}
            variants={fadeUp}
            className="flex flex-col bg-[#0a0a0c]/80 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.4)] group"
          >
            {/* Top Label */}
            <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 font-mono">
                {card.title}
              </span>
            </div>

            <div className="p-5 flex items-start gap-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={card.data.thumbnail} 
                  alt={card.data.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 min-w-0 justify-center gap-1.5">
                <Link href={`/prompts/${card.data._id}`} className="text-sm font-bold text-white truncate hover:text-blue-400 transition-colors">
                  {card.data.title}
                </Link>
                <div className="flex items-center gap-1.5">
                  <div className={`flex items-center justify-center p-1 rounded-md bg-white/5 border border-white/5 ${card.colorClass}`}>
                    {card.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white leading-none">{card.statValue}</span>
                    <span className="text-[10px] text-zinc-500">{card.statLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}