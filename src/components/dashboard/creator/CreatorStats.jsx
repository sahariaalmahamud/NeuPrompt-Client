"use client";

import {
  LayoutList,
  Copy,
  Bookmark,
  Star,
} from "@gravity-ui/icons";
import { Card } from "@heroui/react";

export default function CreatorStats() {
  // ----------------------------------------------------------------------
  // CREATOR STATS DATA
  // ----------------------------------------------------------------------
  const stats = [
    {
      title: "Total Prompts",
      value: "42",
      icon: LayoutList,
      accent: "text-blue-400",
      bgAccent: "bg-blue-500/10",
      glow: "via-blue-500"
    },
    {
      title: "Total Copies",
      value: "1,284",
      icon: Copy,
      accent: "text-purple-400",
      bgAccent: "bg-purple-500/10",
      glow: "via-purple-500"
    },
    {
      title: "Total Bookmarks",
      value: "356",
      icon: Bookmark,
      accent: "text-emerald-400",
      bgAccent: "bg-emerald-500/10",
      glow: "via-emerald-500"
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: Star,
      accent: "text-amber-400",
      bgAccent: "bg-amber-500/10",
      glow: "via-amber-500"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden group rounded-2xl relative"
        >
          {/* Luminous Horizon Line (Expands on Hover) */}
          <div 
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent ${stat.glow} to-transparent group-hover:w-full transition-all duration-500 ease-out z-20`} 
          />

          {/* Subtle Top-Right Ambient Glow */}
          <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] ${stat.bgAccent} opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none z-0`} />

          <Card.Header className="flex flex-row items-center justify-between px-6 pt-6 pb-2 border-none bg-transparent relative z-10">
            <Card.Title className="text-sm font-medium text-zinc-400 tracking-wide m-0">
              {stat.title}
            </Card.Title>
            <div className={`p-2.5 rounded-xl border border-white/5 shadow-inner ${stat.bgAccent} ${stat.accent}`}>
              <stat.icon width={18} height={18} />
            </div>
          </Card.Header>
          
          <Card.Content className="px-6 pb-6 pt-0 flex flex-row items-end gap-2 bg-transparent relative z-10">
            <p className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none m-0">
              {stat.value}
            </p>
            {/* Trend Indicator */}
            {index !== 3 && (
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-md mb-0.5">
                +12%
              </span>
            )}
          </Card.Content>
          
        </Card>
      ))}
    </div>
  );
}