"use client";

import { motion } from "framer-motion";

export default function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#030303] pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Skeleton */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            {/* Image Skeleton */}
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-3xl bg-white/5 animate-pulse" />
            
            {/* Title & Desc Skeleton */}
            <div className="space-y-3">
              <div className="w-3/4 h-10 bg-white/10 rounded-xl animate-pulse" />
              <div className="w-full h-4 bg-white/5 rounded-md animate-pulse" />
              <div className="w-5/6 h-4 bg-white/5 rounded-md animate-pulse" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-4 pt-4">
              <div className="w-40 h-12 bg-white/10 rounded-xl animate-pulse" />
              <div className="w-32 h-12 bg-white/5 rounded-xl animate-pulse" />
            </div>
          </motion.div>

          {/* Editor Skeleton */}
          <div className="h-64 bg-[#0a0a0c] border border-white/5 rounded-2xl animate-pulse flex flex-col">
            <div className="h-10 border-b border-white/5 bg-white/5" />
            <div className="p-6 space-y-3">
              <div className="w-full h-4 bg-white/5 rounded" />
              <div className="w-full h-4 bg-white/5 rounded" />
              <div className="w-2/3 h-4 bg-white/5 rounded" />
            </div>
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 h-96 bg-[#0a0a0c]/80 border border-white/5 rounded-3xl p-6 animate-pulse flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10" />
              <div className="space-y-2 flex-1">
                <div className="w-1/2 h-4 bg-white/10 rounded" />
                <div className="w-1/3 h-3 bg-white/5 rounded" />
              </div>
            </div>
            <div className="h-px w-full bg-white/5" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-white/5 rounded-xl" />
              <div className="h-20 bg-white/5 rounded-xl" />
            </div>
            <div className="h-32 bg-white/5 rounded-xl mt-2" />
          </div>
        </div>

      </div>
    </div>
  );
}