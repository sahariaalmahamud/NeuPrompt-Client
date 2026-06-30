"use client";

import { motion } from "framer-motion";
import { CircleDollar, Receipt, CrownDiamond, CircleCheck } from "@gravity-ui/icons";
import { useMemo } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function StatsCards({ transactions }) {
  
  const stats = useMemo(() => {
    let revenue = 0;
    let successful = 0;
    let premiumSubs = 0;

    transactions.forEach(t => {
      const status = t.paymentStatus?.toLowerCase();
      if (status === 'paid' || status === 'succeeded') {
        revenue += t.amount;
        successful += 1;
      }
      if (t.plan?.toLowerCase() === 'premium') {
        premiumSubs += 1;
      }
    });

    return {
      revenue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(revenue),
      total: transactions.length.toLocaleString(),
      premium: premiumSubs.toLocaleString(),
      successful: successful.toLocaleString()
    };
  }, [transactions]);

  const cards = [
    { title: "Total Revenue", value: stats.revenue, desc: "Lifetime earnings", icon: <CircleDollar className="text-emerald-400" size={24} />, bg: "bg-emerald-500/10", border: "group-hover:border-emerald-500/30" },
    { title: "Total Transactions", value: stats.total, desc: "All payment attempts", icon: <Receipt className="text-blue-400" size={24} />, bg: "bg-blue-500/10", border: "group-hover:border-blue-500/30" },
    { title: "Premium Subscribers", value: stats.premium, desc: "Active Premium plans", icon: <CrownDiamond className="text-purple-400" size={24} />, bg: "bg-purple-500/10", border: "group-hover:border-purple-500/30" },
    { title: "Successful Payments", value: stats.successful, desc: "Paid and verified", icon: <CircleCheck className="text-amber-400" size={24} />, bg: "bg-amber-500/10", border: "group-hover:border-amber-500/30" },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => (
        <motion.div 
          key={idx} 
          variants={fadeUp}
          className={`flex flex-col bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group ${card.border}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center border border-white/5 shadow-inner transition-transform group-hover:scale-110`}>
              {card.icon}
            </div>
          </div>
          
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono mb-1">
            {card.title}
          </span>
          <span className="text-3xl font-display font-bold text-white tracking-tight mb-2">
            {card.value}
          </span>
          <span className="text-xs text-zinc-500">
            {card.desc}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}