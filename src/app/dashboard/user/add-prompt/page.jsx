import AddPromptForm from "@/components/dashboard/forms/AddPromptForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata = {
  title: "Create Prompt | NeuPrompt",
  description: "Publish a new AI prompt to the marketplace.",
};

export default async function AddPromptPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    /*
      Responsive padding strategy:
        mobile  (<640px)  : px-4, pt-4, pb-24 (room for bottom nav bar)
        sm      (640px+)  : px-6, pt-6, pb-8
        lg      (1024px+) : px-8, pt-8
        xl      (1280px+) : px-10
    */
    <div className="min-h-screen bg-[#030303] px-4 pt-4 pb-24 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-8 xl:px-10 relative overflow-x-hidden">

      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(800px,100vw)] h-[350px] bg-blue-600/8 blur-[100px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 right-0 w-[300px] h-[400px] bg-indigo-700/5 blur-[120px] rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto relative z-10">

        {/* Page header */}
        <header className="mb-6 sm:mb-8 lg:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-500/80 mb-2 font-mono">
            Dashboard / Prompts
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
            Create New Prompt
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed">
            Design, document, and publish your AI prompt to the marketplace. Prompts are reviewed before going live.
          </p>
        </header>

        <AddPromptForm user={session?.user} />
      </div>
    </div>
  );
}