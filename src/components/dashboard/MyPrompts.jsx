"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Magnifier,
  Pencil,
  TrashBin,
  Eye,
  FolderMagnifier,
  Star,
  Xmark,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "@gravity-ui/icons";
import UpdatePromptForm from "./forms/UpdatePromptForm";

// ─── Badge components ─────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const styles = {
    pending:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  );
}

function VisibilityBadge({ visibility }) {
  const isPublic = visibility === "Public";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider
      ${isPublic ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}>
      {visibility}
    </span>
  );
}

// ─── Portal Modal ─────────────────────────────────────────────────────────────
// Using a plain div portal pattern — no broken HeroUI Modal compound API

function EditModal({ isOpen, onClose, prompt }) {
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !prompt) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Edit prompt"
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Sheet on mobile, centred card on sm+ */}
      <div className="relative w-full sm:max-w-2xl lg:max-w-3xl bg-[#0a0a0c] border-t sm:border border-white/[0.08] sm:rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex flex-col max-h-[92dvh] sm:max-h-[85vh]">

        {/* Drag handle (mobile only) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-white/10 rounded-full" />
        </div>

        {/* Top accent */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white">Edit Prompt</h2>
            <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[260px] sm:max-w-[400px]">{prompt.title}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close edit modal"
            className="size-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors outline-none focus:ring-1 focus:ring-white/20"
          >
            <Xmark className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5">
          <UpdatePromptForm prompt={prompt} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}

// ─── Delete confirmation ──────────────────────────────────────────────────────

function DeleteConfirmModal({ isOpen, onClose, onConfirm, promptTitle }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm deletion"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0a0a0c] border border-white/[0.08] rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="size-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <TrashBin className="size-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-semibold text-white mb-1">Delete Prompt?</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-zinc-200 font-medium">"{promptTitle}"</span> will be permanently removed. This can't be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-1">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasSearch, query }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-14 rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center justify-center mb-4">
          <Magnifier className="size-6 text-zinc-500" aria-hidden="true" />
        </div>
        <p className="text-white font-medium mb-1">No results for "{query}"</p>
        <p className="text-sm text-zinc-500">Try a different title, category, or AI tool.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
        <FolderMagnifier className="size-7 text-blue-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No prompts yet</h3>
      <p className="text-sm text-zinc-400 max-w-xs leading-relaxed mb-6">
        You haven't published any prompts. Create your first one to start building your portfolio.
      </p>
      <Link
        href="/dashboard/creator/add-prompt"
        className="inline-flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
      >
        <Plus className="size-4" aria-hidden="true" />
        Create first prompt
      </Link>
    </div>
  );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

function ActionButton({ onClick, href, label, variant = "default", children }) {
  const base = "size-8 rounded-lg flex items-center justify-center transition-all duration-150 outline-none focus:ring-1";
  const variants = {
    default: `${base} text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10 focus:ring-white/20`,
    edit:    `${base} text-blue-400 bg-blue-500/10 hover:text-blue-300 hover:bg-blue-500/20 focus:ring-blue-500/30`,
    danger:  `${base} text-red-400 bg-red-500/10 hover:text-red-300 hover:bg-red-500/20 focus:ring-red-500/30`,
  };
  if (href) {
    return (
      <Link href={href} className={variants[variant]} title={label} aria-label={label}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={variants[variant]} title={label} aria-label={label}>
      {children}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

export default function MyPrompts({ prompts = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredPrompts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.aiTool.toLowerCase().includes(q)
    );
  }, [searchQuery, prompts]);

  const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE));

  const paginatedPrompts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPrompts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPrompts, page]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    console.log("Delete triggered for Prompt ID:", id);
    setDeleteTarget(null);
    // TODO: call actual API
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!prompts.length) {
    return (
      <div className="w-full bg-[#0a0a0c]/60 border border-white/5 rounded-2xl">
        <EmptyState hasSearch={false} />
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-4 sm:gap-5">

        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Magnifier
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              defaultValue={searchQuery}
              onChange={handleSearch}
              placeholder="Search by title, category, or tool…"
              aria-label="Search prompts"
              className={`w-full h-10 pl-9 pr-4 bg-[#0a0a0c] border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 outline-none transition-all
                focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-white/15`}
            />
          </div>

          {/* Result count */}
          <span className="text-xs text-zinc-500 shrink-0 hidden sm:inline-block">
            {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
          </span>

          <div className="ml-auto">
            <Link
              href="/dashboard/creator/add-prompt"
              aria-label="Create new prompt"
              className="inline-flex items-center gap-2 h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">New Prompt</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>

        {/* ── Table card ───────────────────────────────────────────────────── */}
        <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">

          {filteredPrompts.length === 0 ? (
            <EmptyState hasSearch query={searchQuery} />
          ) : (
            <>
              {/* ── Desktop / Tablet table (≥640px) ──────────────────────── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left" role="table" aria-label="My prompts">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                      {[
                        { label: "Title",      align: "left",   w: "w-[35%]" },
                        { label: "AI Tool",    align: "left",   w: "" },
                        { label: "Visibility", align: "left",   w: "" },
                        { label: "Status",     align: "left",   w: "" },
                        { label: "Copies",     align: "center", w: "w-16" },
                        { label: "Rating",     align: "center", w: "w-16" },
                        { label: "Actions",    align: "right",  w: "w-28" },
                      ].map((col) => (
                        <th
                          key={col.label}
                          scope="col"
                          className={`px-5 py-3.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest select-none ${col.w} text-${col.align}`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.04]">
                    {paginatedPrompts.map((prompt) => (
                      <tr
                        key={prompt._id}
                        className="group hover:bg-white/[0.02] transition-colors duration-150"
                      >
                        {/* Title */}
                        <td className="px-5 py-4" aria-label={`Prompt title: ${prompt.title}`}>
                          <div className="flex items-center gap-3">
                            {prompt.thumbnail && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={prompt.thumbnail}
                                alt=""
                                aria-hidden="true"
                                className="size-8 rounded-lg object-cover shrink-0 opacity-80"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate max-w-[200px] lg:max-w-[260px]">
                                {prompt.title}
                              </p>
                              <p className="text-[11px] text-zinc-500 mt-0.5">{prompt.category}</p>
                            </div>
                          </div>
                        </td>

                        {/* AI Tool */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-zinc-300">{prompt.aiTool}</span>
                        </td>

                        {/* Visibility */}
                        <td className="px-5 py-4">
                          <VisibilityBadge visibility={prompt.visibility} />
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusBadge status={prompt.status} />
                        </td>

                        {/* Copies */}
                        <td className="px-5 py-4 text-center">
                          <span className="text-sm font-mono text-zinc-400">{prompt.copyCount ?? 0}</span>
                        </td>

                        {/* Rating */}
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <Star className="size-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                            <span className="text-sm font-mono text-zinc-300">
                              {prompt.rating ? prompt.rating.toFixed(1) : "—"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <ActionButton
                              href={`/prompts/${prompt._id}`}
                              label={`View "${prompt.title}"`}
                              variant="default"
                            >
                              <Eye className="size-3.5" aria-hidden="true" />
                            </ActionButton>
                            <ActionButton
                              onClick={() => setEditTarget(prompt)}
                              label={`Edit "${prompt.title}"`}
                              variant="edit"
                            >
                              <Pencil className="size-3.5" aria-hidden="true" />
                            </ActionButton>
                            <ActionButton
                              onClick={() => setDeleteTarget(prompt)}
                              label={`Delete "${prompt.title}"`}
                              variant="danger"
                            >
                              <TrashBin className="size-3.5" aria-hidden="true" />
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile card list (<640px) ────────────────────────────── */}
              <div className="sm:hidden divide-y divide-white/[0.05]">
                {paginatedPrompts.map((prompt) => (
                  <article key={prompt._id} className="p-4 flex flex-col gap-3">
                    {/* Top row */}
                    <div className="flex items-start gap-3">
                      {prompt.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prompt.thumbnail}
                          alt=""
                          aria-hidden="true"
                          className="size-10 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight truncate">{prompt.title}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{prompt.category} · {prompt.aiTool}</p>
                      </div>
                    </div>

                    {/* Badges + stats row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={prompt.status} />
                      <VisibilityBadge visibility={prompt.visibility} />
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-zinc-400">
                        <Star className="size-3 text-amber-400" aria-hidden="true" />
                        {prompt.rating ? prompt.rating.toFixed(1) : "—"}
                        <span className="text-zinc-600 mx-1">·</span>
                        {prompt.copyCount ?? 0} copies
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                      <ActionButton
                        href={`/prompts/${prompt._id}`}
                        label={`View "${prompt.title}"`}
                        variant="default"
                      >
                        <Eye className="size-3.5" aria-hidden="true" />
                      </ActionButton>
                      <button
                        onClick={() => setEditTarget(prompt)}
                        aria-label={`Edit "${prompt.title}"`}
                        className="flex-1 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(prompt)}
                        aria-label={`Delete "${prompt.title}"`}
                        className="h-8 px-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* ── Pagination ───────────────────────────────────────────── */}
              {totalPages > 1 && (
                <div className="border-t border-white/[0.05] px-5 py-3 flex items-center justify-between gap-4 bg-[#080808]">
                  <span className="text-xs text-zinc-500 shrink-0">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      aria-label="Previous page"
                      className="size-8 rounded-lg flex items-center justify-center text-zinc-400 border border-white/8 hover:border-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>

                    {/* Page numbers — show up to 5 */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                      .reduce((acc, n, idx, arr) => {
                        if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…");
                        acc.push(n);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "…" ? (
                          <span key={`ellipsis-${idx}`} className="size-8 flex items-center justify-center text-xs text-zinc-600">
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => setPage(item)}
                            aria-label={`Go to page ${item}`}
                            aria-current={page === item ? "page" : undefined}
                            className={`size-8 rounded-lg text-xs font-medium transition-all border
                              ${page === item
                                ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                                : "text-zinc-400 border-white/8 hover:border-white/15 hover:text-white"
                              }`}
                          >
                            {item}
                          </button>
                        )
                      )}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      aria-label="Next page"
                      className="size-8 rounded-lg flex items-center justify-center text-zinc-400 border border-white/8 hover:border-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <EditModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        prompt={editTarget}
      />
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?._id)}
        promptTitle={deleteTarget?.title}
      />
    </>
  );
}