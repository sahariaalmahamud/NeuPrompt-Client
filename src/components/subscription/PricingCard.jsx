"use client";

import { motion } from "framer-motion";
import { Check } from "@gravity-ui/icons";

const BENEFITS = [
  // "Unlimited Prompt Publishing",
  // "Publish More Than 3 Prompts",
  "Access All Premium Prompts",
  "Unlock Private Prompt Content",
  "Copy Premium Prompt Content",
  "Submit Reviews & Ratings on Premium Prompts",
  "Future Premium Features Included"
];

export default function PricingCard() {
  return (
    <div className="relative group w-full max-w-lg">
      
      {/* Luminous Glow Behind Card */}
      <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-[34px] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative flex flex-col bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        
        {/* Header & Badges */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">NeuPrompt Premium</h2>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">
            Best Value
          </span>
        </div>

        {/* Pricing Area */}
        <div className="flex items-end gap-2 mb-2">
          <span className="text-6xl font-display font-bold text-white leading-none">$5</span>
          <span className="text-zinc-500 font-medium mb-1">/ one-time</span>
        </div>
        <p className="text-sm text-zinc-400 mb-8 border-b border-white/5 pb-8">
          Pay once, unlock permanently. No recurring fees.
        </p>

        {/* Benefits Checklist */}
        <div className="flex flex-col gap-4 mb-10 flex-1">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="text-blue-400" size={12} />
              </div>
              <span className="text-zinc-300 text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        {/* STRIPE CHECKOUT FORM PLACEHOLDER */}
        <form action="/api/checkout_sessions" method="POST" className="w-full">
          {/* <input type="hidden" name="plan_id" value="premium_one_time" /> */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            role="link"  
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all border border-blue-500/50 flex items-center justify-center text-base"
          >
            Upgrade to Premium
          </motion.button>
        </form>

      </div>
    </div>
  );
}