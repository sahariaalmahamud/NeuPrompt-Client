"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BookmarkCard from "./BookmarkCard";
import SavedPromptsEmptyState from "./SavedPromptsEmptyState";
import SavedPromptsSkeleton from "./SavedPromptsSkeleton";
import DashboardPagination from "./DashboardPagination";
import { removeBookmark } from "@/lib/actions/bookmarks";

const containerVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function SavedPrompts({ bookmarks: initialBookmarks, userId }) {

  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);


  // Defaulting to 1 for UI presentation. Will be set by backend metadata later.
  const totalPages = 1;

  // ----------------------------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------------------------
  const handleRemoveBookmark = async (
    bookmarkId,
    promptId
  ) => {

    // optimistic update
    setBookmarks(prev =>
      prev.filter(
        b => b._id !== bookmarkId
      )
    );

    try {

      await removeBookmark({
        userId,
        promptId
      });

    } catch (error) {

      console.error(error);

      // optional rollback
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // BACKEND INTEGRATION: Fetch new page data here
    // Example: fetch(`/api/bookmarks?page=${page}`)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ----------------------------------------------------------------------
  // RENDER UI
  // ----------------------------------------------------------------------
  if (isLoading) {
    return <SavedPromptsSkeleton count={6} />;
  }

  if (!bookmarks || bookmarks.length === 0) {
    return <SavedPromptsEmptyState />;
  }

  return (
    <div className="flex flex-col gap-10">

      {/* 🃏 GRID SECTION */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark._id}
            bookmark={bookmark.prompt}
            bookmarkId={bookmark._id}
            onRemove={handleRemoveBookmark}
          />
        ))}
      </motion.div>

      {/* 📑 PAGINATION */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center pt-8 border-t border-white/5">
          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

    </div>
  );
}