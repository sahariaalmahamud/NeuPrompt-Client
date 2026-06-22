'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import {Magnifier} from '@gravity-ui/icons';

export default function Banner() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const robotRef = useRef(null);
  const eyeBlinkControls = useAnimation();

  // 1. Capture Mouse Positions & Compute Transform deltas
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      
      // Find relative center points of the Robot Head
      const robotCenterX = rect.left + rect.width / 2;
      const robotCenterY = rect.top + rect.height / 2;

      // Calculate directional vector differences
      const deltaX = e.clientX - robotCenterX;
      const deltaY = e.clientY - robotCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Limit internal pupil movement radius to 6px max
      const maxDistance = 6; 
      const limitedDistance = Math.min(distance * 0.05, maxDistance);
      const angle = Math.atan2(deltaY, deltaX);

      setMousePos({
        x: Math.cos(angle) * limitedDistance,
        y: Math.sin(angle) * limitedDistance
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. Continuous Organic Staggered Blinking Loop
  useEffect(() => {
    let timeoutId;
    const triggerBlink = async () => {
      // Direct snap closed, quick open scale sequence
      await eyeBlinkControls.start({ scaleY: 0, transition: { duration: 0.08 } });
      await eyeBlinkControls.start({ scaleY: 1, transition: { duration: 0.12 } });
      
      // Schedule next blink at an unpredictable interval (3 to 6 seconds)
      const nextInterval = Math.random() * 3000 + 3000;
      timeoutId = setTimeout(triggerBlink, nextInterval);
    };

    timeoutId = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(timeoutId);
  }, [eyeBlinkControls]);

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-brand-void pt-12">
      
      {/* BACKGROUND GRAPHICS: Dynamic Luminous Aurora Waves */}
      <div className="absolute inset-x-0 top-0 h-[500px] pointer-events-none z-0 opacity-60">
        <div className="absolute top-[-10%] left-[20%] w-[45vw] h-[300px] rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 blur-[120px]" />
        <div className="absolute top-[15%] right-[15%] w-[40vw] h-[250px] rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/20 to-amber-500/10 blur-[100px]" />
      </div>

      {/* CORE FRAMEWORK: The Live Interactive SVG Mascot */}
      <div ref={robotRef} className="relative z-10 w-44 h-44 mb-8 select-none flex items-center justify-center">
        
        {/* Soft Shadow Base Glow Behind Head Frame */}
        <div className="absolute inset-2 bg-brand-cyan/10 rounded-full blur-2xl animate-pulse" />

        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Main Outer Head Shell Structure */}
          <rect x="25" y="25" width="110" height="95" rx="36" fill="#F4F4F5" stroke="#E4E4E7" strokeWidth="2" />
          <rect x="29" y="29" width="102" height="87" rx="32" fill="#E4E4E7" opacity="0.3" />
          
          {/* External Left/Right Ear Nodes */}
          <rect x="13.5" y="55" width="12" height="34" rx="6" fill="#A1A1AA" />
          <rect x="134.5" y="55" width="12" height="34" rx="6" fill="#A1A1AA" />

          {/* Internal Cyber Screen Bezel Area */}
          <rect x="36" y="36" width="88" height="72" rx="22" fill="#111827" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          
          {/* Left Eyeball Matrix */}
          <g transform="translate(56, 72)">
            <circle cx="0" cy="0" r="14" fill="#1F2937" />
            {/* Pupil Tracking node wrapped inside the Blinking motion wrapper */}
            <motion.ellipse 
              animate={eyeBlinkControls}
              cx={mousePos.x} 
              cy={mousePos.y} 
              rx="9" 
              ry="9" 
              fill="#06B6D4" 
              style={{ transformOrigin: 'center' }}
            />
            {/* Dynamic mini specular highlight */}
            <circle cx={mousePos.x - 3} cy={mousePos.y - 3} r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Right Eyeball Matrix */}
          <g transform="translate(104, 72)">
            <circle cx="0" cy="0" r="14" fill="#1F2937" />
            <motion.ellipse 
              animate={eyeBlinkControls}
              cx={mousePos.x} 
              cy={mousePos.y} 
              rx="9" 
              ry="9" 
              fill="#06B6D4" 
              style={{ transformOrigin: 'center' }}
            />
            <circle cx={mousePos.x - 3} cy={mousePos.y - 3} r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Smiling Sub-chromatic Digital Mouth bar */}
          <path d="M 68 92 Q 80 99 92 92" fill="transparent" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* TYPOGRAPHY STRUCTURE LAYER */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-space leading-tight">
          The Ultimate Prompt <span className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple bg-clip-text text-transparent">Marketplace</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl mx-auto">
          Unlock and Enhance Your Creative Flow with Curated AI Prompts
        </p>
      </div>

      {/* SEARCH SYSTEM HOVER WRAPPER */}
      <div className="relative z-10 w-full max-w-xl mx-auto mt-10">
        <div className="relative flex items-center p-1.5 bg-brand-panel/60 backdrop-blur-md rounded-full border border-white/[0.08] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.06)] focus-within:border-brand-cyan/50 transition-all duration-300">
          <div className="pl-3 text-zinc-400">
            <Magnifier size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search by tag or AI tool..." 
            className="w-full bg-transparent border-0 outline-none px-3 text-xs text-white placeholder-zinc-500 font-sans h-8"
          />
          <button className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white font-mono font-bold text-[11px] uppercase tracking-wider px-5 h-8 rounded-full shadow-md transition-all duration-150">
            Explore
          </button>
        </div>
      </div>

      {/* FOOTER TRENDING TAG CLUSTERS */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-6 text-[11px] font-mono text-zinc-500">
        <span className="uppercase tracking-wider mr-1 text-zinc-600">Trending Tags:</span>
        {['#MidjourneyArt', '#ChatGPT-4o Coding', '#Claude3 Creative', '#DALL-E Concept'].map((tag) => (
          <span key={tag} className="px-3 py-1 bg-brand-card/40 border border-white/[0.04] text-zinc-400 rounded-full hover:border-brand-cyan/30 hover:text-white transition-all cursor-pointer">
            {tag}
          </span>
        ))}
      </div>

    </section>
  );
}