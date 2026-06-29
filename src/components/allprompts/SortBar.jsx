"use client";

import { ChevronDown, Sliders } from "@gravity-ui/icons";

// ─── Sort options ─────────────────────────────────────────────────────────────
// Keys must match the backend switch-case exactly:
//   "Latest" | "Oldest" | "Most Popular" | "Most Copied" | "Highest Rated"
// ─────────────────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  "Latest",
  "Oldest",
  "Most Popular",
  "Most Copied",
  "Highest Rated",
];

// ─── SortBar ──────────────────────────────────────────────────────────────────
// FIX: The original used HeroUI Dropdown compound sub-components
//   (Dropdown.Trigger wrapping a <div role="button"> → nested interactive
//   elements, Dropdown.Popover / Dropdown.Menu / Dropdown.Item → none of these
//   exist in HeroUI). onAction also suffered the same react-aria-X key bug as
//   the Select and ReportModal components.
//
//   Replaced with a native <select> — value is always the exact option string,
//   no internal key indirection, no broken compound APIs.
//
// ADDED: `resultCount` prop — shows "X prompts found" beside the sort control
//   so users have immediate feedback after filtering/searching.
// ─────────────────────────────────────────────────────────────────────────────

export default function SortBar({ sortOption, onSortChange, onMobileFilterOpen, resultCount }) {
  return (
    <div className="flex items-center justify-between gap-4 w-full flex-wrap">

      {/* Left side: mobile filter trigger + result count */}
      <div className="flex items-center gap-3">

        {/* Mobile filter button — hidden on desktop (FiltersSidebar shows instead) */}
        <button
          type="button"
          onClick={onMobileFilterOpen}
          aria-label="Open filters"
          className="lg:hidden flex items-center gap-2 px-4 h-10 bg-[#0a0a0c] border border-white/10
            rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:border-white/20
            transition-all outline-none focus:ring-1 focus:ring-white/20"
        >
          <Sliders className="size-4" aria-hidden="true" />
          Filters
        </button>

        {/* Result count — only shown when we have a value (null during loading) */}
        {resultCount !== null && resultCount !== undefined && (
          <span className="text-sm text-zinc-500 tabular-nums">
            <span className="text-zinc-300 font-medium">{resultCount.toLocaleString()}</span>
            {" "}prompt{resultCount !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {/* Right side: sort select */}
      <div className="flex items-center gap-2.5 shrink-0">
        <label
          htmlFor="marketplace-sort"
          className="text-sm text-zinc-500 hidden sm:block select-none"
        >
          Sort by
        </label>

        <div className="relative">
          <select
            id="marketplace-sort"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort prompts"
            className="appearance-none h-10 pl-4 pr-9 bg-[#0a0a0c] border border-white/10
              rounded-xl text-sm font-medium text-zinc-300 outline-none cursor-pointer
              transition-all duration-200
              hover:border-white/20 hover:bg-white/[0.02]
              focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/40
              min-w-[150px]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0d0d10] text-zinc-200">
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}