"use client";

// ─── Filter config ────────────────────────────────────────────────────────────
// Option values must match the backend query params exactly.
// "All" is the sentinel for "no filter applied" — backend omits the param when
// it receives "All" (handled in AllPrompts.jsx URLSearchParams builder).
const FILTER_CONFIG = {
  aiTool: [
    "All",
    "ChatGPT",
    "Claude",
    "Gemini",
    "Midjourney",
    "Stable Diffusion",
    "Other",
  ],
  category: [
    "All",
    "Writing",
    "Marketing",
    "Coding",
    "Business",
    "Education",
    "Productivity",
    "Design",
    "Social Media",
    "Research",
    "Other",
  ],
  difficulty: ["All", "Beginner", "Intermediate", "Advanced"],
};

const DEFAULT_FILTERS = {
  aiTool:     "All",
  category:   "All",
  difficulty: "All",
};

// ─── FilterSection ────────────────────────────────────────────────────────────
// FIX: Moved outside FiltersSidebar.
//   Defining a component INSIDE another component causes React to treat it as
//   a new type on every render, fully unmounting and remounting all children
//   (losing focus, triggering unnecessary DOM churn).
//   Moving it outside means React reuses the same component instance.
function FilterSection({ title, type, options, activeValue, onFilterChange }) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Section label */}
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono px-1">
        {title}
      </h3>

      {/* Option buttons */}
      <div className="flex flex-col gap-0.5" role="group" aria-label={`Filter by ${title}`}>
        {options.map((option) => {
          const isActive = activeValue === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onFilterChange(type, option)}
              // aria-pressed tells screen readers which option is selected
              aria-pressed={isActive}
              aria-label={`${title}: ${option}`}
              className={`relative text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-150
                outline-none focus:ring-1 focus:ring-blue-500/30
                ${isActive
                  ? "bg-blue-500/10 text-blue-400 font-medium"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                }`}
            >
              {/* Active indicator bar on the left edge */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-500 rounded-r-full"
                  aria-hidden="true"
                />
              )}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── FiltersSidebar ───────────────────────────────────────────────────────────
// Pure controlled component — all state lives in AllPrompts.jsx.
// No HeroUI compound APIs used — plain buttons only, no broken sub-components.
//
// BACKEND INTEGRATION:
//   onFilterChange(type, value) → updates AllPrompts filters state →
//   triggers the useEffect fetch in AllPrompts with the new filter params.
//   "All" values are stripped from URLSearchParams in AllPrompts before fetching.
// ─────────────────────────────────────────────────────────────────────────────

export default function FiltersSidebar({ filters, onFilterChange }) {
  // Check if any non-default filter is active (to show the clear button)
  const hasActiveFilters =
    filters.aiTool !== "All" ||
    filters.category !== "All" ||
    filters.difficulty !== "All";

  const handleClearAll = () => {
    Object.entries(DEFAULT_FILTERS).forEach(([type, value]) => {
      onFilterChange(type, value);
    });
  };

  return (
    <div className="w-full bg-[#0a0a0c]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col gap-6">

      {/* Header row — title + clear button */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white">Filters</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            aria-label="Clear all active filters"
            className="text-[10px] font-medium text-blue-400 hover:text-blue-300 transition-colors
              outline-none focus:ring-1 focus:ring-blue-500/30 rounded px-1"
          >
            Clear all
          </button>
        )}
      </div>

      {/* AI Engine */}
      <FilterSection
        title="AI Engine"
        type="aiTool"
        options={FILTER_CONFIG.aiTool}
        activeValue={filters.aiTool}
        onFilterChange={onFilterChange}
      />

      <div className="h-px w-full bg-white/5" aria-hidden="true" />

      {/* Category */}
      <FilterSection
        title="Category"
        type="category"
        options={FILTER_CONFIG.category}
        activeValue={filters.category}
        onFilterChange={onFilterChange}
      />

      <div className="h-px w-full bg-white/5" aria-hidden="true" />

      {/* Difficulty */}
      <FilterSection
        title="Difficulty"
        type="difficulty"
        options={FILTER_CONFIG.difficulty}
        activeValue={filters.difficulty}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}