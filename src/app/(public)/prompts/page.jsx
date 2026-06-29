import AllPrompts from "@/components/allprompts/AllPrompts";
import { getAllPrompts } from "@/lib/api/prompts";

export const metadata = {
  title: "Explore Prompts | NeuPrompt",
  description: "Discover high-quality AI prompts created by the community.",
};

export default async function MarketplacePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialSearch = typeof resolvedSearchParams?.search === "string"
    ? resolvedSearchParams.search
    : "";
  const data = await getAllPrompts({ search: initialSearch });

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-hidden mt-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12 space-y-4 pt-8">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white">
            Explore AI Prompts
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Discover high-quality, production-ready prompts created by the community to supercharge your workflow.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            {data.total.toLocaleString()} Prompts Available
          </div>
        </div>

        <AllPrompts
          allprompts={data.prompts}
          initialTotal={data.total}
          initialTotalPages={data.totalPages}
          initialSearch={initialSearch}
        />
      </div>
    </div>
  );
}