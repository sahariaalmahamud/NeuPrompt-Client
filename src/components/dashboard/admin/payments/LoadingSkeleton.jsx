"use client";

export default function LoadingSkeleton() {
  return (
    <div className="w-full flex flex-col gap-8 animate-pulse">
      {/* Table Skeleton */}
      <div className="w-full bg-[#0a0a0c]/80 border border-white/[0.06] rounded-2xl p-1 shadow-sm">
        <div className="hidden md:flex w-full items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="h-4 w-24 bg-white/5 rounded-md" />
          <div className="h-4 w-32 bg-white/5 rounded-md" />
          <div className="h-4 w-16 bg-white/5 rounded-md" />
          <div className="h-4 w-16 bg-white/5 rounded-md" />
          <div className="h-4 w-20 bg-white/5 rounded-md" />
          <div className="h-4 w-24 bg-white/5 rounded-md" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 px-6 py-5 gap-4">
            {/* Desktop pattern */}
            <div className="hidden md:block h-4 w-24 bg-white/10 rounded-md" />
            <div className="hidden md:block h-4 w-40 bg-white/5 rounded-md" />
            <div className="hidden md:block h-6 w-16 bg-white/5 rounded-md" />
            <div className="hidden md:block h-4 w-16 bg-white/10 rounded-md" />
            <div className="hidden md:block h-6 w-20 bg-white/5 rounded-md" />
            <div className="hidden md:block h-4 w-24 bg-white/5 rounded-md" />
            <div className="hidden md:block h-8 w-8 bg-white/5 rounded-lg" />
            
            {/* Mobile pattern */}
            <div className="md:hidden flex justify-between w-full">
              <div className="h-4 w-32 bg-white/10 rounded-md" />
              <div className="h-6 w-20 bg-white/5 rounded-md" />
            </div>
            <div className="md:hidden grid grid-cols-2 gap-4 w-full pt-2">
              <div className="h-10 bg-[#030303] rounded-xl" />
              <div className="h-10 bg-[#030303] rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}