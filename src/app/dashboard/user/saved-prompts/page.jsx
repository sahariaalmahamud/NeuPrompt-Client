
import SavedPrompts from "@/components/dashboard/user/bookmarks/SavedPrompts";
import { getBookmarks } from "@/lib/api/bookmarks";
import { getUserSession } from "@/lib/core/session";
// import { auth } from "@/lib/auth"; // Adjust auth import
// import { headers } from "next/headers";

export const metadata = {
  title: "Saved Prompts | NeuPrompt",
  description: "Access and manage your bookmarked AI prompts.",
};


export default async function SavedPromptsPage() {
  // 1. Get user session securely on the server
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  const user = await getUserSession();

  // console.log('session', session);

  // Handle unauthorized state (or let middleware handle it)
  if (!user) {
    return <div className="min-h-screen bg-[#030303] text-white p-10">Unauthorized. Please log in.</div>;
  }

  // 2. Fetch the bookmarks for this user
  const bookmarks = await getBookmarks(user.id);

  return (
    <div className="min-h-screen bg-[#030303] p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Subtle Background Glow for Aesthetic */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Saved Prompts
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
            Access and manage the prompts you have bookmarked for later.
          </p>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium w-max">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {bookmarks.length} Prompts Saved
          </div>
        </div>

        {/* 3. Pass data to Client Component */}
        <SavedPrompts bookmarks={bookmarks} userId={user.id}/>

      </div>
    </div>
  );
}