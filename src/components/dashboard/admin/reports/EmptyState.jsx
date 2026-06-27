// components/dashboard/admin/reports/EmptyState.jsx
// ─────────────────────────────────────────────────────────────
// Pure UI component — displayed when the report list is empty.
// Shows two different messages:
//
//   hasActiveFilters = true  → "Nothing matched" — invite the
//                              admin to clear their search/filter
//   hasActiveFilters = false → "All clear" — the marketplace
//                              genuinely has no reports yet
//
// NOTE: `hasActiveFilters` is currently derived from placeholder
// search/filter state in ReportsPage.jsx (UI only, not wired to
// any real filtering logic yet). Once the backend implements
// search/filter, this prop should be driven by the real URL query
// params / fetch result instead.
//
// Props:
//   hasActiveFilters  boolean
//   onClear           function | undefined — called when the
//                     "Clear filters" button is clicked
// ─────────────────────────────────────────────────────────────
// Shield-check icon inline SVG
function ShieldIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-emerald-500"
    >
      <path
        d="M12 3L4 7v5c0 4.418 3.582 8 8 8s8-3.582 8-8V7l-8-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
// ─────────────────────────────────────────────────────────────
export default function EmptyState({ hasActiveFilters, onClear }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center text-center
                 py-20 sm:py-28 px-6
                 bg-[#0a0a0c]/40 border border-white/[0.06] rounded-2xl"
    >
      {/* Icon container */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6
                   bg-emerald-500/[0.08] border border-emerald-500/20"
      >
        <ShieldIcon />
      </div>
      {/* Heading */}
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
        {hasActiveFilters ? "No reports found" : "All clear"}
      </h3>
      {/* Supporting copy */}
      <p className="text-sm text-zinc-500 max-w-xs leading-relaxed mb-6">
        {hasActiveFilters
          ? "No reports match your current search or filter. Try adjusting or clearing them."
          : "No reports have been submitted yet. The marketplace looks clean."}
      </p>
      {/* Clear filters button — only shown when filters are active */}
      {hasActiveFilters && onClear && (
        <button
          onClick={onClear}
          className="px-6 py-2.5 rounded-xl border border-white/[0.1]
                     bg-white/[0.04] hover:bg-white/[0.08]
                     text-sm font-medium text-white
                     transition-colors duration-150"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}