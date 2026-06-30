"use client";


import { useEffect, useState } from "react";
import ReviewsSection from "./ReviewsSection";

// MOCK DATA (Matches backend schema for /api/reviews/received)
const mockReceivedReviews = [
  {
    _id: "r3",
    rating: 5,
    comment: "Your UI/UX prompt is flawless. I used it for a client presentation and it generated exactly what I needed in seconds.",
    createdAt: "2026-06-29T09:15:00Z",
    reviewer: {
      id: "u1",
      name: "Marcus Tech",
      image: "https://i.ibb.co/svdyqVvs/sarahchen.jpg" // Random existing mock image
    },
    prompt: {
      _id: "p3",
      title: "Framer Motion Animation Specs Generator",
      thumbnail: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80"
    }
  },
  {
    _id: "r4",
    rating: 3,
    comment: "It's decent, but it struggles with longer inputs. Hoping for an update soon.",
    createdAt: "2026-06-28T16:45:00Z",
    reviewer: {
      id: "u2",
      name: "Jane Doe",
      image: null
    },
    prompt: {
      _id: "p3",
      title: "Framer Motion Animation Specs Generator",
      thumbnail: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80"
    }
  }
];

export default function ReceivedReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // TODO: Connect Backend API
    // fetch('/api/reviews/received').then(res => res.json()).then(data => setReviews(data))
    
    // Simulating API load
    setReviews(mockReceivedReviews);
  }, []);

  return (
    <div className="w-full">
      <ReviewsSection 
        type="received" 
        reviews={reviews} 
      />
    </div>
  );
}

