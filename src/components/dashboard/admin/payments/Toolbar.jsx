"use client";

import { motion } from "framer-motion";
import { Magnifier } from "@gravity-ui/icons";
import { Input, Select, SelectItem } from "@heroui/react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Toolbar({ 
  searchQuery, setSearchQuery, 
  planFilter, setPlanFilter, 
  statusFilter, setStatusFilter, 
  sortOrder, setSortOrder 
}) {
  
  // HeroUI Strict Setup
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
      
      {/* Search Input */}
      <div className="w-full lg:max-w-md relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
          <Magnifier size={18} />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by email..."
          className="w-full h-11 pl-10 pr-4 bg-[#030303] border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
        />
      </div>

      {/* Native Select Filters (Keeping it lightweight and perfectly matching Lumen Edge) */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <select 
          value={planFilter} 
          onChange={(e) => setPlanFilter(e.target.value)}
          className="h-11 px-4 bg-[#030303] border border-white/10 rounded-xl text-sm text-zinc-300 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer min-w-[130px] shadow-inner"
        >
          <option value="All">All Plans</option>
          <option value="Premium">Premium</option>
          <option value="Pro">Pro</option>
          <option value="Enterprise">Enterprise</option>
        </select>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 px-4 bg-[#030303] border border-white/10 rounded-xl text-sm text-zinc-300 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer min-w-[130px] shadow-inner"
        >
          <option value="All">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="h-11 px-4 bg-[#030303] border border-white/10 rounded-xl text-sm text-zinc-300 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer min-w-[130px] shadow-inner"
        >
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
          <option value="Highest Amount">Highest Amount</option>
          <option value="Lowest Amount">Lowest Amount</option>
        </select>
      </div>

    </motion.div>
  );
}