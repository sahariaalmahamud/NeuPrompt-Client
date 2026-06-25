"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import FiltersBar from "./FiltersBar";
import PromptsTable from "./PromptsTable";
import ApprovePromptModal from "./ApprovePromptModal";
import RejectPromptModal from "./RejectPromptModal";
import DeletePromptModal from "./DeletePromptModal";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

// ─── AdminAllPrompts ──────────────────────────────────────────────────────────
// Main client orchestrator for the admin prompts page.
//
// BACKEND INTEGRATION POINTS are marked with "BACKEND INTEGRATION:" comments.
// Current state management is UI-only — no real API calls are made.
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminAllPrompts({ allPrompts }) {

  // ── Data state ──────────────────────────────────────────────────────────────
  const [prompts, setPrompts] = useState(allPrompts ?? []);
  const [isLoading, setIsLoading] = useState(false);

  // ── Search state ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");

  // ── Filter state ────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    status: "All",
    visibility: "All",
    featured: "All",
  });

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSearch = (query) => {
    setSearchQuery(query);
    // BACKEND INTEGRATION:
    //   Debounce this by 300 ms, then:
    //   GET /api/admin/prompts?search=${query}&status=${filters.status}&...
    //   setPrompts(response.prompts); setIsLoading appropriately.
  };

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    // BACKEND INTEGRATION:
    //   GET /api/admin/prompts?status=${next.status}&visibility=${next.visibility}&featured=${next.featured}&search=${searchQuery}
    //   setPrompts(response.prompts); reset page to 1.
  };

  const openModal = (type, prompt) => {
    setSelectedPrompt(prompt);
    if (type === "approve") setIsApproveOpen(true);
    if (type === "reject") setIsRejectOpen(true);
    if (type === "delete") setIsDeleteOpen(true);
  };

  const handleToggleFeature = (promptId, currentFeatured) => {
    // BACKEND INTEGRATION:
    //   PATCH /api/admin/prompts/${promptId}/feature  body: { featured: !currentFeatured }
    //   On success: update the list.
    // Optimistic UI update:
    setPrompts((prev) =>
      prev.map((p) => p._id === promptId ? { ...p, featured: !currentFeatured } : p)
    );
  };

  const hasSearch = !!searchQuery.trim();

  return (
    <div className="flex flex-col gap-5">

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className={`flex flex-col lg:flex-row gap-4 lg:items-end justify-between
        bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4
        shadow-[0_8px_30px_rgba(0,0,0,0.4)]`}>
        <SearchBar value={searchQuery} onChange={handleSearch} />
        <FiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : prompts.length > 0 ? (
        <PromptsTable
          prompts={prompts}
          onOpenModal={openModal}
          onToggleFeature={handleToggleFeature}
        />
      ) : (
        <EmptyState hasSearch={hasSearch} query={searchQuery} />
      )}

      {/* ── Modals (rendered outside the table to avoid nesting issues) ───────── */}
      <ApprovePromptModal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        prompt={selectedPrompt}
      />
      <RejectPromptModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        prompt={selectedPrompt}
      />
      <DeletePromptModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        prompt={selectedPrompt}
      />
    </div>
  );
}