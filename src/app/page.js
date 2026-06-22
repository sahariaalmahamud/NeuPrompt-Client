import Banner from "@/components/Banner";

export default function Home() {
  return (
    <>
      {/* Main Container with hidden overflow to contain the massive glows */}
      <div className="flex flex-col min-h-screen max-w-7xl mx-auto overflow-hidden">

        {/* HERO BANNER SECTION */}
        <Banner />

      </div>
    </>
  );
}