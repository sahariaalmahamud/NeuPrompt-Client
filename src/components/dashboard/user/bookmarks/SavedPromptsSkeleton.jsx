"use client";

import { motion } from "framer-motion";

export default function SavedPromptsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex flex-col bg-[#0a0a0c]/50 border border-white/5 rounded-3xl overflow-hidden h-[420px] shadow-lg"
        >
          {/* Image skeleton */}
          <div className="w-full aspect-video bg-white/5 animate-pulse" />
          
          <div className="p-5 flex flex-col flex-1 gap-4">
            <div className="flex justify-between items-center mb-2">
              <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-16 h-5 bg-white/5 rounded animate-pulse" />
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="w-full h-6 bg-white/10 rounded animate-pulse" />
              <div className="w-3/4 h-6 bg-white/10 rounded animate-pulse" />
            </div>
            
            <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-white/5">
              <div className="w-full h-10 bg-white/5 rounded-xl animate-pulse" />
              <div className="flex gap-2">
                <div className="flex-1 h-11 bg-white/10 rounded-xl animate-pulse" />
                <div className="w-11 h-11 bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}