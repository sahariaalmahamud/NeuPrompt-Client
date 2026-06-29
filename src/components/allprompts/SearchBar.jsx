"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Magnifier, Xmark } from "@gravity-ui/icons";

// ─── SearchBar ────────────────────────────────────────────────────────────────
// FIX: `InputGroup.Input` does not exist in HeroUI — it was silently rendering
//   nothing and breaking the controlled input, so typing had no effect and no
//   value was ever sent to the parent.
//   Replaced with a plain native <input> styled to match the existing design.
//
// The 400ms debounce lives in AllPrompts.jsx (useEffect cleanup), NOT here.
// SearchBar is a pure controlled component — it only manages:
//   • the clear (✕) button visibility
//   • focus management via ref
// ─────────────────────────────────────────────────────────────────────────────

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full"
    >
      {/* Search icon */}
      <Magnifier
        className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-zinc-500 pointer-events-none"
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        id="marketplace-search"
        type="text"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for prompts by title, keyword, or goal…"
        aria-label="Search prompts"
        autoComplete="off"
        className={`w-full h-14 pl-14 pr-12 bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10
          rounded-2xl text-base text-white placeholder:text-zinc-600 outline-none
          transition-all duration-200
          hover:border-white/20
          focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50`}
      />

      {/* Clear button — only rendered when input has a value */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center
            text-zinc-500 hover:text-white transition-colors rounded-lg
            outline-none focus:ring-1 focus:ring-white/20"
        >
          <Xmark className="size-4" aria-hidden="true" />
        </button>
      )}
    </motion.div>
  );
}