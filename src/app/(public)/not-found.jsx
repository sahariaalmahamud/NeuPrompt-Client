"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { House, Magnifier } from "@gravity-ui/icons";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4 font-sans relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-lg"
      >
        <div className="flex flex-col items-center text-center p-10 bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-[32px]">
          
          {/* Glitchy/Luminous 404 Text */}
          <div className="relative mb-6">
            <h1 className="text-8xl sm:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 select-none">
              404
            </h1>
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl -z-10 rounded-full" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
            Page Not Found
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-10 max-w-sm">
            The prompt or page you are looking for has vanished into the void. It might have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <Button
              as={Link}
              href="/"
              className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <House size={18} /> Go Home
            </Button>
            
            <Button
              as={Link}
              href="/prompts"
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center gap-2"
            >
              <Magnifier size={18} /> Browse Prompts
            </Button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}