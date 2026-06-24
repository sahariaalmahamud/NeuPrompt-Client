import AllPrompts from "@/components/marketplace/AllPrompts";

export const metadata = {
  title: "Explore Prompts | NeuPrompt",
  description: "Discover high-quality AI prompts created by the community.",
};

// MOCK DATA: Represents the initial load from the database
// BACKEND INTEGRATION: Replace with actual db.prompts.find({ status: "approved", visibility: "Public" })
const getMarketplacePrompts = async () => {
  return [
    {
      _id: "m_1",
      title: "Ultimate SEO Blog Post Generator",
      description: "Generates fully optimized 2000-word articles with LSI keywords and meta tags.",
      content: "Act as an expert SEO copywriter...",
      category: "Marketing",
      aiTool: "ChatGPT",
      difficulty: "Intermediate",
      tags: ["seo", "blog"],
      thumbnail: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=600&q=80",
      visibility: "Public",
      status: "approved",
      copyCount: 1240,
      rating: 4.9,
      totalRatings: 86,
      featured: true,
      creatorId: "u_1",
      creatorName: "Alex Rivera",
      creatorEmail: "alex@example.com",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "m_2",
      title: "React SaaS Component Scaffolder",
      description: "Create production-ready React components with Tailwind CSS and Framer Motion.",
      content: "Write a React functional component...",
      category: "Coding",
      aiTool: "Claude",
      difficulty: "Advanced",
      tags: ["react", "tailwind"],
      thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=600&q=80",
      visibility: "Public",
      status: "approved",
      copyCount: 843,
      rating: 4.7,
      totalRatings: 42,
      featured: false,
      creatorId: "u_2",
      creatorName: "Sarah Chen",
      creatorEmail: "sarah@example.com",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "m_3",
      title: "Cold Email Conversion Sequence",
      description: "A 5-part cold email sequence designed to maximize B2B response rates.",
      content: "Write a 5-part cold email sequence...",
      category: "Business",
      aiTool: "Gemini",
      difficulty: "Beginner",
      tags: ["sales", "email"],
      thumbnail: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80",
      visibility: "Public",
      status: "approved",
      copyCount: 231,
      rating: 0, // Testing 0 rating state
      totalRatings: 0,
      featured: false,
      creatorId: "u_3",
      creatorName: "Marcus Doe",
      creatorEmail: "marcus@example.com",
      createdAt: new Date().toISOString(),
    }
  ];
};

export default async function MarketplacePage() {
  const initialPrompts = await getMarketplacePrompts();
  
  // Example count: In production, run a db.prompts.countDocuments()
  const totalAvailable = 1240; 

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Top Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-12 space-y-4 pt-8">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white">
            Explore AI Prompts
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Discover high-quality, production-ready prompts created by the community to supercharge your workflow.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {totalAvailable.toLocaleString()} Prompts Available
          </div>
        </div>

        {/* Client Layout Component */}
        <AllPrompts initialPrompts={initialPrompts} />
        
      </div>
    </div>
  );
}