// components/dashboard/admin/reports/ConfirmActionModal.jsx
// ─────────────────────────────────────────────────────────────
// CLIENT COMPONENT — accessible confirmation dialog shown before
// any destructive or significant admin action.
//
// Design decisions:
//   • Uses a native <dialog> element for built-in accessibility:
//     - Focus is trapped inside automatically
//     - Escape key closes it natively
//     - aria-modal="true" tells screen readers to ignore content
//       behind it
//   • Backdrop uses ::backdrop pseudo-element (via Tailwind's
//     backdrop: modifier) — no extra wrapper div needed
//   • NOT using framer-motion to keep the bundle lighter; the
//     CSS animation is done with a @keyframes rule
//
// Props:
//   isOpen    boolean
//   config    { action, report, cfg } | null
//   onConfirm function — fires when "Confirm" is clicked
//   onClose   function — fires when dismissed (cancel / backdrop / Esc)
//
// config.cfg shape (from ACTION_CONFIG in ReportsPage):
//   title        string
//   getMessage   (report) => string
//   confirmText  string
//   confirmColor "danger" | "warning" | "success" | "neutral"
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef } from "react";

// ── Confirm button colour variants ────────────────────────────
const CONFIRM_STYLES = {
  danger:  "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
  warning: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
  neutral: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20",
};

// Border accent colour for the modal itself based on action severity
const MODAL_BORDER = {
  danger:  "border-red-500/20",
  warning: "border-orange-500/20",
  success: "border-emerald-500/20",
  neutral: "border-white/[0.08]",
};

// ─────────────────────────────────────────────────────────────

export default function ConfirmActionModal({ isOpen, config, onConfirm, onClose }) {
  const dialogRef = useRef(null);

  // Open / close the native <dialog> element in sync with isOpen prop.
  // showModal() sets up focus trapping and aria-modal behaviour.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // Prevent calling showModal() if already open (throws in strict mode)
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // Sync native Escape key to onClose so state is always correct.
  // (The dialog closes visually on Esc but we must also update React state.)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleNativeClose = () => onClose();
    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, [onClose]);

  // Close when clicking the backdrop (the <dialog> element itself,
  // not its inner content box)
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) onClose();
  };

  // Don't render inner content until we have a config — prevents a
  // flash of empty content when the modal is closing
  const cfg       = config?.cfg;
  const report    = config?.report;
  const color     = cfg?.confirmColor ?? "neutral";
  const message   = cfg && report ? cfg.getMessage(report) : "";

  return (
    /*
      <dialog> renders into a top-layer, above all z-index stacking
      contexts — no z-index needed. Tailwind's `backdrop:` modifier
      styles the ::backdrop pseudo-element.
    */
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      className={`
        w-[calc(100%-2rem)] max-w-sm rounded-2xl p-0 border
        bg-[#0a0a0c] text-white shadow-2xl
        backdrop:bg-black/70 backdrop:backdrop-blur-sm
        open:animate-[modalIn_0.18s_ease_forwards]
        ${cfg ? MODAL_BORDER[color] : "border-white/[0.08]"}
      `}
      style={{
        // Reset browser <dialog> defaults that vary by browser
        margin: "auto",
        outline: "none",
      }}
    >
      {/* We check cfg before rendering so TypeScript (if used) is happy */}
      {cfg && report && (
        <>
          {/* Modal header */}
          <div className="px-6 pt-6 pb-2">
            <h2
              id="modal-title"
              className="text-lg font-bold text-white"
            >
              {cfg.title}
            </h2>
          </div>

          {/* Modal body */}
          <div
            id="modal-desc"
            className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed"
          >
            {message}
          </div>

          {/* Modal footer */}
          <div className="px-4 py-3 border-t border-white/[0.06] bg-[#030303] rounded-b-2xl flex items-center justify-end gap-3">
            {/* Cancel — always neutral ghost */}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-500
                         hover:text-white transition-colors duration-150"
            >
              Cancel
            </button>

            {/* Confirm — colour reflects the severity of the action */}
            <button
              onClick={onConfirm}
              className={`px-5 py-2 text-sm font-semibold rounded-xl border
                          transition-colors duration-150
                          ${CONFIRM_STYLES[color]}`}
            >
              {cfg.confirmText}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}

/*
  Keyframe for the modal entrance animation.
  Add this to your global CSS / tailwind.config.js theme.extend:

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }

  tailwind.config.js:
  theme: {
    extend: {
      keyframes: {
        modalIn: {
          from: { opacity: "0", transform: "scale(0.95) translateY(8px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        modalIn: "modalIn 0.18s ease forwards",
      },
    },
  },
*/