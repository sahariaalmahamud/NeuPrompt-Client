"use client";

import { useState } from "react";
import { Star } from "@gravity-ui/icons";
import { Button, Select, Label, ListBox } from "@heroui/react";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";

// MOCK DATA
// const mockReviews = [
//   { _id: "1", userName: "Alice Johnson", avatarUrl: null, rating: 5, comment: "Absolutely incredible prompt. Saved me hours of formatting work. Highly recommend!", createdAt: "2026-06-20T10:00:00Z" },
//   { _id: "2", userName: "Mark Tech", avatarUrl: null, rating: 4, comment: "Works great most of the time, just needed a slight tweak for my specific use case.", createdAt: "2026-06-18T14:30:00Z" },
// ];

export default function ReviewsSection({ promptId, user, stats, reviews }) {

  console.log('reviews', reviews);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const displayRating = stats?.rating ? stats.rating.toFixed(1) : "0.0";

  const handleWriteReview = () => {
    if (!user?.id) {
      alert("Please login to leave a review.");
      return;
    }
    setIsReviewModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        Community Reviews
      </h2>

      {/* Top Controls & Stats */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-[#0a0a0c]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-inner">

        {/* Left Side: Stats */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center justify-center">
            <span className="text-5xl font-display font-bold text-white tracking-tight">
              {displayRating}
            </span>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(stats?.rating || 0) ? "text-amber-500" : "text-white/10"}
                />
              ))}
            </div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="flex flex-col">
            <span className="text-lg font-medium text-zinc-300">Average Rating</span>
            <span className="text-sm text-zinc-500">Based on {stats?.total || 0} Reviews</span>
          </div>
        </div>

        {/* Right Side: Action */}
        <Button
          onPress={handleWriteReview}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-6 h-12 shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all w-full md:w-auto"
        >
          Write Review
        </Button>
      </div>

      {/* Sorting Dropdown */}
      <div className="flex justify-end w-full">
        <div className="w-[180px]">
          <Select
            selectedKeys={[sortOrder]}
            onSelectionChange={(keys) => setSortOrder(Array.from(keys)[0])}
          >
            <Select.Trigger className="bg-[#0a0a0c] border border-white/10 hover:bg-white/5 text-zinc-300 h-10 px-4 rounded-xl w-full flex justify-between items-center shadow-inner">
              <Select.Value placeholder="Sort by: Newest" />
              <Select.Indicator />
            </Select.Trigger>

            <Select.Popover className="bg-[#0a0a0c] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-xl">
              <ListBox className="p-1">
                <ListBox.Item key="newest" textValue="Newest" className="hover:bg-white/5 rounded-lg transition-colors cursor-pointer p-2">
                  <Label className="text-sm cursor-pointer w-full block text-zinc-300">Newest</Label>
                </ListBox.Item>
                <ListBox.Item key="oldest" textValue="Oldest" className="hover:bg-white/5 rounded-lg transition-colors cursor-pointer p-2">
                  <Label className="text-sm cursor-pointer w-full block text-zinc-300">Oldest</Label>
                </ListBox.Item>
                <ListBox.Item key="highest" textValue="Highest Rating" className="hover:bg-white/5 rounded-lg transition-colors cursor-pointer p-2">
                  <Label className="text-sm cursor-pointer w-full block text-zinc-300">Highest Rating</Label>
                </ListBox.Item>
                <ListBox.Item key="lowest" textValue="Lowest Rating" className="hover:bg-white/5 rounded-lg transition-colors cursor-pointer p-2">
                  <Label className="text-sm cursor-pointer w-full block text-zinc-300">Lowest Rating</Label>
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      {/* Review List Scrollable Area */}
      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        ) : (
          <div className="py-12 text-center text-zinc-500">
            No reviews yet. Be the first to share your thoughts!
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        promptId={promptId}
        user={user}
      />
    </div>
  );
}