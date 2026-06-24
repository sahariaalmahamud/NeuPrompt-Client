"use client";

import { motion } from "framer-motion";

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex flex-col bg-[#0a0a0c]/50 border border-white/5 rounded-2xl overflow-hidden h-[400px]"
        >
          {/* Image skeleton */}
          <div className="w-full h-40 bg-white/5 animate-pulse" />
          
          <div className="p-5 flex flex-col flex-1 gap-4">
            <div className="flex justify-between">
              <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-12 h-4 bg-white/5 rounded animate-pulse" />
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="w-3/4 h-6 bg-white/10 rounded animate-pulse" />
              <div className="w-1/2 h-6 bg-white/10 rounded animate-pulse" />
            </div>
            
            <div className="space-y-2 mb-auto">
              <div className="w-full h-3 bg-white/5 rounded animate-pulse" />
              <div className="w-4/5 h-3 bg-white/5 rounded animate-pulse" />
            </div>
            
            <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
              <div className="w-20 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-24 h-8 bg-white/10 rounded-lg animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}