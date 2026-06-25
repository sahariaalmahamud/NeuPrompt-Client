"use client";

import { Magnifier, Xmark } from "@gravity-ui/icons";

// ─── SearchBar ────────────────────────────────────────────────────────────────
// BACKEND INTEGRATION:
//   When the backend is ready, debounce `onChange` by ~300 ms then call:
//   GET /api/admin/prompts?search=${query}&...otherFilters
//   The parent (AdminAllPrompts) owns the query state and passes it here as `value`.
// ─────────────────────────────────────────────────────────────────────────────

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full lg:max-w-md">
      {/* Search icon */}
      <Magnifier
        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none"
        aria-hidden="true"
      />

      <input
        id="admin-prompt-search"
        type="search"
        role="searchbox"
        aria-label="Search prompts by title, ID, or creator"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, ID, or creator…"
        className={`w-full h-11 pl-10 pr-9 bg-[#030303] border border-white/10 rounded-xl text-sm text-white
          placeholder:text-zinc-600 outline-none transition-all duration-200
          hover:border-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/40`}
      />

      {/* Clear button — only rendered when there is a value */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center
            text-zinc-500 hover:text-white transition-colors rounded"
        >
          <Xmark className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}