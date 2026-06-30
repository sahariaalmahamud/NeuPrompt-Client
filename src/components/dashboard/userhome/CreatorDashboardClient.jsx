"use client";

import { motion } from "framer-motion";
import CreatorStats from "./CreatorStats";
import AnalyticsCharts from "./AnalyticsCharts";
import TopPrompts from "./TopPrompts";

const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function CreatorDashboardClient({
    stats,
    performance,
    growth,
    topPrompts }) {
    if (!stats) {
        return (
            <div className="py-20 text-center text-zinc-500">
                No analytics data available yet. Start publishing prompts!
            </div>
        );
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8"
        >
            {/* 1. Stats Grid */}
            <CreatorStats stats={stats} />

            {/* 2. Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <AnalyticsCharts performance={performance} growth={growth} />
            </div>

            {/* 3. Top Prompts Row */}
            <div className="flex flex-col gap-4 mt-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Top Performing Prompts</h2>
                <TopPrompts topPrompts={topPrompts} />
            </div>

        </motion.div>
    );
}