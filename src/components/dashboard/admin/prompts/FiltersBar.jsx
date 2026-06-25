"use client";

import { ChevronDown } from "@gravity-ui/icons";

// ─── FiltersBar ───────────────────────────────────────────────────────────────
// BACKEND INTEGRATION:
//   Each onChange fires `onFilterChange(key, value)` in AdminAllPrompts.
//   When the backend is ready, build the query string from all active filters and call:
//   GET /api/admin/prompts?status=${status}&visibility=${visibility}&featured=${featured}&search=…
//   Reset page to 1 on every filter change.
// ─────────────────────────────────────────────────────────────────────────────

const FILTER_OPTIONS = {
  status:     ["All", "Pending", "Approved", "Rejected"],
  visibility: ["All", "Public", "Private"],
  featured:   ["All", "Featured", "Standard"],
};

// Single styled <select> — no button-inside-button, full keyboard access, aria-label on every select.
function FilterSelect({ id, label, value, optionKey, onChange }) {
  return (
    <div className="flex flex-col gap-1 min-w-[130px]">
      <label htmlFor={id} className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1 select-none">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(optionKey, e.target.value)}
          aria-label={`Filter by ${label}`}
          className={`w-full appearance-none h-10 pl-3.5 pr-9 bg-[#030303] border border-white/10 rounded-xl
            text-sm outline-none cursor-pointer transition-all duration-200
            hover:border-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/40
            text-zinc-200`}
        >
          {FILTER_OPTIONS[optionKey].map((opt) => (
            <option key={opt} value={opt} className="bg-[#0d0d10] text-zinc-200">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function FiltersBar({ filters, onFilterChange }) {
  return (
    <div
      role="group"
      aria-label="Prompt filters"
      className="flex flex-wrap items-end gap-3 w-full lg:w-auto"
    >
      <FilterSelect
        id="filter-status"
        label="Status"
        value={filters.status}
        optionKey="status"
        onChange={onFilterChange}
      />
      <FilterSelect
        id="filter-visibility"
        label="Visibility"
        value={filters.visibility}
        optionKey="visibility"
        onChange={onFilterChange}
      />
      <FilterSelect
        id="filter-featured"
        label="Featured"
        value={filters.featured}
        optionKey="featured"
        onChange={onFilterChange}
      />
    </div>
  );
}