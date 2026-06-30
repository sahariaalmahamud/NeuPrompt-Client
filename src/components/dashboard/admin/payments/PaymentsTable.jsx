"use client";

import { motion } from "framer-motion";
import { Eye, Copy } from "@gravity-ui/icons";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

export const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() || 'pending';
  if (s === 'paid' || s === 'succeeded') return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">Paid</span>;
  if (s === 'failed') return <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">Failed</span>;
  return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">Pending</span>;
};

export const PlanBadge = ({ plan }) => {
  const p = plan?.toLowerCase() || 'premium';
  if (p === 'enterprise') return <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">Enterprise</span>;
  if (p === 'pro') return <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">Pro</span>;
  return <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider rounded-md">Premium</span>;
};

export default function PaymentsTable({ transactions, onOpenDetails, onCopy }) {
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatCurrency = (amount, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount);
  const truncate = (str, len = 12) => str?.length > len ? str.slice(0, len) + "..." : str;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
      
      {/* ── Desktop Table ──────────────────────────────────────────────────── */}
      <div className="hidden md:block w-full bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Transaction ID</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">User Email</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Plan</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-right">Date</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <motion.tr variants={fadeUp} key={tx._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-zinc-300">{truncate(tx._id, 12)}</span>
                      <button onClick={() => onCopy(tx._id, "Transaction ID")} className="text-zinc-600 hover:text-white transition-colors"><Copy size={14}/></button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-200 font-medium">{tx.email}</td>
                  <td className="px-6 py-4"><PlanBadge plan={tx.plan} /></td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-white">{formatCurrency(tx.amount, tx.currency)}</span>
                    <span className="text-[10px] text-zinc-500 ml-1 uppercase">{tx.currency}</span>
                  </td>
                  <td className="px-6 py-4 text-center"><StatusBadge status={tx.paymentStatus} /></td>
                  <td className="px-6 py-4 text-sm text-zinc-400 text-right">{formatDate(tx.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onOpenDetails(tx)}
                      className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg transition-colors opacity-70 group-hover:opacity-100 outline-none focus:ring-1 focus:ring-blue-500/50"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ───────────────────────────────────────────────────── */}
      <div className="flex flex-col md:hidden gap-4">
        {transactions.map((tx) => (
          <motion.div variants={fadeUp} key={tx._id} className="bg-[#0a0a0c]/80 border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white truncate">{tx.email}</span>
                <span className="text-[11px] font-mono text-zinc-500 mt-0.5">{truncate(tx._id, 12)}</span>
              </div>
              <div className="shrink-0"><StatusBadge status={tx.paymentStatus} /></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-[#030303] border border-white/5 rounded-xl p-4 shadow-inner">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-zinc-500 tracking-widest font-semibold">Plan</span>
                <div><PlanBadge plan={tx.plan} /></div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-zinc-500 tracking-widest font-semibold">Amount</span>
                <span className="text-sm font-bold text-white">{formatCurrency(tx.amount, tx.currency)} <span className="text-[10px] text-zinc-500 uppercase">{tx.currency}</span></span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs text-zinc-400">{formatDate(tx.createdAt)}</span>
              <button 
                onClick={() => onOpenDetails(tx)}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
              >
                <Eye size={14} /> View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}