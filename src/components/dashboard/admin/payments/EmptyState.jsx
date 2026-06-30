"use client";

import { motion } from "framer-motion";
import { CircleDollar } from "@gravity-ui/icons";

export default function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="w-full py-24 flex flex-col items-center justify-center text-center bg-[#0a0a0c]/40 border border-white/5 rounded-3xl border-dashed"
    >
      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-inner">
        <CircleDollar className="text-blue-500" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No payment transactions found.</h3>
      <p className="text-zinc-500 max-w-sm text-sm mb-6 leading-relaxed">
        It looks like there are no payments matching your current filters, or no transactions have been processed yet.
      </p>
    </motion.div>
  );
}