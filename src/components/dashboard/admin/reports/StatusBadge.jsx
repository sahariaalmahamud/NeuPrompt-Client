// components/dashboard/admin/reports/StatusBadge.jsx
// ─────────────────────────────────────────────────────────────
// Pure UI component — renders a colour-coded pill badge for a
// report's status.
//
// No client directive needed: this component has no hooks,
// events, or browser APIs — it can render on the server.
// If used inside a "use client" parent it works there too.
//
// Props:
//   status  string — "pending" | "warned" | "dismissed" | "deleted"
// ─────────────────────────────────────────────────────────────

// Maps each status value to its Tailwind colour classes.
// Extend this object if you add new status values to the schema.
const STATUS_STYLES = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  warned:    "bg-orange-500/10 text-orange-400 border-orange-500/20",
  dismissed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  deleted:   "bg-red-500/10 text-red-400 border-red-500/20",
};

// Fallback for any unknown status values returned by the API
const FALLBACK_STYLE = "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? FALLBACK_STYLE;

  return (
    <span
      // role="status" announces updates to screen readers if this
      // badge re-renders after an admin action
      role="status"
      aria-label={`Status: ${status}`}
      className={`inline-flex items-center flex-shrink-0 px-2.5 py-0.5 rounded-md
                  text-[10px] font-bold uppercase tracking-widest border ${style}`}
    >
      {status}
    </span>
  );
}