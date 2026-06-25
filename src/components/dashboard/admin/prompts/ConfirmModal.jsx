"use client";

import { useEffect, useRef } from "react";
import { Xmark } from "@gravity-ui/icons";

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
// A headless portal modal that replaces the broken HeroUI Modal compound API
// (Modal.Backdrop / Modal.Container / Modal.Dialog etc. don't exist in HeroUI).
//
// Props:
//   isOpen      : boolean
//   onClose     : () => void
//   title       : string
//   accentColor : "emerald" | "red" | "amber"  — controls border + button color
//   footer      : ReactNode  — action buttons slot
//   children    : ReactNode  — body content
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = {
  emerald: { border: "border-emerald-500/20", glow: "shadow-[0_0_40px_rgba(16,185,129,0.08)]" },
  red:     { border: "border-red-500/20",     glow: "shadow-[0_0_40px_rgba(239,68,68,0.08)]" },
  amber:   { border: "border-amber-500/20",   glow: "shadow-[0_0_40px_rgba(245,158,11,0.08)]" },
};

export default function ConfirmModal({ isOpen, onClose, title, accentColor = "emerald", footer, children }) {
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const accent = ACCENT[accentColor] ?? ACCENT.emerald;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        className={`relative w-full max-w-md bg-[#0a0a0c] border ${accent.border} ${accent.glow}
          rounded-2xl overflow-hidden flex flex-col
          animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Top accent line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="size-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white
              hover:bg-white/5 transition-colors outline-none focus:ring-1 focus:ring-white/20"
          >
            <Xmark className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-white/5 bg-[#060608] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}