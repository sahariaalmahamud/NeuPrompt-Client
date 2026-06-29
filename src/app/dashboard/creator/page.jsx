import CreatorStats from "@/components/dashboard/creator/CreatorStats";
import { getMyPrompts } from "@/lib/api/prompts";
import { getUserSession } from "@/lib/core/session";


export default async function CreatorDashboardHomePage() {
  // Fetch user session securely on the server
  const user = await getUserSession();

  const myStats = await getMyPrompts(user?.id);

  return (
    <div className="max-w-[90%] mx-auto w-full">
      {/* 🚀 HEADER SECTION (Server Rendered) */}
      <div className="mb-8 flex flex-col gap-1">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          Welcome back, {user?.name || "Creator"}!
        </h2>
        <p className="text-sm text-zinc-400">
          Here is an overview of your prompt performance and ecosystem impact.
        </p>
      </div>

      {/* 📊 STATS GRID (Client Component) */}
      <CreatorStats myStats={myStats} />
    </div>
  );
}