"use client";

import { motion } from "framer-motion";
import { Sparkles} from "@gravity-ui/icons";
import PricingCard from "./PricingCard";
import TrustBar from "./TrustBar";
import FAQAccordion from "./FAQAccordion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function SubscriptionPlans() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 flex flex-col gap-24">
      
      {/* 1. HERO SECTION */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center text-center gap-6"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          <Sparkles size={14} /> Premium Access
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight max-w-3xl leading-tight">
          Unlock Everything with NeuPrompt Premium
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Get unlimited prompt publishing, unlock premium prompts, and enjoy the complete AI Prompt Marketplace experience.
        </motion.p>
      </motion.div>

      {/* 2. PRICING CARD (CENTRAL FOCUS) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex justify-center w-full -mt-8"
      >
        <PricingCard />
      </motion.div>

      {/* 3. TRUST & SECURITY BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <TrustBar />
      </motion.div>


      {/* 5. FAQ SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto w-full flex flex-col gap-8"
      >
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>
        <FAQAccordion />
      </motion.div>

    </div>
  );
}