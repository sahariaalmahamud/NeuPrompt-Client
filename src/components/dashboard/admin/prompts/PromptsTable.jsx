import PromptRow from "./PromptRow";
import PromptMobileCard from "./PromptMobileCard";
import { toggleFeaturePrompt } from "@/lib/actions/prompts";

// ─── Column definition ────────────────────────────────────────────────────────
const COLUMNS = [
  { key: "info",     label: "Prompt info",  align: "left",   scope: "col" },
  { key: "creator",  label: "Creator",      align: "left",   scope: "col" },
  { key: "settings", label: "Settings",     align: "left",   scope: "col" },
  { key: "status",   label: "Status",       align: "center", scope: "col" },
  { key: "date",     label: "Date",         align: "right",  scope: "col" },
  { key: "actions",  label: "Actions",      align: "right",  scope: "col" },
];

export default function PromptsTable({ prompts, onOpenModal, onToggleFeature }) {
  return (
    <div className="w-full">

      {/* ── Desktop / Tablet table (≥768px) ───────────────────────────────── */}
      <div className={`hidden md:block bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl
        shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden`}>
        <div className="overflow-x-auto scrollbar-none">
          <table
            className="w-full min-w-[900px] border-collapse text-left"
            role="table"
            aria-label="Admin prompts management table"
          >
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    scope={col.scope}
                    className={`px-5 py-3.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest
                      select-none text-${col.align}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {prompts.map((prompt) => (
                <PromptRow
                  key={prompt._id}
                  prompt={prompt}
                  onOpenModal={onOpenModal}
                  onToggleFeature={onToggleFeature}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile card list (<768px) ──────────────────────────────────────── */}
      <div className="flex md:hidden flex-col gap-3" role="list" aria-label="Prompts list">
        {prompts.map((prompt, index) => (
          <div key={prompt._id} role="listitem">
            <PromptMobileCard
              prompt={prompt}
              index={index}
              onOpenModal={onOpenModal}
              toggleFeaturePrompt={toggleFeaturePrompt}
            />
          </div>
        ))}
      </div>
    </div>
  );
}