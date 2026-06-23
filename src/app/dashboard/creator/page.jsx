
"use client";

// import StatsSection from "@/components/dashboard/StatsSection";
import { useSession } from "@/lib/auth-client";

// import {
//     LayoutList,
//     Persons,
//     Rocket,
//     CircleCheck,
// } from "@gravity-ui/icons";

const CreatorDashboardHomePage = () => {

    const {data: session, isPending} = useSession();

    const user = session?.user;

    // const stats = [
    //     {
    //         title: "Total Job Posts",
    //         value: 48,
    //         icon: LayoutList,
    //     },
    //     {
    //         title: "Total Applicants",
    //         value: "1,284",
    //         icon: Persons,
    //     },
    //     {
    //         title: "Active Jobs",
    //         value: 18,
    //         icon: Rocket,
    //     },
    //     {
    //         title: "Jobs Closed",
    //         value: 32,
    //         icon: CircleCheck,
    //     },
    // ];


return (
    <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome, {isPending ? "..." : user?.name}!</h2>
        {/* <StatsSection stats={stats} /> */}
    </div>
);
};

export default CreatorDashboardHomePage;