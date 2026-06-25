"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ArrowRight, Sparkles } from "@gravity-ui/icons";
import FeaturedPromptCard, { cardVariant } from "./FeaturedPromptCard";

// Container variant for staggering children
const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const headerVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function FeaturedPrompts({ prompts }) {
  
  // ----------------------------------------------------------------------
  // EMPTY STATE RENDER
  // ----------------------------------------------------------------------
  if (!prompts || prompts.length === 0) {
    return (
      <section className="relative w-full py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
          <Sparkles className="text-zinc-500" size={24} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No featured prompts available.</h3>
        <p className="text-zinc-400 max-w-sm mb-6">Check back later or browse our full collection to find what you need.</p>
        <Button 
          as={Link} 
          href="/all-prompts"
          className="bg-white text-black font-semibold rounded-full px-6 hover:bg-zinc-200"
        >
          Browse All Prompts
        </Button>
      </section>
    );
  }

  // ----------------------------------------------------------------------
  // MAIN FEATURED SECTION RENDER
  // ----------------------------------------------------------------------
  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden font-sans">
      
      {/* 🌌 AMBIENT BACKGROUND GLOWS (Inspired by image_16c1e8.png) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        {/* Deep Violet Base Blob */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[50vw] h-[500px] bg-[#4c1d95] rounded-full blur-[150px] mix-blend-screen"
        />
        {/* Vibrant Magenta/Pink Highlight Blob */}
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -30, 0], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/3 w-[40vw] h-[400px] bg-[#d946ef] rounded-full blur-[140px] mix-blend-screen"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 🏷️ HEADER SECTION */}
        <motion.div 
          variants={headerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16"
        >
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-[10px] font-bold uppercase tracking-widest font-mono w-max">
              <Sparkles size={12} /> Featured Collection
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              Featured Prompts
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Discover community-favorite prompts handpicked by our team. Elevate your AI generations with proven configurations.
            </p>
          </div>

          <Button 
            as={Link} 
            href="/all-prompts"
            variant="bordered"
            className="border-white/10 text-zinc-300 hover:text-white hover:border-white/30 hover:bg-white/5 rounded-full px-6 h-11 font-medium transition-all group"
          >
            View All Prompts 
            <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* 🃏 GRID SECTION */}
        <motion.div 
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {prompts.map((prompt) => (
            <FeaturedPromptCard key={prompt._id} prompt={prompt} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}