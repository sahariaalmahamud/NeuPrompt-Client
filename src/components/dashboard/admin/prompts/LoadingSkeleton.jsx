// LoadingSkeleton — shown while admin prompts data is fetching.
// Matches the table column layout so the screen doesn't shift when data arrives.

function SkeletonCell({ w = "w-24", h = "h-4" }) {
  return <div className={`${w} ${h} rounded-md bg-white/[0.05] animate-pulse`} />;
}

export default function LoadingSkeleton({ rows = 7 }) {
  return (
    <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">

      {/* Header shimmer */}
      <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5 flex gap-6">
        {["w-32", "w-24", "w-20", "w-16", "w-16", "w-24"].map((w, i) => (
          <SkeletonCell key={i} w={w} h="h-2.5" />
        ))}
      </div>

      {/* Row shimmers */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="px-5 py-4 border-b border-white/[0.04] last:border-0 flex items-center gap-6
            animate-pulse"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Prompt info */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <SkeletonCell w="w-48 max-w-full" h="h-4" />
            <SkeletonCell w="w-28" h="h-3" />
          </div>
          {/* Creator */}
          <div className="hidden md:flex flex-col gap-1.5 w-36">
            <SkeletonCell w="w-28" h="h-4" />
            <SkeletonCell w="w-36" h="h-3" />
          </div>
          {/* Settings */}
          <div className="hidden md:flex flex-col gap-1.5 w-20">
            <SkeletonCell w="w-16" h="h-5" />
            <SkeletonCell w="w-16" h="h-5" />
          </div>
          {/* Status */}
          <SkeletonCell w="w-16 hidden md:block" h="h-5" />
          {/* Date */}
          <SkeletonCell w="w-20 hidden md:block ml-auto" h="h-4" />
          {/* Actions */}
          <div className="flex gap-1 shrink-0">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="size-8 rounded-lg bg-white/[0.04]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}