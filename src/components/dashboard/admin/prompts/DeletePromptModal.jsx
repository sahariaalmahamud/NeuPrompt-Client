"use client";

import { adminDeletePrompt } from "@/lib/actions/prompts";
import ConfirmModal from "./ConfirmModal";
import { TrashBin } from "@gravity-ui/icons";

// ─── DeletePromptModal ────────────────────────────────────────────────────────
// BACKEND INTEGRATION:
//   handleDelete → DELETE /api/prompts/${prompt._id}
//   On success: remove the prompt from the parent list (setPrompts filter in AdminAllPrompts).
//   On error: keep the modal open and show an error toast.
// ─────────────────────────────────────────────────────────────────────────────

export default function DeletePromptModal({ isOpen, onClose, prompt }) {
  if (!prompt) return null;

  const handleDelete = async () => {
    try {
      await adminDeletePrompt(prompt._id);

      onClose();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete prompt"
      accentColor="red"
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            aria-label={`Permanently delete prompt: ${prompt.title}`}
            className="h-9 px-5 text-sm font-semibold bg-red-600 hover:bg-red-500 active:bg-red-700
              text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(239,68,68,0.25)]
              flex items-center gap-2"
          >
            <TrashBin className="size-4" aria-hidden="true" />
            Delete permanently
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {/* Icon */}
        <div className="size-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <TrashBin className="size-5 text-red-400" aria-hidden="true" />
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Permanently delete{" "}
          <span className="text-white font-medium">"{prompt.title}"</span>?
          This action cannot be undone and will remove all associated data.
        </p>
      </div>
    </ConfirmModal>
  );
}