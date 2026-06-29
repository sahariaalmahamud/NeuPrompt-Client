"use client";

import { motion } from "framer-motion";
import { Avatar, Button, Tooltip } from "@heroui/react";
import Link from "next/link";
import {
Check,
Star,
Person,
Terminal,
Calendar,
Receipt,
CreditCard,
ShieldCheck,
CrownDiamond
} from "@gravity-ui/icons";

// Animation Variants
const staggerContainer = {
hidden: { opacity: 0 },
show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
hidden: { opacity: 0, y: 20 },
show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function UserProfileCard({ user, subscription, promptCount }) {
if (!user) return null;

const isPremium = user.plan === "premium";
const role = user.role || "user";

// Format Date Helper
const formatDate = (dateString) => {
if (!dateString) return "N/A";
return new Date(dateString).toLocaleDateString("en-US", {
month: "long",
day: "numeric",
year: "numeric"
});
};

// Format Currency Helper
const formatCurrency = (amount, currency = "USD") => {
if (amount === undefined || amount === null) return "N/A";
// Assuming amount might be in cents from Stripe, but if it's standard $5, we leave as is.
// Adjust division by 100 if your backend sends cents.
return new Intl.NumberFormat("en-US", {
style: "currency",
currency: currency.toUpperCase()
}).format(amount);
};

return (
<motion.div
variants={staggerContainer}
initial="hidden"
animate="show"
className="w-full flex flex-col gap-6"
>
{/* 1. PROFILE HEADER CARD */}
<motion.div variants={fadeUp} className="w-full">


      {/* Subtle Background Glow for Header */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Left: Avatar & Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 z-10">
        {/* Avatar with Online Indicator */}
        <div className="relative">
          <Avatar
            src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
            name={user.name}
            className="w-24 h-24 sm:w-28 sm:h-28 text-2xl ring-4 ring-[#030303] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          />
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-[#0a0a0c] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" title="Online" />
        </div>

        {/* User Details */}
        <div className="flex flex-col items-center sm:items-start gap-2 pt-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {user.name}
          </h1>
          <p className="text-sm text-zinc-400 font-medium">{user.email}</p>
          
          {/* Badges */}
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-lg font-mono">
              {role}
            </span>
            <span className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-widest rounded-lg font-mono ${
              isPremium 
                ? "bg-purple-500/10 border-purple-500/20 text-purple-400" 
                : "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
            }`}>
              {user.plan || "Free"} Plan
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
            <Calendar size={14} />
            <span>Member since {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Right: CTA / Premium Status */}
      <div className="flex flex-col justify-center items-center sm:items-end z-10 w-full md:w-auto mt-4 md:mt-0">
        {!isPremium ? (
          <Button
            as={Link}
            href="/plans"
            className="w-full sm:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all border border-blue-500/50"
          >
            Upgrade Now
          </Button>
        ) : (
          <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <ShieldCheck className="text-emerald-400" size={20} />
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Premium Member
            </span>
          </div>
        )}
      </div>

    </motion.div>

  {/* 2. STATISTICS SECTION */}
  <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {/* Stat 1: Prompts */}
    <div className="bg-[#0a0a0c]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:border-white/10 transition-colors shadow-inner group">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
        <Terminal className="text-blue-400" size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">Published Prompts</span>
        <span className="text-2xl font-bold text-white">{promptCount || 0}</span>
      </div>
    </div>

    {/* Stat 2: Plan */}
    <div className="bg-[#0a0a0c]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:border-white/10 transition-colors shadow-inner group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isPremium ? 'bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20' : 'bg-zinc-500/10 border-zinc-500/20 group-hover:bg-zinc-500/20'}`}>
        <CrownDiamond className={isPremium ? "text-purple-400" : "text-zinc-400"} size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">Current Plan</span>
        <span className="text-2xl font-bold text-white capitalize">{user.plan || "Free"}</span>
      </div>
    </div>

    {/* Stat 3: Role */}
    <div className="bg-[#0a0a0c]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:border-white/10 transition-colors shadow-inner group">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
        <Person className="text-emerald-400" size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">Account Type</span>
        <span className="text-2xl font-bold text-white capitalize">{role}</span>
      </div>
    </div>
  </motion.div>

  {/* 3. CONDITIONAL SECTION */}
  <motion.div variants={fadeUp} className="w-full">
    {!isPremium ? (
      /* FREE TIER: UPGRADE BANNER */
      <div className="relative w-full group overflow-hidden rounded-[32px]">
        {/* Luminous Animated Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[34px] blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative bg-[#0a0a0c] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-xl">
            <div className="flex items-center gap-2">
              <Star className="text-amber-400" size={20} />
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Unlock Premium Features</h2>
            </div>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Take your AI prompt engineering to the next level. Upgrade to Premium for a one-time fee and get lifetime access to all exclusive tools.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {["Access Private Prompts", "Unlimited Copy", "Premium Collections", "Priority Updates"].map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Check className="text-blue-400" size={10} />
                  </div>
                  <span className="text-sm font-medium text-zinc-300">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 flex justify-center">
            <Button
              as={Link}
              href="/plans"
              className="w-full md:w-auto h-14 px-10 bg-white hover:bg-zinc-200 text-black font-bold rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    ) : (
      /* PREMIUM TIER: TRANSACTION HISTORY */
      <div className="bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
          <Receipt className="text-purple-400" size={24} />
          <h2 className="text-xl font-bold text-white tracking-tight">Latest Premium Transaction</h2>
        </div>

        {subscription ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">Plan</span>
                <span className="text-base font-medium text-white capitalize">NeuPrompt {subscription.plan}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">Amount</span>
                <span className="text-base font-medium text-white">
                  {formatCurrency(subscription.amount, subscription.currency)}
                </span>
              </div>

              <div className="flex flex-col gap-1 items-start">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono mb-1">Status</span>
                {subscription.paymentStatus === "paid" || subscription.paymentStatus === "succeeded" ? (
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-lg">Paid</span>
                ) : subscription.paymentStatus === "failed" ? (
                  <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest rounded-lg">Failed</span>
                ) : (
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-lg">Pending</span>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">Purchase Date</span>
                <span className="text-base font-medium text-white">{formatDate(subscription.createdAt)}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">Payment Intent ID</span>
                <Tooltip content={subscription.stripePaymentIntentId || "N/A"} placement="top" classNames={{ base: "bg-[#030303] text-zinc-300 border border-white/10" }}>
                  <span className="text-sm font-mono text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg truncate max-w-[250px] cursor-help">
                    {subscription.stripePaymentIntentId || "N/A"}
                  </span>
                </Tooltip>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">Session ID</span>
                <Tooltip content={subscription.stripeSessionId || "N/A"} placement="top" classNames={{ base: "bg-[#030303] text-zinc-300 border border-white/10" }}>
                  <span className="text-sm font-mono text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg truncate max-w-[250px] cursor-help">
                    {subscription.stripeSessionId || "N/A"}
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <CreditCard className="text-zinc-600 mb-4" size={32} />
            <h3 className="text-lg font-medium text-white mb-1">No Transactions Found</h3>
            <p className="text-sm text-zinc-500">We couldn't locate your recent billing history.</p>
          </div>
        )}
      </div>
    )}
  </motion.div>
</motion.div>


);
}