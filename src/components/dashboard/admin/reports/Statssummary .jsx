// components/dashboard/admin/reports/StatsSummary.jsx
// ─────────────────────────────────────────────────────────────
// CLIENT COMPONENT — displays a 2×2 (mobile) or 4×1 (tablet+)
// grid of stat cards showing how many reports exist per status.
//
// Receives the FULL reports array (not filtered) so the counts
// always reflect true totals regardless of the active filter.
//
// BACKEND TODO:
//   For large datasets, instead of deriving counts client-side,
//   fetch pre-computed counts from the server:
//   GET /api/admin/reports/stats
//   → { pending: N, warned: N, dismissed: N, deleted: N }
// ─────────────────────────────────────────────────────────────
"use client";

// ── Card definitions ───────────────────────────────────────────
// Each entry describes one stat card. `statusKey` matches the
// report.status values that come from the database.
const STAT_CARDS = [
  {
    statusKey: "pending",
    label:     "Pending",
    // Amber — "needs attention" but not yet critical
    valueClass:  "text-amber-400",
    borderClass: "border-amber-500/15 hover:border-amber-500/30",
    dotClass:    "bg-amber-400",
  },
  {
    statusKey: "warned",
    label:     "Warned",
    // Orange — action has been taken, escalation in progress
    valueClass:  "text-orange-400",
    borderClass: "border-orange-500/15 hover:border-orange-500/30",
    dotClass:    "bg-orange-400",
  },
  {
    statusKey: "dismissed",
    label:     "Dismissed",
    // Zinc — neutral, resolved without action
    valueClass:  "text-zinc-400",
    borderClass: "border-white/[0.07] hover:border-white/[0.13]",
    dotClass:    "bg-zinc-500",
  },
  {
    statusKey: "deleted",
    label:     "Deleted",
    // Red — most severe action taken
    valueClass:  "text-red-400",
    borderClass: "border-red-500/15 hover:border-red-500/30",
    dotClass:    "bg-red-400",
  },
];

// ─────────────────────────────────────────────────────────────

export default function StatsSummary({ reports }) {
  // Count reports by status in a single pass for O(n) efficiency.
  // Initialise all keys to 0 so cards with no data show "0" not NaN.
  const counts = reports.reduce(
    (acc, r) => {
      if (r.status in acc) acc[r.status]++;
      return acc;
    },
    { pending: 0, warned: 0, dismissed: 0, deleted: 0 }
  );

  return (
    // 2 columns on phones, 4 columns from tablet width upward
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {STAT_CARDS.map(({ statusKey, label, valueClass, borderClass, dotClass }) => (
        <div
          key={statusKey}
          className={`bg-[#0a0a0c] border rounded-2xl px-4 py-4 sm:px-5 sm:py-5
                      transition-colors duration-200 ${borderClass}`}
        >
          {/* Status indicator dot + label */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${dotClass}`} aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              {label}
            </span>
          </div>
          {/* Count — large and prominent */}
          <p className={`text-3xl sm:text-4xl font-bold tabular-nums ${valueClass}`}>
            {counts[statusKey]}
          </p>
        </div>
      ))}
    </div>
  );
}