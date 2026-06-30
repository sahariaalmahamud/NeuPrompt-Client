"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRotateRight, ArrowDownToLine } from "@gravity-ui/icons";
import StatsCards from "./StatsCards";
import Toolbar from "./Toolbar";
import PaymentsTable from "./PaymentsTable";
import PaymentDetailsModal from "./PaymentDetailsModal";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function AdminPayments({ initialTransactions = [] }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // BACKEND INTEGRATION:
    // Call your refresh API here or revalidatePath
    // const newTransactions = await fetchLatestTransactions();
    // setTransactions(newTransactions);
    
    // Simulating network delay
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleExport = () => {
    // BACKEND INTEGRATION:
    // Trigger CSV export logic
    showToast("Exporting transactions to CSV...", "info");
  };

  const openDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`);
    } catch (err) {
      showToast("Failed to copy", "error");
    }
  };

  // LOCAL FILTERING & SORTING 
  // (Replace with server-side logic via URL params in the future if datasets get massive)
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.email.toLowerCase().includes(q));
    }

    if (planFilter !== "All") {
      result = result.filter(t => t.plan.toLowerCase() === planFilter.toLowerCase());
    }

    if (statusFilter !== "All") {
      result = result.filter(t => t.paymentStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    result.sort((a, b) => {
      switch (sortOrder) {
        case "Oldest": return new Date(a.createdAt) - new Date(b.createdAt);
        case "Highest Amount": return b.amount - a.amount;
        case "Lowest Amount": return a.amount - b.amount;
        case "Newest":
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [transactions, searchQuery, planFilter, statusFilter, sortOrder]);

  return (
    <div className="flex flex-col gap-8">
      
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white">
            Payment Management
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Manage, monitor, and review all premium subscription payments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-10 px-4 bg-[#0a0a0c] hover:bg-white/5 border border-white/10 text-zinc-300 font-medium rounded-xl transition-all flex items-center gap-2 outline-none focus:ring-1 focus:ring-white/20 disabled:opacity-50"
          >
            <ArrowRotateRight size={16} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
          <button 
            onClick={handleExport}
            className="h-10 px-4 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] outline-none focus:ring-2 focus:ring-white/50"
          >
            <ArrowDownToLine size={16} /> Export
          </button>
        </div>
      </motion.div>

      {/* ── Stats Cards ────────────────────────────────────────────────────── */}
      <StatsCards transactions={transactions} />

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <Toolbar 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        planFilter={planFilter} setPlanFilter={setPlanFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        sortOrder={sortOrder} setSortOrder={setSortOrder}
      />

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredAndSortedTransactions.length > 0 ? (
        <PaymentsTable 
          transactions={filteredAndSortedTransactions} 
          onOpenDetails={openDetails} 
          onCopy={handleCopy} 
        />
      ) : (
        <EmptyState />
      )}

      {/* ── Modal & Toasts ─────────────────────────────────────────────────── */}
      <PaymentDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        payment={selectedPayment} 
        onCopy={handleCopy}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[300] px-4 py-3 rounded-xl text-sm font-medium shadow-2xl max-w-xs ${
              toast.type === "error" ? "bg-red-600 text-white" : 
              toast.type === "info" ? "bg-zinc-800 text-white border border-white/10" : 
              "bg-emerald-600 text-white"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}