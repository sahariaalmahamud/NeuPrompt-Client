"use client";

import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import { Xmark } from "@gravity-ui/icons";

// ─── RejectPromptModal ────────────────────────────────────────────────────────
// BACKEND INTEGRATION:
//   handleReject → PATCH /api/admin/prompts/${prompt._id}/reject  body: { reason }
//   On success: optimistically update status to "rejected" in the parent list.
//   On error: keep the modal open and show an inline error.
// ─────────────────────────────────────────────────────────────────────────────

export default function RejectPromptModal({ isOpen, onClose, prompt }) {
  const [reason, setReason] = useState("");
  const [error, setError]   = useState("");

  // Reset form each time the modal opens
  useEffect(() => {
    if (isOpen) { setReason(""); setError(""); }
  }, [isOpen]);

  if (!prompt) return null;

  const handleReject = async () => {
    if (!reason.trim()) { setError("Please provide a rejection reason."); return; }

    // BACKEND INTEGRATION POINT — replace console.log with the API call:
    // await fetch(`/api/admin/prompts/${prompt._id}/reject`, {
    //   method: "PATCH",
    //   body: JSON.stringify({ reason }),
    //   headers: { "Content-Type": "application/json" },
    // });
    console.log("Rejecting prompt:", prompt._id, "reason:", reason);
    onClose();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject prompt"
      accentColor="amber"
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            aria-label={`Reject prompt: ${prompt.title}`}
            className="h-9 px-5 text-sm font-semibold bg-amber-600 hover:bg-amber-500 active:bg-amber-700
              text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(245,158,11,0.25)]"
          >
            Reject
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-zinc-400 leading-relaxed">
          Provide a reason for rejecting{" "}
          <span className="text-white font-medium">"{prompt.title}"</span>.
          The creator will see this note.
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="reject-reason" className="text-xs font-medium text-zinc-400">
            Rejection reason <span className="text-amber-500" aria-hidden="true">*</span>
          </label>
          <textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(""); }}
            placeholder="Explain why this prompt is being rejected…"
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? "reject-error" : undefined}
            rows={4}
            className={`w-full px-3.5 py-2.5 bg-[#060608] border rounded-xl text-sm text-white
              placeholder:text-zinc-600 outline-none resize-none transition-all duration-200
              focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 hover:border-white/15
              ${error ? "border-red-500/40" : "border-white/[0.08]"}`}
          />
          {error && (
            <p id="reject-error" role="alert" className="text-[11px] text-red-400 flex items-center gap-1">
              <span className="inline-block size-1 rounded-full bg-red-400 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
        </div>
      </div>
    </ConfirmModal>
  );
}