// components/dashboard/admin/reports/ReportCard.jsx
// ─────────────────────────────────────────────────────────────
// CLIENT COMPONENT — renders a single report as a rich card.
//
// Why a card instead of a table row?
//   The original code used HeroUI <Table> which requires at least
//   one <Column isRowHeader> — omitting it throws:
//     "A table must have at least one Column with the isRowHeader
//      prop set to true"
//   Beyond fixing that error, a card layout is a better fit here:
//   reports need a description, thumbnail, contextual action
//   buttons, and a status badge — too much for a table row.
//
// ACTION LOGIC — which buttons are shown per status:
// ┌─────────────┬──────────────────────────────────────────────┐
// │ pending     │ Warn creator · Dismiss · Delete prompt       │
// │ warned      │ Dismiss · Delete prompt · Restore to pending │
// │ dismissed   │ Warn creator · Delete prompt · Restore       │
// │ deleted     │ Restore to pending only                      │
// └─────────────┴──────────────────────────────────────────────┘
// "View prompt" is always available regardless of status.
// ─────────────────────────────────────────────────────────────
"use client";

import Image from "next/image";
import StatusBadge from "./StatusBadge";

// ── Reason → visual style mapping ─────────────────────────────
// Maps free-text reasons to a colour token so the badge is
// consistently colour-coded even if the wording varies slightly.
const REASON_STYLES = {
  "copyright violation": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "harmful content":     "bg-red-500/10 text-red-400 border-red-500/20",
  "low quality":         "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  spam:                  "bg-orange-500/10 text-orange-400 border-orange-500/20",
  misinformation:        "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function reasonStyle(reason) {
  return (
    REASON_STYLES[reason.toLowerCase()] ??
    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  );
}

// ── Action button definitions per status ──────────────────────
function getActions(status) {
  // Each action object:
  //   key    — passed to onAction() so the parent knows what was clicked
  //   label  — button text
  //   style  — Tailwind classes for colour
  const warn = {
    key:   "warn",
    label: "Warn creator",
    style: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
  };
  const dismiss = {
    key:   "dismiss",
    label: "Dismiss",
    style: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20",
  };
  const deletePr = {
    key:   "delete",
    label: "Delete prompt",
    style: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
  };
  const restore = {
    key:   "restore",
    label: "Restore",
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
  };

  switch (status) {
    case "pending":   return [warn, dismiss, deletePr];
    case "warned":    return [dismiss, deletePr, restore];
    case "dismissed": return [warn, deletePr, restore];
    case "deleted":   return [restore];
    default:          return [];
  }
}

// ── Date formatter ─────────────────────────────────────────────
function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year:  "numeric",
      month: "short",
      day:   "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ─────────────────────────────────────────────────────────────

export default function ReportCard({ report, onAction, onView }) {
  const {
    _id,
    promptId,
    prompt,
    creator,
    reporter,
    promptThumbnail,
    reporterName,
    creatorName,
    reason,
    description,
    status,
    createdAt,
  } = report;

  const displayTitle = prompt?.title ?? title ?? "Untitled prompt";
  const displayReason = reason ?? "Unknown";
  const displayCreatorName = creator?.name ?? creatorName ?? "Unknown";
  const displayReporterName = reporter?.name ?? reporterName ?? "Unknown";
  const thumbnailUrl = prompt?.thumbnail ?? promptThumbnail;
  const titleInitial = displayTitle.trim().charAt(0).toUpperCase() || "?";

  const actions = getActions(status);

  return (
    <article
      // role="article" is implicit for <article> but kept explicit for clarity
      className="group bg-[#0a0a0c] border border-white/[0.07] rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/[0.13]"
    >
      {/* ── Top section: thumbnail + core meta ─────────────────── */}
      <div className="flex gap-3 sm:gap-4 p-4 sm:p-5">

        {/* Prompt thumbnail */}
        <div className="relative flex-shrink-0 w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.06]">
          {promptThumbnail ? (
            <Image
              src={promptThumbnail}
              alt={`Thumbnail for "${displayTitle}"`}
              fill
              sizes="72px"
              className="object-cover"
              // Falls back gracefully if the image URL is broken
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            // Initials fallback when no thumbnail is available
            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-bold">
              {titleInitial}
            </div>
          )}
        </div>

        {/* Title, reason badge, and status badge */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="text-[15px] sm:text-base font-semibold text-white leading-snug line-clamp-2 sm:line-clamp-1"
              title={displayTitle}
            >
              {displayTitle}
            </h3>
            {/* Status badge — top-right of the card header */}
            <StatusBadge status={status} />
          </div>

          {/* Reason badge */}
          <span
            className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border ${reasonStyle(displayReason)}`}
          >
            {displayReason}
          </span>
        </div>
      </div>

      {/* ── Report description ──────────────────────────────────── */}
      <p
        className="px-4 sm:px-5 text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-3"
      >
        {description}
      </p>

      {/* ── Meta row: reporter, creator, date ──────────────────── */}
      {/*
        Uses a responsive flex-wrap so on very narrow phones the items
        wrap to two lines rather than overflowing.
      */}
      <div
        className="px-4 sm:px-5 pb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-zinc-600"
      >
        <span>
          <span className="text-zinc-500 font-medium">Reporter: </span>
          {displayReporterName}
        </span>
        <span>
          <span className="text-zinc-500 font-medium">Creator: </span>
          {displayCreatorName}
        </span>
        <span>
          <span className="text-zinc-500 font-medium">Filed: </span>
          {formatDate(createdAt)}
        </span>
      </div>

      {/* ── Action bar ──────────────────────────────────────────── */}
      {/*
        Separated from the body by a subtle divider.
        "View prompt" is rendered separately on the right so it
        stays visually distinct from the moderation actions.
      */}
      <div
        className="px-4 sm:px-5 py-3 border-t border-white/[0.05] flex flex-wrap items-center gap-2"
      >
        {/* Moderation actions (left-aligned) */}
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => onAction(action.key, report)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-[11px] sm:text-xs font-semibold border
                        transition-colors duration-150 cursor-pointer
                        ${action.style}`}
          >
            {action.label}
          </button>
        ))}

        {/* View prompt — always visible, right-aligned via ml-auto */}
        {/*
          BACKEND TODO: replace onClick with:
          router.push(`/prompts/${promptId}`)
          or open in a new tab:
          window.open(`/prompts/${promptId}`, "_blank", "noopener")
        */}
        <button
          onClick={() => onView(promptId)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium border border-white/[0.08] text-zinc-500 hover:text-white hover:border-white/20 transition-colors duration-150 cursor-pointer"
          aria-label={`View prompt: ${displayTitle}`}
        >
          View prompt
          {/* External link indicator */}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </article>
  );
}