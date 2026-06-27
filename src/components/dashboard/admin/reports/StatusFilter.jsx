// components/dashboard/admin/reports/StatusFilter.jsx
// ─────────────────────────────────────────────────────────────
// CLIENT COMPONENT — status filter using a native <select>.
//
// NOTE: This is purely presentational. It renders fine and is
// wired into ReportsPage, but the `value`/`onChange` it currently
// receives are placeholder state — picking an option here does NOT
// filter anything yet. Actual filtering will be implemented on the
// backend. See the BACKEND TODO comment block in ReportsPage.jsx.
//
// Why native <select> instead of HeroUI <Select>?
//   The HeroUI Select uses a custom dropdown (popover + listbox)
//   that requires careful theming and can introduce z-index issues
//   in complex layouts. A native <select> is:
//     • Immediately accessible (keyboard + screen-reader built-in)
//     • Zero-dependency
//     • Mobile-native (bottom sheet picker on iOS/Android)
//   We style it to match the dark design system via CSS.
//
// Props:
//   value     string   — current status key ("all" | "pending" | …)
//   onChange  function — called with the new status key
// ─────────────────────────────────────────────────────────────
"use client";
// All possible filter options.
// "all" is the catch-all; the rest match report.status values
// stored in the database.
const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "warned", label: "Warned" },
  { value: "dismissed", label: "Dismissed" },
  { value: "deleted", label: "Deleted" },
];
// Chevron-down icon for the custom select arrow
function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none text-zinc-500 flex-shrink-0"
    >
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
// ─────────────────────────────────────────────────────────────
export default function StatusFilter({ value, onChange }) {
  return (
    // Wrapper provides the relative context for the custom arrow icon
    <div className="relative inline-flex items-center flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter reports by status"
        className={`h-11 pl-4 pr-9 bg-[#030303] border border-white/[0.08] rounded-xl
                   text-sm text-zinc-300 appearance-none cursor-pointer
                   focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
                   transition-colors duration-150
                   hover:border-white/[0.15]
                   // Dark background for the dropdown option list
                   [&>option]:bg-[#0a0a0c] [&>option]:text-white`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom arrow — positioned over the right side of the select */}
      <span className="absolute right-3 top-1/2 -translate-y-1/2">
        <ChevronIcon />
      </span>
    </div>
  );
}