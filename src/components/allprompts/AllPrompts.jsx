"use client";

import { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import SortBar from "./SortBar";
import FiltersSidebar from "./FiltersSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import PromptCard from "./PromptCard";
import MarketplacePagination from "./MarketplacePagination";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

// ─── AllPrompts ───────────────────────────────────────────────────────────────
//
// Receives server-rendered initial data as props (no loading flash on first paint).
// After that, every filter/sort/page/search change fetches from the backend.
//
// BACKEND INTEGRATION:
//   Endpoint: GET /api/prompts
//   Params:   search, category, aiTool, difficulty, sort, page, limit
//   Response: { prompts, total, currentPage, totalPages }
//
// Do NOT use React Query / SWR / Zustand / Context API.
// ─────────────────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 9; // Keep in sync with backend `limit` default

const DEFAULT_FILTERS = {
  search: "",
  category: "All",
  aiTool: "All",
  difficulty: "All",
  sort: "Latest",
  page: 1,
};

export default function AllPrompts({
  allprompts = [],
  initialTotal = 0,
  initialTotalPages = 1,
}) {
  // ── Data state — seeded from server props ────────────────────────────────
  const [prompts, setPrompts] = useState(allprompts);
  const [pagination, setPagination] = useState({
    total: initialTotal,
    currentPage: 1,
    totalPages: initialTotalPages,
  });

  // ── Filter state (single source of truth for all controls) ──────────────
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // ── Refs for debounce & mount detection ──────────────────────────────────
  const isMounted = useRef(false); // skip fetch on first render (use server data)
  const prevSearchRef = useRef("");    // detect when search specifically changed

  // ─────────────────────────────────────────────────────────────────────────
  // SINGLE useEffect — watches the entire filters object.
  //
  // Search:       debounced 400ms (avoids a request on every keystroke)
  // Everything else: immediate (category, aiTool, difficulty, sort, page)
  //
  // AbortController: cancels in-flight request if filters change again before
  //   the response arrives (prevents stale data overwriting fresh results).
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Skip the very first render — use the server-side rendered data instead
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const searchChanged = filters.search !== prevSearchRef.current;
    prevSearchRef.current = filters.search;
    const delay = searchChanged ? 400 : 0; // debounce only for search

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);

      // Build query string — omit "All" values and empty strings
      const params = new URLSearchParams({
        sort: filters.sort,
        page: String(filters.page),
        limit: String(ITEMS_PER_PAGE),
      });
      if (filters.search) params.set("search", filters.search);
      if (filters.category !== "All") params.set("category", filters.category);
      if (filters.aiTool !== "All") params.set("aiTool", filters.aiTool);
      if (filters.difficulty !== "All") params.set("difficulty", filters.difficulty);

      // BACKEND INTEGRATION POINT:
      //   Replace "/api/prompts" with your actual endpoint if the Express server
      //   runs on a different origin (e.g. process.env.NEXT_PUBLIC_API_URL + "/api/prompts").
      //   Ensure CORS is configured on the Express server for this origin.
      try {
        // const res = await fetch(`/api/prompts?${params.toString()}`, {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/prompts?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const data = await res.json();

        setPrompts(data.prompts ?? []);
        setPagination({
          total: data.total ?? 0,
          currentPage: data.currentPage ?? 1,
          totalPages: data.totalPages ?? 1,
        });
      } catch (err) {
        // AbortError is expected when the effect cleans up — not a real error
        if (err.name !== "AbortError") {
          console.error("[AllPrompts] fetch error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, delay);

    // Cleanup: cancel pending timer AND in-flight request
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters]); // single dependency — entire filters object

  // ── Handler: any sidebar filter (category, aiTool, difficulty) ───────────
  // Reset to page 1 on every filter change.
  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value, page: 1 }));
  };

  // ── Handler: search bar input ────────────────────────────────────────────
  // Sets search in state; the 400ms debounce lives in the useEffect above.
  const handleSearch = (query) => {
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));
  };

  // ── Handler: sort select ─────────────────────────────────────────────────
  const handleSort = (option) => {
    setFilters((prev) => ({ ...prev, sort: option, page: 1 }));
  };

  // ── Handler: pagination ──────────────────────────────────────────────────
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Handler: clear all filters ───────────────────────────────────────────
  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — Do NOT modify layout/styling (requirement)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8">

      {/* Search Bar (Top) */}
      <div className="w-full max-w-2xl mx-auto mb-4">
        <SearchBar value={filters.search} onChange={handleSearch} />
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Desktop Sidebar — sticky so it stays visible while scrolling */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-6">
          <FiltersSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Mobile filter drawer */}
        <MobileFilterDrawer
          isOpen={isMobileDrawerOpen}
          setIsOpen={setIsMobileDrawerOpen}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Right content area */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-6">

          {/* Sort bar + mobile filter trigger */}
          <SortBar
            sortOption={filters.sort}
            onSortChange={handleSort}
            onMobileFilterOpen={() => setIsMobileDrawerOpen(true)}
            // Pass result count so SortBar can display "X prompts found"
            resultCount={isLoading ? null : pagination.total}
          />

          {/* Content area: skeleton → grid → empty state */}
          {isLoading ? (
            <LoadingSkeleton count={ITEMS_PER_PAGE} />
          ) : prompts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {prompts.map((prompt) => (
                  <PromptCard key={prompt._id} prompt={prompt} />
                ))}
              </div>

              {/* Pagination — totalPages now comes from backend response */}
              <div className="mt-12 w-full flex justify-center border-t border-white/5 pt-8">
                <MarketplacePagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <EmptyState onClearFilters={handleClearFilters} />
          )}

        </div>
      </div>
    </div>
  );
}