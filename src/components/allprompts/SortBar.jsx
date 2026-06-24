"use client";

import { Dropdown } from "@heroui/react";
import { ChevronDown, Sliders } from "@gravity-ui/icons";

const SORT_OPTIONS = ["Latest", "Most Popular", "Most Copied", "Highest Rated"];

export default function SortBar({ sortOption, onSortChange, onMobileFilterOpen }) {
  return (
    <div className="flex items-center justify-between lg:justify-end gap-4 w-full">
      
      {/* Mobile Filter Trigger */}
      <button 
        onClick={onMobileFilterOpen}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#0a0a0c] border border-white/10 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:border-white/20 transition-all"
      >
        <Sliders size={16} /> Filters
      </button>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500 hidden sm:block">Sort by:</span>
        <Dropdown>
          <Dropdown.Trigger>
            <div
              role="button"
              tabIndex={0}
              className="flex items-center justify-between gap-3 bg-[#0a0a0c] border border-white/10 rounded-xl h-10 px-4 text-sm font-medium text-zinc-300 hover:border-white/20 hover:bg-white/[0.02] transition-all min-w-[140px]"
            >
              {sortOption}
              <ChevronDown className="size-4 text-zinc-500" />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Popover className="bg-[#0a0a0c] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-xl w-[var(--trigger-width)]">
            <Dropdown.Menu onAction={(key) => onSortChange(key)} className="p-1">
              {SORT_OPTIONS.map(opt => (
                <Dropdown.Item key={opt} textValue={opt} className="hover:bg-white/5 rounded-lg transition-colors cursor-pointer p-2">
                  <span className={`text-sm block w-full ${sortOption === opt ? "text-blue-400 font-medium" : "text-zinc-300"}`}>
                    {opt}
                  </span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </div>
  );
}