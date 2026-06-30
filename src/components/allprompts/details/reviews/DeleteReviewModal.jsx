"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashBin, Xmark } from "@gravity-ui/icons";

export default function DeleteReviewModal({
  isOpen,
  onOpenChange,
  reviewId,
  onReviewDeleted,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onOpenChange(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onOpenChange]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete review");

      // Optimistic UI Update
      onReviewDeleted?.(reviewId);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong deleting the review.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onOpenChange(false); }}
        >
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="relative w-full max-w-sm bg-[#0a0a0c] border border-red-500/20 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(220,38,38,0.15)] flex flex-col"
          >
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <TrashBin size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Delete Review</h2>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Are you sure you want to delete this review? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/5 bg-[#030303] flex items-center justify-end gap-3 shrink-0">
              <button type="button" onClick={() => onOpenChange(false)} className="h-10 px-4 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg">
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDelete} 
                disabled={isDeleting} 
                className="h-10 px-5 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(220,38,38,0.25)] flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Review"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}