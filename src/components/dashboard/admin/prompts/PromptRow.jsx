import Link from "next/link";
import { Eye, Check, Xmark, Star, TrashBin } from "@gravity-ui/icons";
import { StatusBadge, VisibilityBadge, FeaturedBadge } from "./Badges";

// ─── ActionIconButton ─────────────────────────────────────────────────────────
// Small icon button used in the actions column.
// NOT wrapped inside any other button — avoids the <button> inside <button> hydration error.
function ActionIconButton({ onClick, href, label, variant = "default", children }) {
  const base = "size-8 rounded-lg flex items-center justify-center transition-all duration-150 outline-none focus:ring-1";
  const variants = {
    default: `${base} text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10 focus:ring-white/20`,
    approve: `${base} text-emerald-400 bg-emerald-500/10 hover:text-emerald-300 hover:bg-emerald-500/20 focus:ring-emerald-500/30`,
    reject:  `${base} text-red-400 bg-red-500/10 hover:text-red-300 hover:bg-red-500/20 focus:ring-red-500/30`,
    feature: `${base} text-purple-400 bg-purple-500/10 hover:text-purple-300 hover:bg-purple-500/20 focus:ring-purple-500/30`,
    danger:  `${base} text-zinc-500 bg-white/5 hover:text-red-400 hover:bg-red-500/10 focus:ring-red-500/20`,
  };
  if (href) {
    return (
      <Link href={href} aria-label={label} className={variants[variant]}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} className={variants[variant]}>
      {children}
    </button>
  );
}

// ─── PromptRow ────────────────────────────────────────────────────────────────
// Pure <tr> — no HeroUI Table.Row / Table.Cell compounds.
export default function PromptRow({ prompt, onOpenModal, onToggleFeature }) {
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

  return (
    <tr className="group hover:bg-white/[0.02] transition-colors duration-150 border-b border-white/[0.04] last:border-0">

      {/* Prompt info */}
      <td className="px-5 py-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold text-white truncate max-w-[260px] lg:max-w-[320px]">
            {prompt.title}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">{prompt.category}</span>
            <span className="size-1 rounded-full bg-white/20 shrink-0" aria-hidden="true" />
            <span className="text-xs text-zinc-500">{prompt.aiTool}</span>
          </div>
        </div>
      </td>

      {/* Creator */}
      <td className="px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-zinc-200">{prompt.creatorName}</span>
          <span className="text-xs text-zinc-500 truncate max-w-[180px]">{prompt.creatorEmail}</span>
        </div>
      </td>

      {/* Settings */}
      <td className="px-5 py-4">
        <div className="flex flex-col items-start gap-1.5">
          <VisibilityBadge visibility={prompt.visibility} />
          <FeaturedBadge featured={prompt.featured} />
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4 text-center">
        <StatusBadge status={prompt.status} />
      </td>

      {/* Date */}
      <td className="px-5 py-4 text-right">
        <span className="text-xs text-zinc-500 tabular-nums">{formattedDate}</span>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-150">

          <ActionIconButton
            href={`/prompts/${prompt._id}`}
            label={`View "${prompt.title}"`}
            variant="default"
          >
            <Eye className="size-3.5" aria-hidden="true" />
          </ActionIconButton>

          <ActionIconButton
            onClick={() => onOpenModal("approve", prompt)}
            label={`Approve "${prompt.title}"`}
            variant="approve"
          >
            <Check className="size-3.5" aria-hidden="true" />
          </ActionIconButton>

          <ActionIconButton
            onClick={() => onOpenModal("reject", prompt)}
            label={`Reject "${prompt.title}"`}
            variant="reject"
          >
            <Xmark className="size-3.5" aria-hidden="true" />
          </ActionIconButton>

          <ActionIconButton
            onClick={() => onToggleFeature(prompt._id, prompt.featured)}
            label={prompt.featured ? `Remove feature from "${prompt.title}"` : `Feature "${prompt.title}"`}
            variant={prompt.featured ? "feature" : "default"}
          >
            <Star className="size-3.5" aria-hidden="true" />
          </ActionIconButton>

          <ActionIconButton
            onClick={() => onOpenModal("delete", prompt)}
            label={`Delete "${prompt.title}"`}
            variant="danger"
          >
            <TrashBin className="size-3.5" aria-hidden="true" />
          </ActionIconButton>
        </div>
      </td>
    </tr>
  );
}