"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Avatar } from "@heroui/react";
import {
  Copy, Check, Bookmark, BookmarkFill,
  Star, ShieldExclamation, Calendar, Eye, Lock,
} from "@gravity-ui/icons";
import Link from "next/link";
import { incrementCopyCount } from "@/lib/actions/prompts";
import { createBookmark, removeBookmark } from "@/lib/actions/bookmarks";
import { useSession } from "@/lib/auth-client";
import { checkBookmark } from "@/lib/api/bookmarks";

// Sub-components
import ReportModal from "./reports/ReportModal";
import ReviewsSection from "./reviews/ReviewsSection";

// ─── Animation variants ───────────────────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

// ─── Inline toast ─────────────────────────────────────────────────────────────
// Replaces every alert() call with a non-blocking bottom-right toast.
function Toast({ message, type }) {
  const colors = {
    success: "bg-emerald-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-zinc-800 text-white border border-white/10",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      className={`fixed bottom-6 right-6 z-[300] px-4 py-3 rounded-xl
        text-sm font-medium shadow-2xl max-w-xs
        ${colors[type] ?? colors.info}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </motion.div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border
      ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  );
}

// ─── Premium lock overlay ─────────────────────────────────────────────────────
// Shown when prompt.visibility === "Private" and the user is not premium.
// BACKEND INTEGRATION: Update `hasPremiumAccess` check below to match your
//   user schema field name. Currently checks `user?.plan === "premium"`.
//   Could also be user?.subscription, user?.tier, etc.
function PremiumLock() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative rounded-2xl overflow-hidden"
    >
      {/* Blurred prompt preview — teaser, not full content */}
      <div
        className="p-6 bg-[#0a0a0c] border border-white/10 rounded-2xl select-none
          blur-[6px] pointer-events-none opacity-40 min-h-[180px] overflow-hidden"
        aria-hidden="true"
      >
        <pre className="text-zinc-300 font-mono text-sm leading-relaxed">
          {"You are a world-class consultant...\n\nCreate a complete strategy for...\n\n1. Analysis\n2. Solution\n3. Implementation\n4. Metrics\n\n[Premium content hidden]"}
        </pre>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#030303]/70 backdrop-blur-sm rounded-2xl">
        <div className="size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20
          flex items-center justify-center">
          <Lock className="size-6 text-amber-400" aria-hidden="true" />
        </div>
        <div className="text-center px-6">
          <h3 className="text-white font-bold text-base mb-1">Premium Content</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Subscribe to unlock this prompt and access the full marketplace.
          </p>
        </div>
        <Link
          href="/plans"
          aria-label="Subscribe to premium to unlock this prompt"
          className="h-10 px-6 bg-amber-500 hover:bg-amber-400 active:bg-amber-600
            text-black text-sm font-bold rounded-xl transition-colors
            shadow-[0_4px_16px_rgba(245,158,11,0.35)]
            outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          Subscribe to Premium
        </Link>
      </div>
    </motion.div>
  );
}

// ─── PromptDetails ────────────────────────────────────────────────────────────
export default function PromptDetails({ prompt, reviews }) {
  const { data: session } = useSession();
  const [token, setToken] = useState("");
  const user = session?.user;

  const [copyCount, setCopyCount] = useState(prompt.copyCount ?? 0);
  const [isCopied, setIsCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  // ── Premium / lock logic ───────────────────────────────────────────────────
  // BACKEND INTEGRATION: change `user?.plan` to match your actual user schema.
  // e.g. user?.subscription, user?.tier, etc.
  const isOwner = user?.id === prompt.creatorId;
  const hasPremiumAccess = user?.plan === "premium" || isOwner;
  const isLocked = prompt.visibility === "Private" && !hasPremiumAccess;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch("/api/auth/token");

        if (!res.ok) return;

        const data = await res.json();

        if (data?.token?.token) {
          setToken(data.token.token);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getToken();
  }, []);

  // ── Check bookmark status ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    checkBookmark(user.id, prompt._id)
      .then((status) => setIsBookmarked(status.bookmarked))
      .catch(console.error);
  }, [user?.id, prompt._id]);

  if (!prompt) return null;

  const displayRating = prompt.rating ? prompt.rating.toFixed(1) : "0.0";
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  // ── Action handlers ────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (isLocked) { showToast("Subscribe to Premium to copy this prompt.", "info"); return; }
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopyCount((p) => p + 1);
      await incrementCopyCount(prompt._id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyCount((p) => p - 1);
      showToast("Failed to copy. Please try again.", "error");
    }
  };

  const handleBookmark = async () => {
    if (!user?.id) { showToast("Please sign in to save prompts.", "info"); return; }
    try {
      if (isBookmarked) {
        const result = await removeBookmark({ userId: user.id, promptId: prompt._id });
        if (!result.success) { showToast(result.message, "error"); return; }
        setIsBookmarked(false);
        showToast("Bookmark removed.", "success");
      } else {
        const result = await createBookmark({ userId: user.id, promptId: prompt._id });
        if (!result.success) { showToast(result.message, "error"); return; }
        setIsBookmarked(true);
        showToast("Prompt saved!", "success");
      }
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  const handleReport = () => {
    if (!user?.id) { showToast("Please sign in to report this prompt.", "info"); return; }
    setIsReportModalOpen(true);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white font-sans relative overflow-x-hidden pb-20">

      {/* Ambient glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-600/8 blur-[150px] rounded-full pointer-events-none z-0"
        aria-hidden="true"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ════════════════════════════════════════════════════════════════
              LEFT COLUMN — Thumbnail · Content · Tags
              (Reviews have moved to the right sidebar — see right column)
          ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <motion.div variants={fadeUp} className="flex flex-col gap-6">

              {/* Thumbnail */}
              <div className="w-full h-56 sm:h-72 lg:h-80 rounded-3xl overflow-hidden border border-white/5 relative bg-[#0a0a0c]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prompt.thumbnail}
                  alt={prompt.title}
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-80" />

                {/* Floating badges */}
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
                  {/* Visibility badge on thumbnail */}
                  {prompt.visibility === "Private" && (
                    <span className="px-3 py-1.5 bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1">
                      <Lock className="size-3" aria-hidden="true" /> Premium
                    </span>
                  )}
                </div>
              </div>

              {/* Title + description */}
              <div className="flex flex-col gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight leading-tight">
                  {prompt.title}
                </h1>
                <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">
                  {prompt.description}
                </p>
              </div>

              {/* Action bar */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                {/* Copy */}
                <button
                  onClick={handleCopy}
                  disabled={isLocked}
                  aria-label={isCopied ? "Prompt copied" : "Copy prompt to clipboard"}
                  className={`h-11 px-6 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all
                    outline-none focus:ring-2 focus:ring-blue-500/40
                    ${isLocked
                      ? "bg-zinc-700/50 text-zinc-500 cursor-not-allowed border border-white/5"
                      : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
                    }`}
                >
                  {isCopied ? <Check className="size-4 text-emerald-400" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                  {isCopied ? "Copied!" : "Copy Prompt"}
                </button>

                {/* Bookmark */}
                <button
                  onClick={handleBookmark}
                  aria-label={isBookmarked ? "Remove bookmark" : "Save this prompt"}
                  aria-pressed={isBookmarked}
                  className={`h-11 px-5 border rounded-xl font-medium text-sm flex items-center gap-2 transition-all
                    outline-none focus:ring-2 focus:ring-blue-500/40
                    ${isBookmarked
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                      : "bg-[#0a0a0c] border-white/10 text-zinc-300 hover:bg-white/5 hover:border-white/20"
                    }`}
                >
                  {isBookmarked
                    ? <BookmarkFill className="size-4" aria-hidden="true" />
                    : <Bookmark className="size-4" aria-hidden="true" />
                  }
                  {isBookmarked ? "Saved" : "Save Prompt"}
                </button>

                {/* Report */}
                <button
                  onClick={handleReport}
                  aria-label="Report this prompt"
                  className="ml-auto flex items-center gap-1.5 text-sm text-zinc-500
                    hover:text-red-400 transition-colors outline-none
                    focus:ring-1 focus:ring-red-400/30 rounded px-1"
                >
                  <ShieldExclamation className="size-4" aria-hidden="true" /> Report
                </button>
              </div>
            </motion.div>

            {/* ── Prompt content ─────────────────────────────────────────── */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white">Prompt Configuration</h2>

              {isLocked ? (
                <PremiumLock />
              ) : (
                <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  {/* Fake macOS window bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-red-500/70" aria-hidden="true" />
                      <div className="size-3 rounded-full bg-amber-500/70" aria-hidden="true" />
                      <div className="size-3 rounded-full bg-emerald-500/70" aria-hidden="true" />
                      <span className="ml-3 text-xs text-zinc-500 font-mono">prompt_data.txt</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      aria-label="Copy prompt"
                      className="text-xs font-mono font-medium text-zinc-400 hover:text-white
                        flex items-center gap-1.5 transition-colors outline-none
                        focus:ring-1 focus:ring-white/20 rounded px-1"
                    >
                      {isCopied
                        ? <><Check className="size-3.5 text-emerald-400" aria-hidden="true" /> COPIED</>
                        : <><Copy className="size-3.5" aria-hidden="true" /> COPY</>
                      }
                    </button>
                  </div>
                  <div className="p-5 sm:p-6 overflow-x-auto">
                    <pre className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {prompt.content}
                    </pre>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Tags ──────────────────────────────────────────────────── */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">
                Tags & Capabilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400
                      text-xs font-medium rounded-lg hover:bg-blue-500/20 transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT COLUMN — Creator sidebar (sticky) + Reviews (scrolls)
              LAYOUT CHANGE: ReviewsSection moved here from the left column.
              The creator/stats card stays sticky; reviews scroll naturally below.
          ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* ── Creator / stats card — STICKY ──────────────────────── */}
            <motion.div
              variants={fadeUp}
              className="sticky top-24 bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.08]
                rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-5"
            >
              {/* Creator */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">
                  Created By
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar size="md" className="ring-2 ring-white/10 shrink-0">
                    <Avatar.Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(prompt.creatorName)}&background=0D8ABC&color=fff`}
                      alt={prompt.creatorName}
                    />
                    <Avatar.Fallback delayMs={600} className="bg-zinc-800 text-white">
                      {prompt.creatorName?.charAt(0).toUpperCase() || "U"}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-semibold truncate">{prompt.creatorName}</span>
                    <span className="text-xs text-zinc-500 truncate">{prompt.creatorEmail}</span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-white/5" aria-hidden="true" />

              {/* Prompt details */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">
                  Prompt Details
                </h3>

                {/* Rating + Copies grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 p-3 bg-[#030303] border border-white/5 rounded-xl shadow-inner">
                    <div className="flex items-center gap-1.5 text-zinc-400 mb-0.5">
                      <Star className="size-3.5 text-amber-400" aria-hidden="true" />
                      <span className="text-[10px] font-medium">Rating</span>
                    </div>
                    <span className="text-lg font-bold text-white leading-none">
                      {displayRating}
                      <span className="text-xs text-zinc-600 font-normal ml-1">({prompt.totalRatings})</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-[#030303] border border-white/5 rounded-xl shadow-inner">
                    <div className="flex items-center gap-1.5 text-zinc-400 mb-0.5">
                      <Copy className="size-3.5 text-blue-400" aria-hidden="true" />
                      <span className="text-[10px] font-medium">Copies</span>
                    </div>
                    <span className="text-lg font-bold text-white leading-none">{copyCount}</span>
                  </div>
                </div>

                {/* Meta table */}
                <div className="flex flex-col gap-2.5 bg-[#030303] border border-white/5 p-4 rounded-xl shadow-inner text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Calendar className="size-3.5" aria-hidden="true" /> Created
                    </div>
                    <span className="text-zinc-300 font-medium tabular-nums">{formattedDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Eye className="size-3.5" aria-hidden="true" /> Visibility
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider
                      ${prompt.visibility === "Public" ? "text-emerald-400" : "text-amber-400"}`}>
                      {prompt.visibility}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <ShieldExclamation className="size-3.5" aria-hidden="true" /> Status
                    </div>
                    <StatusBadge status={prompt.status} />
                  </div>
                </div>
              </div>

              {/* Premium upgrade CTA — shown in sidebar if locked */}
              {isLocked && (
                <Link
                  href="/plans"
                  aria-label="View premium plans to unlock this prompt"
                  className={`w-full h-10 bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                    text-black text-sm font-bold rounded-xl transition-colors flex items-center
                    justify-center gap-2 shadow-[0_4px_14px_rgba(245,158,11,0.3)]
                    outline-none focus:ring-2 focus:ring-amber-400/50`}
                >
                  <Lock className="size-3.5" aria-hidden="true" />
                  Subscribe to Premium
                </Link>
              )}
            </motion.div>

            {/* ── Reviews section — NOT sticky, scrolls below creator card ── */}
            {/*
              LAYOUT CHANGE: ReviewsSection moved from the bottom of the LEFT
              column to HERE in the RIGHT column, as shown in the reference image.
              The sticky creator card sits above; reviews scroll naturally below.
              The whileInView animations in ReviewCard create the "notification
              one by one" entrance effect as the user scrolls.
            */}
            {!isLocked && (
              <motion.div variants={fadeUp}>
                <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.08]
                  rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                  <ReviewsSection
                    promptId={prompt._id}
                    user={user}
                    reviews={reviews ?? []}
                    stats={{ rating: prompt.rating ?? 0, total: prompt.totalRatings ?? 0 }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Report modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        promptId={prompt._id}
        creatorId={prompt.creatorId}
        user={user}
      />

      {/* Toast notification (replaces all alert() calls) */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}