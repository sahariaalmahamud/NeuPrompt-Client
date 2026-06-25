import AdminAllPrompts from "@/components/dashboard/admin/prompts/AdminAllPrompts";
import { getAdminAllPrompts } from "@/lib/api/prompts";

export const metadata = {
  title: "Prompt Management | Admin Dashboard",
  description: "Review, moderate, and manage marketplace prompts.",
};

export default async function AdminPromptsPage() {
  // BACKEND INTEGRATION:
  //   Replace with a real server-side call that accepts initial filter/page params:
  //   const prompts = await getAdminAllPrompts({ status: "All", page: 1 });
  //   Also fetch the true total count: const total = await db.prompts.countDocuments();
  const allPrompts = await getAdminAllPrompts();
  const totalCount     = allPrompts?.length ?? 0; // replace with db.countDocuments()

  return (
    /*
      Responsive padding — mirrors the pattern used on all other dashboard pages:
        mobile  (<640px)  : px-4, pt-14 (clears the hamburger), pb-20 (bottom nav)
        sm      (640px+)  : px-6, pt-6, pb-8
        lg      (1024px+) : px-8
        xl      (1280px+) : px-10
        2xl     (1536px+) : px-12
    */
    <div className="min-h-screen bg-[#030303] px-4 pt-14 pb-20 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 xl:px-10 2xl:px-12 relative overflow-x-hidden">

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute top-0 right-1/4 w-[600px] h-[400px] bg-purple-600/5 blur-[150px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/3 left-0 w-[500px] h-[400px] bg-blue-700/5 blur-[120px] rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto relative z-10 flex flex-col gap-6 sm:gap-8">

        {/* Page header */}
        <header>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-purple-500/70 mb-1.5 font-mono">
            Admin / Prompt Management
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Prompt Management
              </h1>
              <p className="mt-1.5 text-sm text-zinc-400 max-w-xl leading-relaxed">
                Review, moderate, and manage marketplace prompts. Approve submissions or reject them with feedback.
              </p>
            </div>

            {/* Live count pill */}
            <div
              aria-label={`${totalCount} prompts in database`}
              className="shrink-0 flex items-center gap-2 h-8 px-3 rounded-full bg-white/[0.04] border border-white/[0.07] text-xs text-zinc-400"
            >
              <span className="size-1.5 rounded-full bg-purple-500 animate-pulse" aria-hidden="true" />
              <span className="text-white font-semibold">{totalCount.toLocaleString()}</span>
              {totalCount === 1 ? "prompt" : "prompts"} found
            </div>
          </div>
        </header>

        {/* Client application */}
        <AdminAllPrompts allPrompts={allPrompts} />
      </div>
    </div>
  );
}