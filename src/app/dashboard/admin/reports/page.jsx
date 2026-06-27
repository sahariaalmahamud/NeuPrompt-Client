// app/admin/reports/page.jsx
// ─────────────────────────────────────────────────────────────
// SERVER COMPONENT — runs only on the server (Next.js App Router).
// Fetches reports before rendering, then passes them to the
// client-side <ReportsPage /> which owns all interactivity.
//
// BACKEND TODO:
//   Replace `getReports()` with a real MongoDB call, e.g.:
//
//   import { connectDB } from "@/lib/mongodb";
//   import Report from "@/models/Report";
//
//   const reports = await Report.aggregate([
//     { $lookup: { from: "prompts", localField: "promptId",
//                  foreignField: "_id", as: "prompt" } },
//     { $lookup: { from: "users",   localField: "reporterId",
//                  foreignField: "_id", as: "reporter" } },
//     { $lookup: { from: "users",   localField: "creatorId",
//                  foreignField: "_id", as: "creator" } },
//     { $unwind: "$prompt" },
//     { $unwind: "$reporter" },
//     { $unwind: "$creator" },
//     { $sort: { createdAt: -1 } },
//   ]);
//
//   Serialize _id / ObjectId fields to strings before passing
//   to the client component (Next.js cannot serialize ObjectIds).
//
// BACKEND TODO (search / filter / pagination):
//   Search, status filtering, and pagination are NOT implemented
//   on the frontend (by design — handled on the backend instead).
//   When you're ready to wire this up:
//
//   1. Read query params on this server component:
//        export default async function AdminReportsRoute({ searchParams }) {
//          const { search = "", status = "all", page = "1" } = await searchParams;
//          const reports = await getReports({ search, status, page: Number(page) });
//          ...
//        }
//
//   2. Update getReports() (or your Mongo aggregation) to accept
//      { search, status, page } and apply $match / $skip / $limit
//      stages accordingly, returning something like:
//        { reports: [...], totalPages, totalCount }
//
//   3. Pass that down to <ReportsPage /> as props, e.g.:
//        <ReportsPage
//          initialReports={reports}
//          currentPage={page}
//          totalPages={totalPages}
//          initialSearch={search}
//          initialStatus={status}
//        />
//
//   4. In ReportsPage.jsx, re-introduce SearchBar / StatusFilter /
//      Pagination, with their onChange handlers updating the URL
//      (via useRouter / useSearchParams) instead of local state —
//      see the BACKEND TODO comments in ReportsPage.jsx for details.
// ─────────────────────────────────────────────────────────────

import ReportsPage from "@/components/dashboard/admin/reports/Reportspage ";
import { getReports } from "@/lib/api/reports";



export const metadata = {
  title: "Reports management | Admin dashboard",
  description: "Review and resolve community reports to keep the marketplace safe.",
};

// ─── MOCK DATA ────────────────────────────────────────────────
// Simulates the MongoDB $lookup aggregation result described above.
// Each object is a flattened, serializable plain object — all _id
// fields are strings, not ObjectId instances.
// ──────────────────────────────────────────────────────────────
// async function getReports() {
//   // Simulate network latency while developing
//   await new Promise((res) => setTimeout(res, 400));

//   return [
//     {
//       _id: "6a3e1ef2c54f3011f59ddf06",
//       // IDs for deep-link actions (warn email, delete prompt, etc.)
//       promptId:   "6a3cd7bd916c0d7852114840",
//       reporterId: "6a3d276b56dd9dd652070f04",
//       creatorId:  "6a3a57d2986ceb2ae40bccc0",
//       // Joined fields from $lookup — shown in the UI
//       reporterName:    "Alice Johnson",
//       reporterImage:   null,
//       creatorName:     "Sarah Chen",
//       promptTitle:     "Ultimate SEO Blog Post Generator",
//       promptThumbnail: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=200&q=70",
//       reason:      "Copyright Violation",
//       description: "This is a direct copy of a prompt from another creator without any modifications. Please look into it.",
//       // Possible statuses: "pending" | "warned" | "dismissed" | "deleted"
//       status:    "pending",
//       createdAt: "2026-06-26T06:40:50.538Z",
//     },
//     {
//       _id: "6a3e1ef2c54f3011f59ddf07",
//       promptId:   "6a3cd7bd916c0d7852114841",
//       reporterId: "6a3d276b56dd9dd652070f05",
//       creatorId:  "6a3a57d2986ceb2ae40bccc1",
//       reporterName:    "Mark Tech",
//       reporterImage:   null,
//       creatorName:     "Alex Rivera",
//       promptTitle:     "Suspicious Shell Script Optimizer",
//       promptThumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=200&q=70",
//       reason:      "Harmful Content",
//       description: "This prompt generates malicious bash scripts that could delete user data. It's dangerous.",
//       status:    "warned",
//       createdAt: "2026-06-25T14:20:10.000Z",
//     },
//     {
//       _id: "6a3e1ef2c54f3011f59ddf08",
//       promptId:   "6a3cd7bd916c0d7852114842",
//       reporterId: "6a3d276b56dd9dd652070f06",
//       creatorId:  "6a3a57d2986ceb2ae40bccc2",
//       reporterName:    "Jane Doe",
//       reporterImage:   null,
//       creatorName:     "Marcus Doe",
//       promptTitle:     "Low Effort Email Writer",
//       promptThumbnail: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=200&q=70",
//       reason:      "Low Quality",
//       description: "This prompt doesn't work at all and just outputs gibberish. Very frustrating.",
//       status:    "dismissed",
//       createdAt: "2026-06-20T09:15:00.000Z",
//     },
//     {
//       _id: "6a3e1ef2c54f3011f59ddf09",
//       promptId:   "6a3cd7bd916c0d7852114843",
//       reporterId: "6a3d276b56dd9dd652070f07",
//       creatorId:  "6a3a57d2986ceb2ae40bccc3",
//       reporterName:    "Robert Waves",
//       reporterImage:   null,
//       creatorName:     "Nina Patel",
//       promptTitle:     "Auto-Spam Comment Generator",
//       promptThumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=200&q=70",
//       reason:      "Spam",
//       description: "Specifically built to flood social media comment sections automatically. Needs immediate removal.",
//       status:    "deleted",
//       createdAt: "2026-06-18T11:00:00.000Z",
//     },
//     {
//       _id: "6a3e1ef2c54f3011f59ddf10",
//       promptId:   "6a3cd7bd916c0d7852114844",
//       reporterId: "6a3d276b56dd9dd652070f08",
//       creatorId:  "6a3a57d2986ceb2ae40bccc4",
//       reporterName:    "Sophia Lin",
//       reporterImage:   null,
//       creatorName:     "DevBot Anon",
//       promptTitle:     "Misleading Financial Advisor",
//       promptThumbnail: "https://images.unsplash.com/photo-1611532736640-a2c1dd5d9c9f?auto=format&fit=crop&w=200&q=70",
//       reason:      "Harmful Content",
//       description: "Gives dangerous financial advice without disclaimers. Could seriously harm real users.",
//       status:    "pending",
//       createdAt: "2026-06-27T08:30:00.000Z",
//     },
//     {
//       _id: "6a3e1ef2c54f3011f59ddf11",
//       promptId:   "6a3cd7bd916c0d7852114845",
//       reporterId: "6a3d276b56dd9dd652070f09",
//       creatorId:  "6a3a57d2986ceb2ae40bccc5",
//       reporterName:    "James Moore",
//       reporterImage:   null,
//       creatorName:     "TechGuru99",
//       promptTitle:     "Fake News Article Generator",
//       promptThumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=200&q=70",
//       reason:      "Misinformation",
//       description: "This prompt is designed to produce realistic-looking fake news articles. Extremely harmful.",
//       status:    "pending",
//       createdAt: "2026-06-27T10:00:00.000Z",
//     },
//   ];
// }

// ─── PAGE ─────────────────────────────────────────────────────
export default async function AdminReportsRoute() {
  // In production, this becomes your real DB call (see header comment)
  const reports = await getReports();

  console.log('reports', reports);

  return (
    // Outer shell: dark page background with a subtle ambient glow.
    // The glow is purely decorative — uses pointer-events:none so it
    // doesn't interfere with any interactions underneath.
    <div className="relative min-h-screen bg-[#030303] text-white overflow-x-hidden pb-24">
      {/* Ambient background glow — decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-1/4 w-[700px] h-[500px]
                   bg-red-600/[0.04] blur-[160px] rounded-full z-0"
      />

      {/* Page content */}
      <div className="relative z-10 max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pt-8 sm:pt-10 lg:pt-14">
        {/* ── Page header ── */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-white leading-tight mb-2">
            Reports management
          </h1>
          <p className="text-zinc-400 text-sm sm:text-[15px] leading-relaxed max-w-xl">
            Review and resolve community reports to keep the marketplace safe and trustworthy.
          </p>
        </div>

        {/*
          ReportsPage is a "use client" component — it receives the
          server-fetched reports as a prop and manages action state
          (warn / dismiss / delete / restore) internally.

          Search, filtering, and pagination are intentionally NOT
          handled here yet — see the BACKEND TODO above for how to
          wire them in once the backend supports it.

          When a real API is wired up, optimistic updates should be
          applied here so the UI reflects actions immediately without
          a full page reload.
        */}
        <ReportsPage initialReports={reports} />
      </div>
    </div>
  );
}