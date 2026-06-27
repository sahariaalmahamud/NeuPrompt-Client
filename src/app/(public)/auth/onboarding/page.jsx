"use client";

import { useState, useEffect } from "react";
import { Button, Spinner } from "@heroui/react";
import { Person, Compass, Check } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [role, setRole] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // ----------------------------------------------------------------------
  // TRAFFIC CONTROLLER LOGIC
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      // Not logged in -> send to signin
      router.replace("/auth/signin");
      return;
    }

    if (session.user.onboardingCompleted) {
      // Existing User -> Redirect instantly based on role
      if (session.user.role === "creator") {
        router.replace("/dashboard/creator");
      } else {
        router.replace("/prompts");
      }
    } else {
      // New User -> Stop checking, show onboarding UI
      setIsCheckingStatus(false);
    }
  }, [session, isPending, router]);

  // ----------------------------------------------------------------------
  // SUBMIT ONBOARDING
  // ----------------------------------------------------------------------
  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Update the user profile with their chosen role and mark onboarding complete
      const { error: updateError } = await authClient.updateUser({
        role: role,
        onboardingCompleted: true 
      });

      if (updateError) throw new Error(updateError.message);

      // Route to correct dashboard
      if (role === "creator") {
        router.push("/dashboard/creator");
      } else {
        router.push("/marketplace");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Show a blank loading state while determining where to send the user
  if (isPending || isCheckingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303]">
        <Spinner size="lg" color="white" />
      </div>
    );
  }

  // Get user initials for the fallback avatar
  const initials = session?.user?.name 
    ? session.user.name.charAt(0).toUpperCase() 
    : "U";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4 py-12 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl flex flex-col items-center"
      >
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-3 mb-10">
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt="Avatar" 
              className="w-16 h-16 rounded-full object-cover mb-2 ring-2 ring-white/10" 
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#D81B60] text-white flex items-center justify-center text-2xl font-semibold mb-2">
              {initials}
            </div>
          )}
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Welcome, {session?.user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            You're almost there. How do you plan to use NeuPrompt?
          </p>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col sm:flex-row w-full gap-4 mb-8">
          
          {/* User / Buyer Card */}
          <div 
            onClick={() => setRole("user")}
            className={`flex-1 relative cursor-pointer flex flex-col items-center text-center gap-4 p-8 rounded-2xl border transition-all duration-200 ${
              role === "user" 
                ? "bg-[#0A101D] border-blue-600" 
                : "bg-[#121212] border-white/10 hover:border-white/20"
            }`}
          >
            {role === "user" && (
              <div className="absolute top-4 right-4 text-blue-500">
                <Check size={18} />
              </div>
            )}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              role === "user" ? "bg-blue-600/20 text-blue-500" : "bg-white/5 text-zinc-500"
            }`}>
              <Compass size={20} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-white font-semibold text-lg">User / Buyer</span>
              <span className="text-sm text-zinc-500 leading-relaxed px-2">
                I want to explore, purchase, and use high-quality AI prompts.
              </span>
            </div>
          </div>

          {/* Prompt Creator Card */}
          <div 
            onClick={() => setRole("creator")}
            className={`flex-1 relative cursor-pointer flex flex-col items-center text-center gap-4 p-8 rounded-2xl border transition-all duration-200 ${
              role === "creator" 
                ? "bg-[#0A101D] border-blue-600" 
                : "bg-[#121212] border-white/10 hover:border-white/20"
            }`}
          >
            {role === "creator" && (
              <div className="absolute top-4 right-4 text-blue-500">
                <Check size={18} />
              </div>
            )}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              role === "creator" ? "bg-blue-600/20 text-blue-500" : "bg-white/5 text-zinc-500"
            }`}>
              <Person size={20} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-white font-semibold text-lg">Prompt Creator</span>
              <span className="text-sm text-zinc-500 leading-relaxed px-2">
                I want to engineer, publish, and monetize my AI prompts.
              </span>
            </div>
          </div>

        </div>

        {error && (
          <div className="w-full px-4 py-3 mb-4 text-sm font-medium rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <Button
          onClick={handleCompleteSetup}
          isLoading={isSubmitting}
          className="w-full sm:w-2/3 max-w-sm font-semibold rounded-2xl text-base h-14 bg-white text-black hover:bg-zinc-200 transition-all"
        >
          Complete Setup
        </Button>

      </motion.div>
    </div>
  );
}