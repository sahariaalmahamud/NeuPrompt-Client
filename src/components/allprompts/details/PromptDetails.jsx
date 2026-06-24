"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, Avatar } from "@heroui/react";
import { 
  Copy, 
  Check, 
  Bookmark, 
  Star, 
  ShieldExclamation, 
  Calendar, 
  Eye, 
  Person 
} from "@gravity-ui/icons";

// ----------------------------------------------------------------------
// FRAMER MOTION VARIANTS
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function PromptDetails({ prompt }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!prompt) return null;

  const displayRating = prompt.rating ? prompt.rating.toFixed(1) : "0.0";
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  // ----------------------------------------------------------------------
  // ACTIONS LOGIC
  // ----------------------------------------------------------------------
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      // BACKEND INTEGRATION: Trigger an API call here to increment 'copyCount'
      // fetch(`/api/prompts/${prompt._id}/copy`, { method: 'POST' });
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // BACKEND INTEGRATION: Toggle bookmark status in user's saved prompts
    // fetch(`/api/users/bookmarks`, { method: 'POST', body: JSON.stringify({ promptId: prompt._id }) });
  };

  const handleReport = () => {
    // BACKEND INTEGRATION: Open a HeroUI Modal here to collect report reason, 
    // then submit to backend.
    alert("Report Modal would open here. Connected to backend later.");
  };

  // ----------------------------------------------------------------------
  // REUSABLE BADGES
  // ----------------------------------------------------------------------
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-hidden pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: HERO, CONTENT, TAGS, REVIEWS (Spans 8 cols)  */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* 1. HERO SECTION */}
            <motion.div variants={fadeUp} className="flex flex-col gap-6">
              
              {/* Thumbnail */}
              <div className="w-full h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden border border-white/5 relative bg-[#0a0a0c]">
                <img 
                  src={prompt.thumbnail} 
                  alt={prompt.title} 
                  className="w-full h-full object-cover opacity-90"
                />
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-80" />
                
                {/* Badges Floating on Image */}
                <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
                  {prompt.featured && (
                    <span className="px-3 py-1.5 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                      Featured
                    </span>
                  )}
                  <span className="px-3 py-1.5 bg-[#0a0a0c]/80 backdrop-blur-md border border-white/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                    {prompt.category}
                  </span>
                  <span className="px-3 py-1.5 bg-[#0a0a0c]/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                    {prompt.aiTool}
                  </span>
                  <span className="px-3 py-1.5 bg-[#0a0a0c]/80 backdrop-blur-md border border-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                    {prompt.difficulty}
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                  {prompt.title}
                </h1>
                <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
                  {prompt.description}
                </p>
              </div>

              {/* Hero Action Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                <Button 
                  onClick={handleCopy}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2"
                >
                  {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  {isCopied ? "Copied!" : "Copy Prompt"}
                </Button>
                
                <Button 
                  onClick={handleBookmark}
                  className={`h-12 px-6 border rounded-xl font-medium transition-all flex items-center gap-2 ${
                    isBookmarked 
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                      : "bg-[#0a0a0c] border-white/10 text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <Bookmark size={18} />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>

                <button 
                  onClick={handleReport}
                  className="ml-auto flex items-center gap-2 text-sm text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <ShieldExclamation size={16} /> Report
                </button>
              </div>
            </motion.div>

            {/* 2. PROMPT CONTENT (VS CODE STYLE) */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Prompt Configuration
              </h2>
              
              <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                {/* Fake Window Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 text-xs text-zinc-500 font-mono tracking-wider">prompt_data.txt</span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="text-xs font-mono font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-400"/> : <Copy size={14} />}
                    {isCopied ? "COPIED" : "COPY"}
                  </button>
                </div>
                
                {/* Code Body */}
                <div className="p-6 overflow-x-auto">
                  <pre className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {prompt.content}
                  </pre>
                </div>
              </div>
            </motion.div>

            {/* 3. TAGS */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 font-mono">
                Tags & Capabilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-500/20 hover:scale-105 transition-all cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 4. REVIEWS (PLACEHOLDER) */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4 pt-8 border-t border-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Community Reviews
              </h2>
              {/* BACKEND INTEGRATION: 
                  - Fetch reviews from /api/prompts/{id}/reviews
                  - Render review list and a Review Submission Modal here
              */}
              <Card className="w-full bg-[#0a0a0c]/50 backdrop-blur-md border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-inner">
                <Star className="text-amber-500/50 mb-3" size={32} />
                <h3 className="text-lg font-semibold text-white mb-1">Reviews Coming Soon</h3>
                <p className="text-sm text-zinc-500">The rating and review system is currently being integrated.</p>
              </Card>
            </motion.div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: CREATOR SIDEBAR (Spans 4 cols)              */}
          {/* ========================================================= */}
          <div className="lg:col-span-4">
            <motion.div 
              variants={fadeUp}
              className="sticky top-24 bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-6"
            >
              {/* Creator Profile Info */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">
                  Created By
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={`https://ui-avatars.com/api/?name=${prompt.creatorName}&background=0D8ABC&color=fff`} 
                    name={prompt.creatorName} 
                    size="md" 
                    className="ring-2 ring-white/10"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">{prompt.creatorName}</span>
                    <span className="text-xs text-zinc-500">{prompt.creatorEmail}</span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-white/5" />

              {/* Prompt Stats Grid */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">
                  Prompt Details
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 p-3 bg-[#030303] border border-white/5 rounded-xl shadow-inner">
                    <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                      <Star size={14} className="text-amber-500" />
                      <span className="text-xs font-medium">Rating</span>
                    </div>
                    <span className="text-lg font-bold text-white leading-none">
                      {displayRating} <span className="text-xs text-zinc-600 font-normal">({prompt.totalRatings})</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 bg-[#030303] border border-white/5 rounded-xl shadow-inner">
                    <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                      <Copy size={14} className="text-blue-400" />
                      <span className="text-xs font-medium">Copies</span>
                    </div>
                    <span className="text-lg font-bold text-white leading-none">
                      {prompt.copyCount || 0}
                    </span>
                  </div>
                </div>

                {/* Date & Meta */}
                <div className="flex flex-col gap-3 mt-2 bg-[#030303] border border-white/5 p-4 rounded-xl shadow-inner">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Calendar size={14} /> Created
                    </div>
                    <span className="text-zinc-300 font-medium">{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Eye size={14} /> Visibility
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${prompt.visibility === 'Public' ? 'text-blue-400' : 'text-zinc-500'}`}>
                      {prompt.visibility}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <ShieldExclamation size={14} /> Status
                    </div>
                    <StatusBadge status={prompt.status} />
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}