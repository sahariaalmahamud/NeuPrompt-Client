"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import SortBar from "./SortBar";
import FiltersSidebar from "./FiltersSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import PromptCard from "./PromptCard";
import MarketplacePagination from "./MarketplacePagination";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

export default function AllPrompts({allprompts }) {
  // ---------------------------------------------------------------------------
  // BACKEND INTEGRATION NOTES:
  // For production, replace these local states with next/navigation useSearchParams.
  // When a filter changes, push the new URL params (e.g., ?category=Coding&sort=Latest)
  // and let the Server Component re-fetch, OR use SWR/React Query to fetch client-side.
  // ---------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Latest");
  const [filters, setFilters] = useState({
    aiTool: "All",
    category: "All",
    difficulty: "All",
  });
  const [page, setPage] = useState(1);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Used to show skeletons during fetch

  // Local filter handlers (To be replaced by API calls)
  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setPage(1);
    // TODO: Trigger backend API fetch here
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    // TODO: Trigger backend API fetch here with debounce
  };

  const handleSort = (option) => {
    setSortOption(option);
    setPage(1);
    // TODO: Trigger backend API fetch here
  };

  const totalPages = 12; // TODO: Calculate from backend total count

  return (
    <div className="flex flex-col gap-8">
      
      {/* Search Bar (Top) */}
      <div className="w-full max-w-2xl mx-auto mb-4">
        <SearchBar value={searchQuery} onChange={handleSearch} />
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-6">
          <FiltersSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Mobile Filters Trigger & Drawer */}
        <MobileFilterDrawer 
          isOpen={isMobileDrawerOpen} 
          setIsOpen={setIsMobileDrawerOpen}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Right Content Area */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-6">
          
          {/* Sort & Mobile Trigger Bar */}
          <SortBar 
            sortOption={sortOption} 
            onSortChange={handleSort} 
            onMobileFilterOpen={() => setIsMobileDrawerOpen(true)}
          />

          {/* Prompt Grid Area */}
          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : allprompts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allprompts.map((prompt) => (
                  <PromptCard key={prompt._id} prompt={prompt} />
                ))}
              </div>
              
              {/* Pagination Area */}
              <div className="mt-12 w-full flex justify-center border-t border-white/5 pt-8">
                <MarketplacePagination 
                  currentPage={page} 
                  totalPages={totalPages} 
                  onPageChange={(p) => {
                    setPage(p);
                    // TODO: Trigger backend API fetch for new page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                />
              </div>
            </>
          ) : (
            <EmptyState onClearFilters={() => {
              setSearchQuery("");
              setFilters({ aiTool: "All", category: "All", difficulty: "All" });
            }}/>
          )}

        </div>
      </div>
    </div>
  );
}