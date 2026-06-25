"use client";

import { motion } from "framer-motion";

export default function FeaturedPromptsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="flex flex-col bg-[#0a0a0c]/50 border border-white/5 rounded-3xl overflow-hidden min-h-[460px] shadow-lg"
        >
          {/* Image Skeleton */}
          <div className="w-full aspect-[16/9] bg-white/5 animate-pulse relative">
            <div className="absolute top-4 left-4 w-20 h-6 bg-white/10 rounded-lg" />
          </div>
          
          {/* Body Skeleton */}
          <div className="p-6 flex flex-col flex-1 gap-4">
            <div className="flex justify-between items-center mb-2">
              <div className="w-16 h-4 bg-white/5 rounded-md animate-pulse" />
              <div className="w-20 h-5 bg-white/5 rounded-md animate-pulse" />
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="w-full h-6 bg-white/10 rounded-md animate-pulse" />
              <div className="w-3/4 h-6 bg-white/10 rounded-md animate-pulse" />
            </div>
            
            <div className="space-y-2 mb-auto">
              <div className="w-full h-3 bg-white/5 rounded-sm animate-pulse" />
              <div className="w-5/6 h-3 bg-white/5 rounded-sm animate-pulse" />
            </div>
            
            <div className="mt-auto flex flex-col gap-5 pt-5 border-t border-white/5">
              <div className="flex justify-between items-center">
                <div className="w-24 h-3 bg-white/5 rounded-sm animate-pulse" />
                <div className="w-16 h-4 bg-white/5 rounded-sm animate-pulse" />
              </div>
              <div className="w-full h-11 bg-white/5 rounded-xl animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}