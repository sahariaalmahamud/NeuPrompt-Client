"use client";

import { useEffect, useRef } from "react";

const CONFIRM_STYLES = {
  danger:  "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
  warning: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
  neutral: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20 hover:bg-zinc-500/20",
};

const BORDER_STYLES = {
  danger:  "border-red-500/20",
  warning: "border-orange-500/20",
  neutral: "border-white/[0.08]",
};

export default function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  confirmColor = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}) {
  const dialogRef = useRef(null);

  // Sync the native <dialog> open/close state with isOpen prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Native Escape / native close events should also update parent state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Click on the backdrop (the <dialog> element itself, not its content) closes it
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current && !isLoading) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className={`w-[calc(100%-2rem)] max-w-sm sm:max-w-sm rounded-2xl p-0 border
        bg-[#121214] text-white shadow-2xl
        backdrop:bg-black/70 backdrop:backdrop-blur-sm
        open:animate-[modalIn_0.18s_ease_forwards]
        ${BORDER_STYLES[confirmColor]}`}
      style={{ margin: "auto", outline: "none" }}
    >
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-2">
        <h2 id="confirm-modal-title" className="text-base sm:text-lg font-bold text-white">
          {title}
        </h2>
      </div>

      <div
        id="confirm-modal-desc"
        className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-zinc-400 leading-relaxed"
      >
        {message}
      </div>

      <div className="px-4 py-3 border-t border-white/[0.06] bg-[#0c0c0e] rounded-b-2xl flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="h-10 sm:h-9 px-4 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`h-10 sm:h-9 px-5 text-sm font-semibold rounded-xl border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${CONFIRM_STYLES[confirmColor]}`}
        >
          {isLoading ? "Please wait…" : confirmText}
        </button>
      </div>
    </dialog>
  );
}

