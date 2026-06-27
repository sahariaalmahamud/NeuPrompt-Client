"use client";

import { ShieldCheck, CreditCard, Thunderbolt } from "@gravity-ui/icons";

export default function TrustBar() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 py-6 px-8 bg-[#0a0a0c]/50 backdrop-blur-md border border-white/5 rounded-3xl w-full max-w-4xl">
      <div className="flex items-center gap-3 text-zinc-400">
        <ShieldCheck className="text-blue-500" size={20} />
        <span className="text-sm font-medium">Secure payment powered by Stripe</span>
      </div>
      <div className="flex items-center gap-3 text-zinc-400">
        <CreditCard className="text-purple-500" size={20} />
        <span className="text-sm font-medium">One-time payment</span>
      </div>
      <div className="flex items-center gap-3 text-zinc-400">
        <Thunderbolt className="text-amber-500" size={20} />
        <span className="text-sm font-medium">Instant activation</span>
      </div>
    </div>
  );
}