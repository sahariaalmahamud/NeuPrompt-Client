import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#030303]">
      {/* Sidebar — renders its own responsive variants internally */}
      <DashboardSidebar />

      {/*
        Content area offsets:
          mobile  (<768px)  : no left margin, but 16px top padding so the hamburger
                              button doesn't overlap content, and pb-16 for bottom nav
          tablet  (768px+)  : margin-left matches the 64px icon sidebar
          desktop (1024px+) : margin-left matches the 260px full sidebar
      */}
      <main className="
        flex-1 min-w-0
        pt-16 pb-16 px-4
        md:pt-0 md:pb-0 md:px-0
        md:ml-[64px]
        lg:ml-[260px]
      ">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}