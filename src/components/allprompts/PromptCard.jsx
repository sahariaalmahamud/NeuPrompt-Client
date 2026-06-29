"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Copy, Eye, Person, Lock } from "@gravity-ui/icons";

// ─── AI Tool badge color map ──────────────────────────────────────────────────
// Each tool gets its own color so the badge is instantly recognisable.
const TOOL_COLORS = {
  ChatGPT:          { pill: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" },
  Claude:           { pill: "bg-amber-500/15 border-amber-500/30 text-amber-400"    },
  Gemini:           { pill: "bg-blue-500/15 border-blue-500/30 text-blue-400"       },
  Midjourney:       { pill: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"       },
  "Stable Diffusion":{ pill: "bg-violet-500/15 border-violet-500/30 text-violet-400"},
  Grok:             { pill: "bg-purple-500/15 border-purple-500/30 text-purple-400" },
  Perplexity:       { pill: "bg-teal-500/15 border-teal-500/30 text-teal-400"       },
  Copilot:          { pill: "bg-sky-500/15 border-sky-500/30 text-sky-400"          },
};
const DEFAULT_TOOL = { pill: "bg-zinc-500/15 border-zinc-500/30 text-zinc-400" };

// ─── Difficulty badge color map ───────────────────────────────────────────────
const DIFFICULTY_COLORS = {
  Beginner:     "text-emerald-400 border-emerald-500/30",
  Intermediate: "text-amber-400 border-amber-500/30",
  Advanced:     "text-red-400 border-red-500/30",
};

// ─── Tiny sparkle SVG (matches the ✦ icon in the reference image) ────────────
function SparkleIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      className="shrink-0 text-zinc-400"
      aria-hidden="true"
    >
      <path
        d="M6 0.5L7.03 4.47L11 5.5L7.03 6.53L6 10.5L4.97 6.53L1 5.5L4.97 4.47L6 0.5Z"
        fill="currentColor" opacity="0.6"
      />
    </svg>
  );
}

// ─── PromptCard ───────────────────────────────────────────────────────────────
export default function PromptCard({ prompt }) {
  const displayRating  = prompt.rating     ? prompt.rating.toFixed(1) : "0.0";
  const copies         = prompt.copyCount  ?? 0;
  const isFeatured     = prompt.featured   === true;

  // visibility === "Public"  → FREE   (emerald)
  // visibility === "Private" → PREMIUM (red + lock icon, matching the reference image)
  const isPremium = prompt.visibility === "Private";

  const toolStyle = TOOL_COLORS[prompt.aiTool] ?? DEFAULT_TOOL;
  const diffStyle = DIFFICULTY_COLORS[prompt.difficulty] ?? "text-zinc-400 border-zinc-500/30";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.18, ease: "easeOut" } }}
      className="group relative flex flex-col bg-[#0d0d16] hover:bg-[#11111c]
        border border-white/[0.07] hover:border-violet-500/30
        rounded-2xl overflow-hidden
        shadow-[0_4px_24px_rgba(0,0,0,0.5)]
        hover:shadow-[0_8px_40px_rgba(109,40,217,0.12)]
        transition-all duration-300 h-full"
      aria-label={`Prompt: ${prompt.title}`}
    >

      {/* ── Thumbnail ──────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0a0a0f]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={prompt.thumbnail}
          alt={prompt.title}
          loading="lazy"
          className="w-full h-full object-cover opacity-85
            group-hover:opacity-100 group-hover:scale-105
            transition-all duration-500"
          // Fallback for hotlink-protected hosts (e.g. ibb.co blocks external <img> requests).
          // Replace ibb.co with Cloudinary / Uploadthing for reliable hosting.
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(prompt.title)}&background=1a0a2e&color=9333ea&size=400&bold=true`;
          }}
        />

        {/* Gradient overlay so bottom badges are always readable */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0d0d16] via-[#0d0d16]/20 to-transparent"
          aria-hidden="true"
        />

        {/* Featured ribbon — top-right corner */}
        {isFeatured && (
          <div className="absolute top-0 right-0">
            <div className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest
              px-3 py-1 rounded-bl-xl shadow-lg">
              ★ Featured
            </div>
          </div>
        )}
      </div>

      {/* ── Badge row ──────────────────────────────────────────────────────── */}
      {/*
        Layout mirrors the reference image exactly:
          [AI Tool pill] [Difficulty pill] [FREE / PREMIUM pill]
        Badges sit BELOW the thumbnail, not floating on top of it.
      */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4">

        {/* AI Tool — colored per tool */}
        <span
          aria-label={`AI tool: ${prompt.aiTool}`}
          className={`inline-flex items-center px-2.5 py-1 rounded-full border
            text-[10px] font-bold uppercase tracking-wider
            ${toolStyle.pill}`}
        >
          {prompt.aiTool}
        </span>

        {/* Difficulty — outline style */}
        <span
          aria-label={`Difficulty: ${prompt.difficulty}`}
          className={`inline-flex items-center px-2.5 py-1 rounded-full border
            bg-transparent text-[10px] font-bold uppercase tracking-wider
            ${diffStyle}`}
        >
          {prompt.difficulty}
        </span>

        {/* Visibility — FREE or PREMIUM */}
        {isPremium ? (
          <span
            aria-label="Premium prompt"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border
              border-red-500/40 bg-red-500/10 text-red-400
              text-[10px] font-black uppercase tracking-wider"
          >
            <Lock className="size-2.5 shrink-0" aria-hidden="true" />
            Premium
          </span>
        ) : (
          <span
            aria-label="Free prompt"
            className="inline-flex items-center px-2.5 py-1 rounded-full border
              border-emerald-500/40 bg-emerald-500/10 text-emerald-400
              text-[10px] font-black uppercase tracking-wider"
          >
            Free
          </span>
        )}
      </div>

      {/* ── Card body ──────────────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-4 flex flex-col flex-1 gap-3">

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
          {prompt.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 flex-1">
          {prompt.description}
        </p>

        {/* Category line — sparkle icon + mono uppercase text */}
        <div className="flex items-center gap-1.5">
          <SparkleIcon />
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest font-mono">
            {prompt.category}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/[0.06]" aria-hidden="true" />

        {/* Footer — creator · copies · rating */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Creator */}
          <div className="flex items-center gap-1.5 text-zinc-500 min-w-0">
            <Person className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="text-xs truncate max-w-[100px] sm:max-w-[120px]">
              {prompt.creatorName}
            </span>
          </div>

          {/* Copies + Rating */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="flex items-center gap-1 text-zinc-500"
              title={`${copies} copies`}
              aria-label={`${copies} copies`}
            >
              <Copy className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="text-xs font-mono">{copies}</span>
            </div>
            <div
              className="flex items-center gap-1"
              title={`Rating: ${displayRating}`}
              aria-label={`Rating: ${displayRating}`}
            >
              <Star className="size-3.5 text-amber-400 shrink-0" aria-hidden="true" />
              <span className="text-xs font-mono font-semibold text-zinc-300">{displayRating}</span>
            </div>
          </div>
        </div>

        {/* View Details CTA — full width, violet, eye icon */}
        <Link
          href={`/prompts/${prompt._id}`}
          aria-label={`View details for ${prompt.title}`}
          className="mt-1 w-full h-10 rounded-xl flex items-center justify-center gap-2
            bg-violet-600 hover:bg-violet-500 active:bg-violet-700
            text-white text-sm font-semibold
            transition-colors duration-200
            shadow-[0_4px_16px_rgba(109,40,217,0.3)]
            hover:shadow-[0_4px_20px_rgba(109,40,217,0.5)]
            outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <Eye className="size-4 shrink-0" aria-hidden="true" />
          View Details
        </Link>
      </div>
    </motion.article>
  );
}