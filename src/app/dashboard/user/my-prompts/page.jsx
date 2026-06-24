import MyPrompts from "@/components/dashboard/MyPrompts";
import { getMyPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata = {
  title: "My Prompts | NeuPrompt",
  description: "Manage your published and drafted AI prompts.",
};

export default async function MyPromptsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Unauthorized. Please sign in.</p>
      </div>
    );
  }

  const prompts = await getMyPrompts(session.user.id);

  return (
    /*
      Responsive padding (pairs with sidebar widths):
        mobile  (<640px)  : px-4, pt-14 (clears hamburger button), pb-20 (bottom nav bar)
        sm      (640px+)  : px-6, pt-6, pb-8
        lg      (1024px+) : px-8
        xl      (1280px+) : px-10
        2xl     (1536px+) : px-12, max content width extended
    */
    <div className="min-h-screen bg-[#030303] px-4 pt-14 pb-20 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 xl:px-10 2xl:px-12 relative overflow-x-hidden">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[400px] bg-purple-700/5 blur-[120px] rounded-full" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-1/3 left-0 w-[500px] h-[400px] bg-blue-700/5 blur-[120px] rounded-full" aria-hidden="true" />

      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto relative z-10 flex flex-col gap-6 sm:gap-8">

        {/* Page header */}
        <header>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-500/70 mb-1.5 font-mono">
            Dashboard / My Prompts
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                My Prompts
              </h1>
              <p className="mt-1.5 text-sm text-zinc-400 max-w-xl leading-relaxed">
                Track performance, update content, and manage visibility for all your published prompts.
              </p>
            </div>
            {/* Stats pill */}
            {prompts?.length > 0 && (
              <div className="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/[0.04] border border-white/[0.07] text-xs text-zinc-400">
                <span className="text-white font-semibold">{prompts.length}</span>
                prompt{prompts.length !== 1 ? "s" : ""} total
              </div>
            )}
          </div>
        </header>

        <MyPrompts prompts={prompts ?? []} />
      </div>
    </div>
  );
}


