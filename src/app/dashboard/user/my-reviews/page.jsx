import Reviews from "@/components/allprompts/details/reviews/Reviews";


export const metadata = {
  title: "Reviews Management | NeuPrompt",
  description: "Manage your reviews and see feedback on your prompts.",
};

export default function DashboardReviewsPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">
            Reviews
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Manage your reviews and see feedback on your prompts.
          </p>
        </div>

        <Reviews />
      </div>
    </div>
  );
}