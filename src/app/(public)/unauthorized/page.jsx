"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ShieldKeyhole, ArrowRight } from "@gravity-ui/icons";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4 font-sans relative overflow-hidden">
      {/* Danger/Warning Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-lg"
      >
        <div className="flex flex-col items-center text-center p-10 bg-[#0a0a0c]/80 backdrop-blur-2xl border border-red-500/10 shadow-[0_20px_60px_rgba(220,38,38,0.1)] rounded-[32px]">
          
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-inner">
            <ShieldKeyhole className="text-red-500" size={36} />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
            Access Denied
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-10 max-w-sm">
            You do not have the required permissions to view this page. Please sign in with an authorized account.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <Button
              as={Link}
              href="/"
              className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Return Home
            </Button>
            
            <Button
              as={Link}
              href="/auth/signin"
              className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight size={16} />
            </Button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}