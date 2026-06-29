
import UserProfileCard from "@/components/dashboard/profile/UserProfileCard";
import { getMyPrompts } from "@/lib/api/prompts";
import { getSubscription } from "@/lib/api/subscriptions";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "My Profile | NeuPrompt",
  description: "Manage your NeuPrompt account and subscription.",
};

const UserProfilePage = async () => {
  const user = await getUserSession();
  const subscription = await getSubscription(user?.id);
  const prompts = await getMyPrompts(user?.id);
  
  const promptCount = Array.isArray(prompts) ? prompts.length : 0;

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />
      
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Account Overview
          </h1>
          <p className="text-zinc-400 text-sm">
            Manage your profile, view statistics, and handle billing details.
          </p>
        </div>

        <UserProfileCard 
          user={user} 
          subscription={subscription} 
          promptCount={promptCount} 
        />
      </div>
    </div>
  );
};

export default UserProfilePage;