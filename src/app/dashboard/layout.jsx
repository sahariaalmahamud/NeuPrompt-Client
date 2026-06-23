import DashboardSidebar from "@/components/dashboard/DashboardSidebar";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
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
        pt-16 pb-16 
        md:pt-4 md:pb-0 md:px-0
      ">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}