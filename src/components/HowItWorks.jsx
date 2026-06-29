"use client";

import { motion } from "framer-motion";
import { Magnifier, Copy, Sparkles } from "@gravity-ui/icons";

const steps = [
  {
    id: 1,
    title: "Discover Prompts",
    description: "Browse thousands of production-ready prompts across every category and AI model.",
    icon: <Magnifier className="text-blue-400 group-hover:scale-110 transition-transform duration-300" size={28} />,
  },
  {
    id: 2,
    title: "Copy & Customize",
    description: "Copy any prompt instantly and customize it for your own workflow.",
    icon: <Copy className="text-purple-400 group-hover:scale-110 transition-transform duration-300" size={28} />,
  },
  {
    id: 3,
    title: "Boost Productivity",
    description: "Save hours by using optimized prompts built by experienced creators.",
    icon: <Sparkles className="text-pink-400 group-hover:scale-110 transition-transform duration-300" size={28} />,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#030303] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center flex flex-col gap-3 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">
            How <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">NeuPrompt</span> Works
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            Create, discover and use AI prompts in just three simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col items-center text-center p-8 bg-[#0a0a0c]/60 backdrop-blur-md border border-white/[0.06] rounded-[24px] transition-all hover:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold font-mono flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                {step.id}
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:border-white/10 transition-colors">
                {step.icon}
              </div>

              {/* Text Meta */}
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                {step.description}
              </p>

              {/* Decorative Connectors (Rendered only between cards on desktop layout) */}
              {idx < 2 && (
                <div className="hidden md:flex absolute top-1/3 -right-4 translate-x-1/2 items-center z-20 pointer-events-none w-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />
                  <div className="w-full h-px border-t border-dashed border-white/10 mx-0.5" />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.6)] shrink-0" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}