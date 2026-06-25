"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Magnifier } from "@gravity-ui/icons";
import { Button } from "@heroui/react";

export default function SavedPromptsEmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full py-24 flex flex-col items-center justify-center text-center bg-[#0a0a0c]/30 border border-white/5 rounded-3xl"
    >
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
        <Bookmark className="text-zinc-500" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No saved prompts yet.</h3>
      <p className="text-zinc-400 max-w-sm mb-8 text-sm">
        You haven't bookmarked any prompts. Explore the marketplace to find and save prompts that speed up your workflow.
      </p>
      
      <Button 
        as={Link} 
        href="/prompts"
        className="px-6 py-2.5 h-12 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2"
      >
        <Magnifier size={18} /> Browse Prompts
      </Button>
    </motion.div>
  );
}