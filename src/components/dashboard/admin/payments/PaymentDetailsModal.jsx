"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Xmark, Copy } from "@gravity-ui/icons";
import { StatusBadge, PlanBadge } from "./PaymentsTable";

export default function PaymentDetailsModal({ isOpen, onClose, payment, onCopy }) {
  const [isMounted, setIsMounted] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isMounted || !payment) return null;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const formatCurrency = (amount, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount);

  const CopyRow = ({ label, value, title }) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-center justify-between bg-[#030303] border border-white/5 rounded-xl px-3 py-2.5 shadow-inner">
        <span className="text-sm font-mono text-zinc-300 truncate max-w-[200px] sm:max-w-[260px]">{value || "N/A"}</span>
        <button onClick={() => onCopy(value, title)} className="text-zinc-500 hover:text-white transition-colors p-1" title={`Copy ${title}`}><Copy size={14}/></button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="relative w-full sm:max-w-lg bg-[#0a0a0c] border-t sm:border border-white/[0.08] sm:rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex flex-col max-h-[92dvh] sm:max-h-[85vh]"
          >
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent shrink-0" />

            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
              <h2 className="text-lg font-bold text-white tracking-tight">Payment Details</h2>
              <button onClick={onClose} className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors outline-none focus:ring-1 focus:ring-white/20">
                <Xmark size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
              
              {/* Highlight Row */}
              <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/10 rounded-2xl p-5">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-display font-bold text-white leading-none">{formatCurrency(payment.amount, payment.currency)} <span className="text-sm text-zinc-400 uppercase">{payment.currency}</span></span>
                  <span className="text-xs text-zinc-400">{formatDate(payment.createdAt)}</span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={payment.paymentStatus} />
                  <PlanBadge plan={payment.plan} />
                </div>
              </div>

              {/* Data Grid */}
              <div className="flex flex-col gap-4">
                <CopyRow label="User Email" value={payment.email} title="Email" />
                <CopyRow label="User ID" value={payment.userId} title="User ID" />
                <CopyRow label="Transaction ID" value={payment._id} title="Transaction ID" />
                <CopyRow label="Stripe Session ID" value={payment.stripeSessionId} title="Stripe Session ID" />
                <CopyRow label="Stripe Payment Intent" value={payment.stripePaymentIntentId} title="Payment Intent ID" />
              </div>

            </div>

            <div className="px-6 py-4 border-t border-white/5 bg-[#030303] flex items-center justify-end shrink-0">
              <button onClick={onClose} className="h-10 px-6 text-sm font-semibold bg-white text-black hover:bg-zinc-200 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] outline-none focus:ring-2 focus:ring-white/50">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}