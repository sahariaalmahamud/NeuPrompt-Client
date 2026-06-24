"use client";

import { motion } from "framer-motion";
import { Magnifier } from "@gravity-ui/icons";

export default function EmptyState({ onClearFilters }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full py-20 flex flex-col items-center justify-center text-center bg-[#0a0a0c]/30 border border-white/5 rounded-3xl"
    >
      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
        <Magnifier className="text-blue-500" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No prompts found</h3>
      <p className="text-zinc-400 max-w-sm mb-8">
        We couldn't find any prompts matching your current search or filter criteria. Try adjusting them.
      </p>
      
      <button 
        onClick={onClearFilters}
        className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        Clear Filters
      </button>
    </motion.div>
  );
}