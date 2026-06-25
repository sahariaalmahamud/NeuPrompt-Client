"use client";

import { motion } from "framer-motion";
import { FolderMagnifier } from "@gravity-ui/icons";

export default function EmptyState({ hasSearch = false, query = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="status"
      aria-live="polite"
      className="w-full py-20 flex flex-col items-center justify-center text-center
        bg-[#0a0a0c]/40 border border-white/[0.05] rounded-2xl"
    >
      <div className="size-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5">
        <FolderMagnifier className="size-7 text-zinc-500" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        {hasSearch ? `No results for "${query}"` : "No prompts found"}
      </h3>

      <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
        {hasSearch
          ? "Try adjusting your search or filter criteria."
          : "There are no prompts in the system yet, or none match the active filters."}
      </p>
    </motion.div>
  );
}