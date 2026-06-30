"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceDot,
} from "recharts";

// ─── Animation variant ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Responsive width hook ────────────────────────────────────────────────────
// Used to adjust chart margins, bar sizes, and label lengths per breakpoint.
function useWidth() {
  const [width, setWidth] = useState(1280);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

// ─── Data normalisation ───────────────────────────────────────────────────────
// FIX 1: Backend returns { title, copyCount, bookmarkCount }.
//   The chart uses dataKey="name" for XAxis.
//   Without this mapping, every X-axis label and tooltip header renders as
//   "undefined".
//
// FIX 2: Titles like "Build a Production-Ready REST API with Node.js & Express"
//   are 50–70 characters. We truncate them for the axis label and keep the
//   full title in `fullTitle` for the tooltip.
function normalisePerformance(data, maxLen = 14) {
  if (!data?.length) return [];
  return data.map((p) => {
    const raw = p.title ?? p.name ?? "Prompt";
    return {
      ...p,
      // ← `name` is what XAxis dataKey reads
      name:      raw.length > maxLen ? raw.slice(0, maxLen - 1) + "…" : raw,
      // ← `fullTitle` is used by the custom tooltip
      fullTitle: raw,
      copyCount:     p.copyCount     ?? 0,
      bookmarkCount: p.bookmarkCount ?? 0,
    };
  });
}

// ─── Custom dark-mode tooltip ─────────────────────────────────────────────────
// FIX 4: Uses `payload[0]?.payload?.fullTitle` for the tooltip header so the
//   full prompt title is shown, while the axis still shows a short label.
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const fullTitle = payload[0]?.payload?.fullTitle;
  return (
    <div className="bg-[#0a0a0c]/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl max-w-[260px]">
      {fullTitle && (
        <p className="text-white font-bold text-xs mb-2 pb-2 border-b border-white/5 leading-snug">
          {fullTitle}
        </p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs mt-1">
          <span className="size-2 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="text-zinc-400 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold tabular-nums ml-auto pl-2">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// Growth tooltip (simpler — just month + count)
const GrowthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0a0c]/95 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl shadow-2xl">
      <p className="text-zinc-400 text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-sm tabular-nums">
        {payload[0]?.value?.toLocaleString()} prompts published
      </p>
    </div>
  );
};

// ─── Single-point growth fallback ─────────────────────────────────────────────
// FIX 3: When growth has < 2 data points, a line chart renders a broken
//   disconnected dot. Show a clean metric card instead.
function SinglePointGrowth({ point }) {
  if (!point) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-8">
        <p className="text-zinc-500 text-sm">No growth data yet.</p>
        <p className="text-zinc-600 text-xs">Data appears after your first prompt is published.</p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-6">
      <div className="flex flex-col items-center gap-1">
        <span className="text-5xl sm:text-6xl font-bold text-blue-400 tabular-nums">
          {point.prompts?.toLocaleString() ?? 0}
        </span>
        <span className="text-zinc-400 text-sm font-medium">prompts published</span>
        <span className="text-zinc-600 text-xs mt-1">{point.name}</span>
      </div>
      <p className="text-zinc-600 text-[11px] text-center max-w-xs leading-relaxed">
        The growth chart needs data from at least 2 months. Check back next month to see your trend line.
      </p>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/[0.06]
        rounded-2xl sm:rounded-3xl p-5 sm:p-6
        shadow-[0_8px_30px_rgba(0,0,0,0.4)]
        flex flex-col
        h-[300px] sm:h-[360px] lg:h-[400px]"
    >
      <div className="flex flex-col mb-4 sm:mb-6 shrink-0">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
        <span className="text-xs text-zinc-500 mt-0.5">{subtitle}</span>
      </div>
      <div className="flex-1 w-full min-h-0">{children}</div>
    </motion.div>
  );
}

// ─── AnalyticsCharts ──────────────────────────────────────────────────────────

export default function AnalyticsCharts({ performance = [], growth = [] }) {
  const width = useWidth();

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  // Adjust label truncation and bar size per breakpoint
  const maxLabelLen  = isMobile ? 10 : isTablet ? 12 : 15;
  const barSize      = isMobile ? 14 : isTablet ? 16 : 20;
  const chartMarginL = isMobile ? -25 : -20;

  // Normalise: map `title` → `name`, truncate for axis
  const perfData = normalisePerformance(performance, maxLabelLen);

  // Growth: check how many real points we have
  const growthPoints = growth?.length ?? 0;
  const showGrowthChart = growthPoints >= 2;

  return (
    <>
      {/* ── Prompt Performance Bar Chart ──────────────────────────────────── */}
      <ChartCard
        title="Prompt Performance"
        subtitle="Copies vs bookmarks on your top prompts"
      >
        {perfData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-zinc-500 text-sm">No prompt data yet.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={perfData}
              margin={{ top: 8, right: 8, left: chartMarginL, bottom: isMobile ? 40 : 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#52525b"
                fontSize={isMobile ? 10 : 11}
                tickLine={false}
                axisLine={false}
                dy={8}
                // Rotate on mobile so truncated labels don't collide
                angle={isMobile ? -25 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 52 : 30}
                interval={0}
              />
              <YAxis
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
                width={32}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "11px",
                  paddingTop: isMobile ? "4px" : "8px",
                  color: "#a1a1aa",
                }}
              />
              <Bar
                dataKey="copyCount"
                name="Copies"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={barSize}
              />
              <Bar
                dataKey="bookmarkCount"
                name="Bookmarks"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
                barSize={barSize}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* ── Ecosystem Growth Line Chart ────────────────────────────────────── */}
      <ChartCard
        title="Ecosystem Growth"
        subtitle="Total prompts published over time"
      >
        {/* FIX 3: Graceful fallback for < 2 data points */}
        {showGrowthChart ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growth}
              margin={{ top: 8, right: 16, left: chartMarginL, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#52525b"
                fontSize={isMobile ? 10 : 11}
                tickLine={false}
                axisLine={false}
                dy={8}
                angle={isMobile ? -25 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 48 : 30}
              />
              <YAxis
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={32}
                allowDecimals={false}
              />
              <Tooltip
                content={<GrowthTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.08)" }}
              />
              <Line
                type="monotone"
                dataKey="prompts"
                name="Prompts Published"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#0a0a0c", stroke: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          // < 2 points — show metric card instead of broken chart
          <SinglePointGrowth point={growth?.[0]} />
        )}
      </ChartCard>
    </>
  );
}