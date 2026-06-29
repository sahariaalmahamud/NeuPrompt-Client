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

const ITEMS_PER_PAGE = 9;

export default function AllPrompts({
  allprompts = [],
  initialTotal = 0,
  initialTotalPages = 1,
  initialSearch = "",
}) {
  const [filters, setFilters] = useState({
    search: initialSearch,
    category: "All",
    aiTool: "All",
    difficulty: "All",
    sort: "Latest",
    page: 1,
  });

  const [prompts, setPrompts] = useState(allprompts);
  const [pagination, setPagination] = useState({
    total: initialTotal,
    currentPage: 1,
    totalPages: initialTotalPages,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Track whether this is the very first render
  const isFirstRender = useRef(true);
  const prevSearchRef = useRef(initialSearch);

  useEffect(() => {
    setFilters((prev) => {
      if (prev.search === initialSearch) return prev;
      return { ...prev, search: initialSearch, page: 1 };
    });
  }, [initialSearch]);

  useEffect(() => {
    // On first render: skip ONLY if there's no initialSearch
    // (server already fetched the correct data).
    // If initialSearch is present, we still skip because the server
    // fetched filtered data via getAllPrompts({ search: initialSearch }).
    // But if allprompts came back empty/wrong, flip this to always run.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const searchChanged = filters.search !== prevSearchRef.current;
    prevSearchRef.current = filters.search;
    const delay = searchChanged ? 400 : 0;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);

      const params = new URLSearchParams({
        sort: filters.sort,
        page: String(filters.page),
        limit: String(ITEMS_PER_PAGE),
      });
      if (filters.search) params.set("search", filters.search);
      if (filters.category !== "All") params.set("category", filters.category);
      if (filters.aiTool !== "All") params.set("aiTool", filters.aiTool);
      if (filters.difficulty !== "All") params.set("difficulty", filters.difficulty);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/prompts?${params}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data = await res.json();
        setPrompts(data.prompts ?? []);
        setPagination({
          total: data.total ?? 0,
          currentPage: data.currentPage ?? 1,
          totalPages: data.totalPages ?? 1,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("[AllPrompts] fetch error:", err);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters]);

  const handleFilterChange = (type, value) =>
    setFilters((prev) => ({ ...prev, [type]: value, page: 1 }));

  const handleSearch = (query) =>
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));

  const handleSort = (option) =>
    setFilters((prev) => ({ ...prev, sort: option, page: 1 }));

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () =>
    setFilters({
      search: "",
      category: "All",
      aiTool: "All",
      difficulty: "All",
      sort: "Latest",
      page: 1,
    });

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full max-w-2xl mx-auto mb-4">
        <SearchBar value={filters.search} onChange={handleSearch} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="hidden lg:block w-64 shrink-0 sticky top-6">
          <FiltersSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <MobileFilterDrawer
          isOpen={isMobileDrawerOpen}
          setIsOpen={setIsMobileDrawerOpen}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
          <SortBar
            sortOption={filters.sort}
            onSortChange={handleSort}
            onMobileFilterOpen={() => setIsMobileDrawerOpen(true)}
            resultCount={isLoading ? null : pagination.total}
          />

          {isLoading ? (
            <LoadingSkeleton count={ITEMS_PER_PAGE} />
          ) : prompts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {prompts.map((prompt) => (
                  <PromptCard key={prompt._id} prompt={prompt} />
                ))}
              </div>
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