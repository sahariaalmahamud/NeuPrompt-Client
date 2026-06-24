"use client";

const FILTER_CONFIG = {
  aiTool: ["All", "ChatGPT", "Claude", "Gemini", "Midjourney", "Stable Diffusion", "Other"],
  category: ["All", "Writing", "Marketing", "Coding", "Business", "Education", "Productivity", "Design", "Social Media", "Research", "Other"],
  difficulty: ["All", "Beginner", "Intermediate", "Advanced"]
};

export default function FiltersSidebar({ filters, onFilterChange }) {
  
  const FilterSection = ({ title, type, options }) => (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-mono">
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        {options.map((option) => {
          const isActive = filters[type] === option;
          return (
            <button
              key={option}
              onClick={() => onFilterChange(type, option)}
              className={`text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                isActive 
                  ? "bg-blue-500/10 text-blue-400 font-medium" 
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#0a0a0c]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex flex-col gap-8">
      <FilterSection title="AI Engine" type="aiTool" options={FILTER_CONFIG.aiTool} />
      <div className="h-px w-full bg-white/5" />
      <FilterSection title="Category" type="category" options={FILTER_CONFIG.category} />
      <div className="h-px w-full bg-white/5" />
      <FilterSection title="Difficulty" type="difficulty" options={FILTER_CONFIG.difficulty} />
    </div>
  );
}