import Banner from "@/components/Banner";
import FeaturedPrompts from "@/components/FeaturedPrompts";
import { getFeaturedPrompts } from "@/lib/api/prompts";

export default async function Home() {

  const featuredPrompts = await getFeaturedPrompts()

  console.log('featuredPrompts', featuredPrompts);

  return (
    <>
      {/* Main Container with hidden overflow to contain the massive glows */}
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto overflow-hidden">

        {/* HERO BANNER SECTION */}
        <Banner />
        <FeaturedPrompts prompts={featuredPrompts} />
      </div>
    </>
  );
}