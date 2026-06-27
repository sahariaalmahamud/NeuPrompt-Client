// components/dashboard/admin/reports/ReportsPage.jsx
// ─────────────────────────────────────────────────────────────
// CLIENT COMPONENT — orchestrates the reports UI.
//
// Responsibilities:
//   • Owns admin action state (warn, dismiss, delete, restore)
//     via ConfirmActionModal, then applies optimistic local updates
//   • Renders the search bar, status filter, and pagination UI
//
// ⚠️ IMPORTANT — SEARCH / FILTER / PAGINATION ARE UI-ONLY HERE:
//   <SearchBar>, <StatusFilter>, and <Pagination> below are wired
//   up with placeholder/no-op state ONLY so the components render
//   correctly (controlled inputs need a value + onChange).
//   They do NOT actually filter, search, or paginate `reports`.
//   The full `reports` array is rendered as-is, every time.
//
//   Once the backend supports search/filter/pagination (e.g. via
//   query params like ?search=...&status=...&page=...), replace
//   the placeholder state below with the real implementation.
//   See the "BACKEND TODO" comments throughout this file for
//   exactly what to change and where.
//
// BACKEND TODO (actions):
//   Each confirmed action should call your REST API:
//   PATCH /api/admin/reports/:reportId
//   Body: { action: "warn" | "dismiss" | "delete" | "restore" }
//
//   Expected backend behaviour per action:
//   ┌─────────────┬──────────────────────────────────────────────────────┐
//   │ warn        │ Set report.status = "warned"                         │
//   │             │ Send warning email/notification to creator           │
//   ├─────────────┼──────────────────────────────────────────────────────┤
//   │ dismiss     │ Set report.status = "dismissed"                      │
//   │             │ Prompt remains live — no action against creator      │
//   ├─────────────┼──────────────────────────────────────────────────────┤
//   │ delete      │ Set report.status = "deleted"                        │
//   │             │ Set prompt.isDeleted = true in prompts collection    │
//   │             │ Notify creator of removal                            │
//   ├─────────────┼──────────────────────────────────────────────────────┤
//   │ restore     │ Set report.status = "pending"                        │
//   │             │ If previously deleted: set prompt.isDeleted = false  │
//   └─────────────┴──────────────────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────
"use client";

import { useState, useCallback } from "react";
import SearchBar from "./SearchBar";
import StatusFilter from "./StatusFilter";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import ConfirmActionModal from "./ConfirmActionModal";
// ToastContainer  — the invisible mount point rendered once in the JSX below
// notify()        — imperative trigger called after each confirmed action
// No React state needed; react-toastify manages its own internal queue
import ToastContainer, { notify } from "./Toast";
import ReportCard from "./Reportcard ";
import StatsSummary from "./Statssummary ";

// ── Action configurations ──────────────────────────────────────
// Each key maps to the modal copy, the next status after
// confirmation, and the toast feedback shown afterwards.
// "nextStatus" is also what gets sent to the backend.
const ACTION_CONFIG = {
  warn: {
    title: "Warn creator",
    getMessage: (r) =>
      `Send a formal warning to ${r.creatorName} about "${r.title}"? They'll be notified and this report will be marked as warned.`,
    confirmText:  "Send warning",
    confirmColor: "warning",
    nextStatus:   "warned",
    toast: { message: "Warning sent to creator.", type: "warning" },
  },
  dismiss: {
    title: "Dismiss report",
    getMessage: (r) =>
      `Dismiss the report against "${r.title}"? The prompt stays visible and the report is archived.`,
    confirmText:  "Dismiss report",
    confirmColor: "neutral",
    nextStatus:   "dismissed",
    toast: { message: "Report dismissed.", type: "info" },
  },
  delete: {
    title: "Delete prompt",
    getMessage: (r) =>
      `Permanently remove "${r.title}" by ${r.creatorName}? The creator will be notified. This action is serious — confirm carefully.`,
    confirmText:  "Delete prompt",
    confirmColor: "danger",
    nextStatus:   "deleted",
    toast: { message: "Prompt deleted successfully.", type: "danger" },
  },
  restore: {
    title: "Restore to pending",
    getMessage: (r) =>
      `Restore the report for "${r.title}" back to pending for further review? If the prompt was deleted, it will be reinstated.`,
    confirmText:  "Restore",
    confirmColor: "success",
    nextStatus:   "pending",
    toast: { message: "Report restored to pending.", type: "success" },
  },
};

// ─────────────────────────────────────────────────────────────

export default function ReportsPage({ initialReports }) {
  // ── State: reports + modal (REAL) ───────────────────────────
  // Local copy of reports so optimistic UI updates work instantly
  // without waiting for a server round-trip.
  const [reports, setReports] = useState(initialReports);

  // Modal: null when closed; { report, action } when open
  const [modalConfig, setModalConfig] = useState(null);
  // No toast state here — react-toastify manages its own internal queue.
  // Toasts are triggered imperatively via notify() after each action.

  // ── State: search / filter / pagination (PLACEHOLDER ONLY) ──
  // These exist purely so <SearchBar>, <StatusFilter>, and
  // <Pagination> have something to bind to as controlled
  // components. Changing them does NOT filter `reports` below.
  //
  // BACKEND TODO: delete these placeholders once you implement
  // the real thing — most likely by moving these values into the
  // URL (useSearchParams / useRouter) and reading them server-side
  // in app/admin/reports/page.jsx instead of local React state.
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // BACKEND TODO: replace with the real total page count returned
  // by the backend (e.g. Math.ceil(totalCount / pageSize)).
  const totalPages = 1;

  // ── Handlers: search / filter / pagination (NO-OP) ──────────
  // These just update the placeholder state above so the inputs
  // are interactive/controlled — they don't trigger any filtering,
  // searching, or page changes on `reports`.
  //
  // BACKEND TODO: replace these with handlers that update the URL
  // query params (e.g. router.push(`?search=${val}`)) so the server
  // component can re-fetch the right slice of data.
  const handleSearchChange = useCallback((val) => {
    setSearch(val);
    // BACKEND TODO: trigger a new fetch / navigation here.
  }, []);

  const handleStatusChange = useCallback((val) => {
    setStatusFilter(val);
    // BACKEND TODO: trigger a new fetch / navigation here.
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // BACKEND TODO: trigger a new fetch / navigation here.
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setCurrentPage(1);
    // BACKEND TODO: reset URL query params here.
  }, []);

  // ── Handlers: admin actions (REAL) ───────────────────────────

  // Called by ReportCard when the user clicks an action button.
  // Opens the confirmation modal with the relevant copy.
  const handleActionRequest = useCallback((action, report) => {
    const cfg = ACTION_CONFIG[action];
    if (!cfg) return;
    setModalConfig({ action, report, cfg });
  }, []);

  // Called when the user confirms the action in the modal.
  // Applies the status change optimistically in local state, then
  // (in production) fires the API call in the background.
  const handleActionConfirm = useCallback(async () => {
    if (!modalConfig) return;
    const { action, report, cfg } = modalConfig;

    // ── Optimistic update ──────────────────────────────────────
    // Update local state immediately so the UI feels instant.
    setReports((prev) =>
      prev.map((r) =>
        r._id === report._id ? { ...r, status: cfg.nextStatus } : r
      )
    );

    // Close modal before async work so the UI doesn't freeze
    setModalConfig(null);

    // Trigger a react-toastify notification — no state setter needed.
    // notify() calls toast.success / toast.error / toast.warn / toast.info
    // based on cfg.toast.type, which maps to the right icon + colour.
    notify(cfg.toast.message, cfg.toast.type);

    // ── BACKEND TODO ───────────────────────────────────────────
    // Replace the block below with your real API call.
    // On failure: revert the optimistic update and show an error toast.
    //
    // try {
    //   await fetch(`/api/admin/reports/${report._id}`, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ action }),
    //   });
    // } catch (err) {
    //   // Revert optimistic update
    //   setReports((prev) =>
    //     prev.map((r) =>
    //       r._id === report._id ? { ...r, status: report.status } : r
    //     )
    //   );
    //   notify("Action failed. Please try again.", "danger");
    // }
    // ──────────────────────────────────────────────────────────

  }, [modalConfig]);

  // Called by ReportCard "View prompt" — navigate to the prompt page.
  // BACKEND TODO: replace with your actual prompt route.
  const handleViewPrompt = useCallback((promptId) => {
    // e.g. router.push(`/prompts/${promptId}`)
    console.info("[Admin] View prompt:", promptId);
  }, []);

  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Stats summary row ─────────────────────────────────── */}
      {/*
        StatsSummary receives the full `reports` array. Once
        pagination is real, `reports` here will only be the current
        page's worth of data — these counts will then be wrong.
        BACKEND TODO: fetch true totals separately (e.g.
        GET /api/admin/reports/stats) or pass them down from the
        server component as their own prop.
      */}
      <StatsSummary reports={reports} />

      {/* ── Toolbar: search + status filters (UI ONLY) ─────────── */}
      {/*
        BACKEND TODO: `value`/`onChange` below are bound to local
        placeholder state — typing here does not filter the list.
        Wire `handleSearchChange` / `handleStatusChange` to real
        logic (ideally via URL query params) per the notes above.
      */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-8 mb-4">
        <SearchBar value={search} onChange={handleSearchChange} />
        <StatusFilter value={statusFilter} onChange={handleStatusChange} />
      </div>

      {/* ── Result count label (UI ONLY) ──────────────────────── */}
      {/*
        BACKEND TODO: this currently just reflects the full,
        unfiltered `reports` length. Once the backend returns a
        real totalCount + page slice, base this label on that
        instead of `reports.length`.
      */}
      <p className="text-xs text-zinc-600 mb-4 tabular-nums">
        {reports.length === 0
          ? "No reports match your current filters."
          : `Showing ${reports.length} report${reports.length !== 1 ? "s" : ""}`}
      </p>

      {/* ── Report list or empty state ────────────────────────── */}
      {/*
        BACKEND TODO: `reports` is always the full unfiltered list
        right now. Once filtering/search/pagination are real, this
        should render just the current page's slice from the server.
      */}
      {reports.length === 0 ? (
        <EmptyState
          hasActiveFilters={search.trim() !== "" || statusFilter !== "all"}
          onClear={handleClearFilters}
        />
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          {reports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onAction={handleActionRequest}
              onView={handleViewPrompt}
            />
          ))}
        </div>
      )}

      {/* ── Pagination (UI ONLY) ──────────────────────────────── */}
      {/*
        BACKEND TODO: `totalPages` is hardcoded to 1 above, so this
        won't render at all until you supply a real value (see the
        `totalPages` placeholder near the top of this component).
      */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* ── Confirm action modal ──────────────────────────────── */}
      {/*
        Rendered outside the list so it isn't clipped by any
        overflow:hidden ancestor.
      */}
      <ConfirmActionModal
        isOpen={modalConfig !== null}
        config={modalConfig}
        onConfirm={handleActionConfirm}
        onClose={() => setModalConfig(null)}
      />

      {/* ── Toast container (react-toastify) ─────────────────── */}
      {/*
        Rendered once here so toasts are scoped to the admin reports
        section. Move this to app/layout.jsx if you want toasts
        available across the whole app.

        Actual toasts are triggered imperatively via notify() in
        handleActionConfirm above — no prop drilling needed.
      */}
      <ToastContainer />
    </>
  );
}