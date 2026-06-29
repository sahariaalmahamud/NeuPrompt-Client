"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
    Check,
    CircleExclamation,
    CircleXmark,
    Layers,
    Star,
    Bookmark,
    Cpu,
    LayoutList,
    CrownDiamond,
    Copy,
    ArrowRotateRight
} from "@gravity-ui/icons";

const comparisonRows = [
    {
        feature: "High Quality Curated Prompts",
        icon: <Layers className="text-zinc-500" size={16} />,
        neuPrompt: { text: "Curated & verified by experts", status: "success" },
        competitor: { text: "Limited quality control", status: "warning" }
    },
    {
        feature: "Community Ratings",
        icon: <Star className="text-zinc-500" size={16} />,
        neuPrompt: { text: "Real ratings from real users", status: "success" },
        competitor: { text: "Few or no ratings", status: "warning" }
    },
    {
        feature: "Bookmark & Collections",
        icon: <Bookmark className="text-zinc-500" size={16} />,
        neuPrompt: { text: "Save, organize & access anytime", status: "success" },
        competitor: { text: "Not available", status: "danger" }
    },
    {
        feature: "Multiple AI Models",
        icon: <Cpu className="text-zinc-500" size={16} />,
        neuPrompt: { text: "Support for all major AI models", status: "success" },
        competitor: { text: "Limited model support", status: "warning" }
    },
    {
        feature: "Creator Dashboard",
        icon: <LayoutList className="text-zinc-500" size={16} />,
        neuPrompt: { text: "Analytics, earnings & growth tools", status: "success" },
        competitor: { text: "Not available", status: "danger" }
    },
    {
        feature: "Premium Prompt Library",
        icon: <CrownDiamond className="text-zinc-500" size={16} />,
        neuPrompt: { text: "Exclusive premium prompts", status: "success" },
        competitor: { text: "Very limited", status: "warning" }
    },
    {
        feature: "Instant Copy",
        icon: <Copy className="text-zinc-500" size={16} />,
        neuPrompt: { text: "One-click copy with ease", status: "success" },
        competitor: { text: "Available", status: "success" }
    },
    {
        feature: "Regular Updates",
        icon: <ArrowRotateRight className="text-zinc-500" size={16} />,
        neuPrompt: { text: "New prompts added daily", status: "success" },
        competitor: { text: "Updates are rare", status: "warning" }
    }
];

export default function WhyNeuPrompt() {

    const renderStatusCell = (cell) => {
        if (cell.status === "success") {
            return (
                <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check size={12} />
                    </div>
                    <span>{cell.text}</span>
                </div>
            );
        }
        if (cell.status === "warning") {
            return (
                <div className="flex items-center gap-2 text-amber-500/80 font-medium text-sm">
                    <CircleExclamation size={16} className="text-amber-500/70" />
                    <span>{cell.text}</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2 text-red-400/80 font-medium text-sm">
                <CircleXmark size={16} className="text-red-500/60" />
                <span>{cell.text}</span>
            </div>
        );
    };

    return (
        <section className="py-20 bg-[#030303] text-white relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">

                {/* Section Header */}
                <div className="text-center flex flex-col gap-3 mb-12">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
                        Why <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">NeuPrompt</span>?
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
                        Everything you need to discover, manage and monetize high-quality AI prompts.
                    </p>
                </div>

                {/* Matrix Comparison Container */}
                <div className="w-full bg-[#0a0a0c]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-10">
                    <div className="w-full overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[800px] text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-6 py-4.5 text-xs font-semibold text-zinc-500 uppercase tracking-widest w-[30%]">Feature</th>
                                    <th className="px-6 py-4.5 text-xs font-bold text-purple-400 tracking-wider bg-purple-500/[0.02] w-[40%]">NeuPrompt</th>
                                    <th className="px-6 py-4.5 text-xs font-semibold text-zinc-500 uppercase tracking-widest w-[30%]">Other Prompt Sites</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                {comparisonRows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                                        {/* Feature label column */}
                                        <td className="px-6 py-4 flex items-center gap-3 text-sm font-medium text-zinc-300">
                                            {row.icon}
                                            <span>{row.feature}</span>
                                        </td>
                                        {/* NeuPrompt values column */}
                                        <td className="px-6 py-4 bg-purple-500/[0.01] border-x border-white/[0.02]">
                                            {renderStatusCell(row.neuPrompt)}
                                        </td>
                                        {/* Other matrix platforms column */}
                                        <td className="px-6 py-4">
                                            {renderStatusCell(row.competitor)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Context Statement Footer */}
                <p className="text-center text-sm text-zinc-400 font-medium max-w-2xl leading-relaxed mb-8 px-4">
                    NeuPrompt isn't just another prompt directory — <br className="hidden sm:inline" />
                    it's a complete ecosystem for discovering, sharing and monetizing AI prompts.
                </p>

                {/* Call to Actions Layout */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                    <Button
                        as={Link}
                        href="/prompts"
                        className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.25)] transition-all flex items-center justify-center"
                    >
                        Explore Prompts <span className="ml-1">→</span>
                    </Button>
                    <Button
                        as={Link}
                        href="/auth/signup?redirect=/dashboard/creator"
                        className="w-full sm:w-auto h-12 px-8 bg-transparent hover:bg-white/5 border border-white/10 text-zinc-300 hover:text-white font-medium rounded-xl transition-all flex items-center justify-center"
                    >
                        Become a Creator <span className="ml-1">→</span>
                    </Button>
                </div>

            </div>
        </section>
    );
}