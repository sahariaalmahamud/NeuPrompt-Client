'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimation } from 'framer-motion';
import { Magnifier } from '@gravity-ui/icons';

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------
const AI_TOOLS = [
  "ChatGPT", "Gemini", "Claude", "Grok", "DeepSeek", "Perplexity", 
  "Midjourney", "DALL-E", "FLUX", "Stable Diffusion", "Ideogram", 
  "Leonardo AI", "Runway", "Kling AI", "Pika", "Luma AI", "Suno", 
  "Udio", "GitHub Copilot", "Cursor", "Claude Code", "Windsurf", 
  "Notion AI", "Microsoft Copilot"
];

const SAMPLE_PROMPTS = [
  "A hyper-realistic close-up of a futuristic cybernetic tiger prowling a neon-lit rain forest...",
  "Code for a simple Python chatbot that detects user sentiment using NLP...",
  "Minimalist dark mode landing page UI design for a premium AI SaaS platform...",
  "Cinematic lighting, 8k resolution, photorealistic astronaut floating in a glowing nebula..."
];

export default function Banner() {
  // ----------------------------------------------------------------------
  // MOUSE TRACKING & 3D TILT LOGIC (Premium Smoothness)
  // ----------------------------------------------------------------------
  const containerRef = useRef(null);
  
  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for buttery smooth physics
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform mouse position into rotation angles and eye movements
  const rotateX = useTransform(smoothY, [-1, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [-1, 1], [-15, 15]);
  const eyeX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const eyeY = useTransform(smoothY, [-1, 1], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize mouse coordinates between -1 and 1
      const normalizedX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const normalizedY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // ----------------------------------------------------------------------
  // BOT BLINKING LOGIC
  // ----------------------------------------------------------------------
  const eyeBlinkControls = useAnimation();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    let timeoutId;

    const triggerBlink = async () => {
      if (!isMounted.current) return;
      await eyeBlinkControls.start({ scaleY: 0.1, transition: { duration: 0.1 } });
      if (!isMounted.current) return;
      await eyeBlinkControls.start({ scaleY: 1, transition: { duration: 0.15 } });
      if (!isMounted.current) return;
      timeoutId = setTimeout(triggerBlink, Math.random() * 4000 + 2000);
    };

    timeoutId = setTimeout(triggerBlink, 2000);
    return () => {
      isMounted.current = false;
      clearTimeout(timeoutId);
    };
  }, [eyeBlinkControls]);

  // ----------------------------------------------------------------------
  // TYPEWRITER EFFECT LOGIC
  // ----------------------------------------------------------------------
  const [typedText, setTypedText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentPrompt = SAMPLE_PROMPTS[promptIndex];
    if (charIndex < currentPrompt.length) {
      const typingTimer = setTimeout(() => {
        setTypedText((prev) => prev + currentPrompt[charIndex]);
        setCharIndex(charIndex + 1);
      }, Math.random() * 30 + 30); // Random typing speed
      return () => clearTimeout(typingTimer);
    } else {
      const resetTimer = setTimeout(() => {
        setTypedText('');
        setCharIndex(0);
        setPromptIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
      }, 3000); // Pause before next prompt
      return () => clearTimeout(resetTimer);
    }
  }, [charIndex, promptIndex]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 px-6"
    >
      {/* 🌌 BACKGROUND: Animated Aurora & Motion Waves */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        {/* Deep blue/purple base glow */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] w-[70vw] h-[500px] rounded-full bg-blue-600/20 blur-[150px]"
        />
        {/* Vibrant multi-color pulses */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] w-[50vw] h-[300px] rounded-full bg-gradient-to-r from-emerald-500/10 via-purple-500/20 to-rose-500/10 blur-[120px]"
        />
        
        {/* Stylized Wavy Lines (CSS SVG Background) */}
        <div 
          className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzI1NjNFQiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzkzMzNFQSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik0wLDMwMCBDMzAwLDEwMCA2MDAsNTAwIDEwMDAsMzAwIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjZykiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTAsMzUwIEM0MDAsMTUwIDUwMCw0NTAgMTAwMCwzNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNnKSIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] bg-cover bg-center"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      {/* 🤖 3D HOLOGRAPHIC BOT & TABLET */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="relative z-20 w-[300px] h-[280px] mb-8 flex flex-col items-center justify-start transform-style-3d"
      >
        {/* Soft shadow below bot */}
        <div className="absolute bottom-10 w-40 h-8 bg-blue-500/20 blur-xl rounded-full animate-pulse" />

        {/* Bot Head SVG */}
        <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] z-10">
          {/* Antenna */}
          <rect x="78" y="5" width="4" height="25" fill="#4B5563" />
          <circle cx="80" cy="5" r="5" fill="#3B82F6" className="animate-pulse" />
          
          {/* Main Head Shell */}
          <rect x="25" y="25" width="110" height="95" rx="36" fill="#18181B" stroke="#27272A" strokeWidth="2" />
          <rect x="29" y="29" width="102" height="87" rx="32" fill="#27272A" opacity="0.5" />
          
          {/* Ear Nodes */}
          <rect x="13.5" y="55" width="12" height="34" rx="6" fill="#3F3F46" />
          <rect x="134.5" y="55" width="12" height="34" rx="6" fill="#3F3F46" />

          {/* Cyber Screen Bezel */}
          <rect x="36" y="36" width="88" height="72" rx="22" fill="#09090B" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
          
          {/* Left Eye */}
          <g transform="translate(56, 72)">
            <motion.ellipse animate={eyeBlinkControls} style={{ x: eyeX, y: eyeY }} cx="0" cy="0" rx="9" ry="9" fill="#3B82F6" />
            <motion.circle style={{ x: eyeX, y: eyeY }} cx="-3" cy="-3" r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Right Eye */}
          <g transform="translate(104, 72)">
            <motion.ellipse animate={eyeBlinkControls} style={{ x: eyeX, y: eyeY }} cx="0" cy="0" rx="9" ry="9" fill="#3B82F6" />
            <motion.circle style={{ x: eyeX, y: eyeY }} cx="-3" cy="-3" r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Happy Mouth */}
          <path d="M 68 92 Q 80 98 92 92" fill="transparent" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        </svg>

        {/* Bot Body/Shoulders */}
        <div className="w-24 h-16 bg-gradient-to-b from-[#18181B] to-[#09090B] rounded-t-3xl border border-white/10 -mt-4 z-0" />

        {/* 💻 Holographic Glass Tablet Overlay (Rendered via HTML for actual text) */}
        <motion.div 
          style={{ translateZ: 50 }} // Pushes it out in 3D space
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#09090B]/60 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.3)] p-4 flex flex-col z-30"
        >
          {/* Tablet Header */}
          <div className="w-full flex gap-1.5 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          
          {/* Live Typing Text */}
          <p className="text-zinc-300 font-mono text-[11px] leading-relaxed text-left">
            <span className="text-blue-400 mr-2">root@ai:~$</span>
            {typedText}
            <span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse" />
          </p>
        </motion.div>
      </motion.div>

      {/* 📝 TYPOGRAPHY & HEADINGS */}
      <div className="relative z-20 max-w-4xl mx-auto space-y-3 mt-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight text-center">
          The Ultimate Prompt <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400">Marketplace</span>
        </h1>
        <div className="text-md text-zinc-400 text-center">
          <p>
          Unlock and enhance your creative flow.  
        </p>
        <p>Discover, share, and monetize production-ready AI prompts for every major model.</p>
        </div>
      </div>

      {/* 🔍 SEARCH BAR */}
      <div className="relative z-20 w-full max-w-2xl mx-auto mt-10 mb-16">
        <div className="relative flex items-center p-2 bg-[#0a0a0c]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all duration-300">
          <div className="pl-4 pr-2 text-zinc-400">
            <Magnifier width={20} height={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by tag, model, or use-case..." 
            className="w-full bg-transparent border-0 outline-none px-2 text-sm text-white placeholder-zinc-500 font-sans h-10"
          />
          <button className="bg-white text-black font-semibold text-sm px-8 h-10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-zinc-200 hover:scale-105 transition-all duration-200">
            EXPLORE
          </button>
        </div>
      </div>

      {/* ♾️ INFINITE SCROLLING LOGO MARQUEE */}
      <div className="relative z-20 w-full max-w-6xl mx-auto overflow-hidden flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2 text-center">Supported AI Ecosystems</p>
        
        {/* Fade Edges for Marquee */}
        <div className="absolute left-0 top-6 bottom-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-6 bottom-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />
        
        {/* Injecting CSS Animation for perfect infinite loop without tailwind config edits */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll 40s linear infinite;
          }
          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="flex w-[200%] animate-infinite-scroll">
          {/* We duplicate the array twice to create a seamless loop */}
          {[...AI_TOOLS, ...AI_TOOLS].map((tool, idx) => (
            <div 
              key={`${tool}-${idx}`} 
              className="flex-shrink-0 px-6 py-3 mx-2 bg-[#18181B]/50 border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer group"
            >
              <span className="text-zinc-400 font-medium text-sm group-hover:text-white transition-colors">{tool}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 CALL TO ACTION */}
      <div className="relative z-20 mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
        <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-all flex items-center gap-2 group shadow-lg">
          Ecplore All Prompts 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-all flex items-center gap-2 group shadow-lg">
          Become a Creator
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

    </section>
  );
}