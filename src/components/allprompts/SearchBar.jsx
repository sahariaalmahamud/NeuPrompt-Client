"use client";

import { InputGroup } from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";
import { motion } from "framer-motion";

export default function SearchBar({ value, onChange }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <InputGroup className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 rounded-2xl px-5 h-14 flex items-center gap-3 transition-all shadow-inner">
        <Magnifier className="text-zinc-500" size={20} />
        <InputGroup.Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for prompts by keyword, tool, or goal..." 
          className="w-full bg-transparent text-white outline-none placeholder:text-zinc-600 text-base"
        />
      </InputGroup>
    </motion.div>
  );
}