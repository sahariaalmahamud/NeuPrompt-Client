"use client";

import { useEffect, useState } from "react";
import ReviewsSection from "./ReviewsSection";

// MOCK DATA (Matches backend schema for /api/reviews/my)
const mockMyReviews = [
  {
    _id: "r1",
    rating: 5,
    comment: "This prompt completely changed how I generate SEO outlines. Extremely high quality and easy to adapt.",
    createdAt: "2026-06-25T10:00:00Z",
    prompt: {
      _id: "p1",
      title: "Ultimate SEO Blog Post Generator",
      thumbnail: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=600&q=80",
      creatorName: "Sarah Chen"
    }
  },
  {
    _id: "r2",
    rating: 4,
    comment: "Works well but required a little tweaking to get the tone exactly right. Overall a huge time saver.",
    createdAt: "2026-06-20T14:30:00Z",
    prompt: {
      _id: "p2",
      title: "React Component Architect",
      thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=600&q=80",
      creatorName: "Alex Rivera"
    }
  }
];

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // TODO: Connect Backend API
    // fetch('/api/reviews/my').then(res => res.json()).then(data => setReviews(data))
    
    // Simulating API load
    setReviews(mockMyReviews);
  }, []);

  return (
    <div className="w-full">
      <ReviewsSection 
        type="my" 
        reviews={reviews} 
      />
    </div>
  );
}