// Shared badge primitives — imported by PromptRow, PromptMobileCard, and anywhere else badges appear.
// Kept in a separate file so there is a single source of truth for badge styles.

export function StatusBadge({ status }) {
  const styles = {
    pending:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border
        ${styles[status] ?? styles.pending}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}

export function VisibilityBadge({ visibility }) {
  const isPublic = visibility === "Public";
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border
        ${isPublic
          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}
      aria-label={`Visibility: ${visibility}`}
    >
      {visibility}
    </span>
  );
}

export function FeaturedBadge({ featured }) {
  return featured ? (
    <span
      className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-purple-500/10 text-purple-400 border-purple-500/20"
      aria-label="Featured prompt"
    >
      Featured
    </span>
  ) : (
    <span
      className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-zinc-500/5 text-zinc-600 border-white/5"
      aria-label="Standard prompt"
    >
      Standard
    </span>
  );
}