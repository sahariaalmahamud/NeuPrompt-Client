"use client";

import { approvePrompt } from "@/lib/actions/prompts";
import ConfirmModal from "./ConfirmModal";
import { Check } from "@gravity-ui/icons";

// ─── ApprovePromptModal ───────────────────────────────────────────────────────
// BACKEND INTEGRATION:
//   handleApprove → PATCH /api/admin/prompts/${prompt._id}/approve
//   On success: optimistically update the parent list (setPrompts in AdminAllPrompts)
//   On error: show a toast and keep the modal open.
// ─────────────────────────────────────────────────────────────────────────────

export default function ApprovePromptModal({ isOpen, onClose, prompt }) {
  if (!prompt) return null;

  const handleApprove = async () => {
    // BACKEND INTEGRATION POINT — replace console.log with the API call:
    // await fetch(`/api/admin/prompts/${prompt._id}/approve`, { method: "PATCH" });
    approvePrompt(prompt._id);
    onClose();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Approve prompt"
      accentColor="emerald"
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            aria-label={`Approve prompt: ${prompt.title}`}
            className="h-9 px-5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700
              text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(16,185,129,0.25)]
              flex items-center gap-2"
          >
            <Check className="size-4" aria-hidden="true" />
            Approve
          </button>
        </>
      }
    >
      <p className="text-sm text-zinc-400 leading-relaxed">
        Approve{" "}
        <span className="text-white font-medium">"{prompt.title}"</span>?
        It will become live on the marketplace immediately.
      </p>
    </ConfirmModal>
  );
}