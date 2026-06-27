// components/dashboard/admin/reports/SearchBar.jsx
// ─────────────────────────────────────────────────────────────
// CLIENT COMPONENT — controlled search input.
//
// NOTE: This is purely presentational. It renders fine and is
// wired into ReportsPage, but the `value`/`onChange` it currently
// receives are placeholder state — typing here does NOT filter
// anything yet. Actual search will be implemented on the backend.
// See the BACKEND TODO comment block in ReportsPage.jsx.
//
// Intentionally keeps no local state: whichever parent uses this
// should own the search string (e.g. via URL query params) so it
// can reset it when filters clear.
//
// Props:
//   value     string   — current search value (controlled)
//   onChange  function — called with the new string on every keystroke
// ─────────────────────────────────────────────────────────────
"use client";
// Search icon inline SVG — avoids an external icon dependency
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="text-zinc-500 flex-shrink-0"
    >
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
// Clear button × icon
function ClearIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
// ─────────────────────────────────────────────────────────────
export default function SearchBar({ value, onChange }) {
  return (
    // flex-1 on larger screens so it fills available toolbar space
    <div className="relative flex-1 w-full sm:max-w-sm lg:max-w-md">
      {/* Search magnifier icon */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <SearchIcon />
      </span>
      <input
        type="search"
        role="searchbox"
        aria-label="Search reports by prompt title, reporter, creator, or reason"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by prompt, reporter, creator, or reason…"
        // Hide the browser-native clear button (×) that appears in
        // type="search" inputs — we render our own below for styling control
        className={`w-full h-11 bg-[#030303] border border-white/[0.08] rounded-xl
                   pl-10 pr-10 text-sm text-white placeholder:text-zinc-600
                   focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
                   transition-colors duration-150
                   [&::-webkit-search-cancel-button]:appearance-none
                   [&::-ms-clear]:hidden`}
      />
      {/* Custom clear button — only visible when there's a value */}
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3.5 top-1/2 -translate-y-1/2
                     text-zinc-500 hover:text-white transition-colors duration-150"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}