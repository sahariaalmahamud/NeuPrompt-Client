// components/dashboard/admin/reports/Pagination.jsx
// ─────────────────────────────────────────────────────────────
// Pure UI component — renders Prev / page indicator / Next
// pagination controls.
//
// NOTE: This is purely presentational. It's wired into ReportsPage,
// but `totalPages` is currently hardcoded to 1 there as a placeholder
// — meaning this won't actually render in the running app until a
// real page count is supplied. Actual pagination will be implemented
// on the backend. See the BACKEND TODO comment block in
// ReportsPage.jsx and app/admin/reports/page.jsx.
//
// Renders nothing when totalPages ≤ 1 so the parent never has
// to conditionally hide it.
//
// Why not HeroUI Pagination?
//   HeroUI's Pagination component wraps an <ol> of page number
//   buttons that adds unneeded visual noise here. For a simple
//   admin panel a Prev / Next pattern is cleaner and more
//   accessible on narrow screens.
//
// Props:
//   currentPage   number
//   totalPages    number
//   onPageChange  function(newPage: number)
// ─────────────────────────────────────────────────────────────
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Nothing to paginate
  if (totalPages <= 1) return null;
  const isFirst = currentPage === 1;
  const isLast  = currentPage === totalPages;
  return (
    <nav
      aria-label="Report list pagination"
      className="flex items-center justify-center gap-4 mt-8"
    >
      {/* Previous page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="Go to previous page"
        className="px-5 py-2.5 rounded-xl border border-white/[0.08]
                   text-sm font-medium text-zinc-400
                   hover:text-white hover:border-white/[0.18]
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors duration-150"
      >
        ← Prev
      </button>
      {/* Current page indicator — not a list of numbers; keeps the
          UI compact on any number of pages */}
      <p className="text-sm text-zinc-600 tabular-nums select-none">
        Page{" "}
        <span className="font-semibold text-white">{currentPage}</span>
        {" "}of{" "}
        <span className="font-semibold text-white">{totalPages}</span>
      </p>
      {/* Next page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="Go to next page"
        className="px-5 py-2.5 rounded-xl border border-white/[0.08]
                   text-sm font-medium text-zinc-400
                   hover:text-white hover:border-white/[0.18]
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors duration-150"
      >
        Next →
      </button>
    </nav>
  );
}