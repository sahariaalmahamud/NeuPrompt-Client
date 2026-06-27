import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";

export const metadata = {
  title: "Premium Subscription | NeuPrompt",
  description: "Unlock unlimited prompt publishing and premium features.",
};

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-hidden pb-24">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Client Component Orchestrator */}
      <div className="relative z-10">
        <SubscriptionPlans />
      </div>
    </div>
  );
}