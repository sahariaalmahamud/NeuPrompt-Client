import CreatorDashboardClient from "@/components/dashboard/userhome/CreatorDashboardClient";
import { getCreatorStats, getGrowth, getPerformance, getTopPrompts } from "@/lib/api/prompts";
import { getUserSession } from "@/lib/core/session";


export const metadata = {
  title: "Creator Analytics | NeuPrompt Dashboard",
  description: "Overview of your prompt performance and ecosystem impact.",
};


export default async function CreatorDashboardPage() {
  // TODO: Connect to backend API
  const user = await getUserSession();
  const creatorId = user?.id;

  console.log('creatorId', creatorId);
  const [
    stats,
    performance,
    growth,
    topPrompts,
  ] = await Promise.all([
    getCreatorStats(creatorId),
    getPerformance(creatorId),
    getGrowth(creatorId),
    getTopPrompts(creatorId),
  ]);

    console.log('dashboard home page', 'stats:', stats, 'performance:', performance, 'growth:', growth, 'topPrompts:', topPrompts);



  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-hidden pb-20">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white">
            Creator Dashboard
          </h1>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base">
            Welcome back! Here is an overview of your prompt performance and ecosystem impact.
          </p>
        </div>

        {/* Client Component carrying the interactive UI */}
        <CreatorDashboardClient
          stats={stats}
          performance={performance}
          growth={growth}
          topPrompts={topPrompts}
        />
      </div>
    </div>
  );
}