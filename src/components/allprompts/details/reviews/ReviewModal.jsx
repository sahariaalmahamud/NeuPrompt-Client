"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal, Button, TextArea, Description } from "@heroui/react";
import { Star } from "@gravity-ui/icons";
import { createReview } from "@/lib/actions/reviews";

// ZOD SCHEMA
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string()
    .min(20, "Review must be at least 20 characters")
    .max(500, "Review cannot exceed 500 characters"),
});

export default function ReviewModal({ isOpen, onOpenChange, promptId, user }) {

  console.log('reviewModal', promptId, user);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" }
  });

  const currentRating = watch("rating");
  const commentLength = watch("comment")?.length || 0;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);


  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const result = await createReview({
        promptId,
        userId: user.id,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date(),
      });

      if (!result.success) {
        alert(result.message || "Failed to submit review.");
        return;
      }

      alert("Review submitted successfully.");

      onOpenChange(false);

      // Optional
      reset();

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop className="bg-[#030303]/80 backdrop-blur-sm z-[100] fixed inset-0 flex items-center justify-center p-4">
        <Modal.Container className="bg-[#0a0a0c] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
          <Modal.Dialog>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">

              <Modal.Header className="p-6 pb-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <Modal.Heading className="text-xl font-bold text-white">
                  Write a Review
                </Modal.Heading>
                <Modal.CloseTrigger className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full" />
              </Modal.Header>

              <Modal.Body className="p-6 flex flex-col gap-6">

                {/* Interactive Star Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-300">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setValue("rating", star, { shouldValidate: true })}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          size={28}
                          className={`transition-colors ${star <= currentRating ? "text-amber-500" : "text-white/10 hover:text-amber-500/50"}`}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && <span className="text-xs text-red-500">{errors.rating.message}</span>}
                </div>

                {/* HeroUI TextArea */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-300">Your Review</label>
                  <TextArea
                    {...register("comment")}
                    aria-describedby="review-description-count"
                    placeholder="Share your experience using this prompt..."
                    className="w-full"
                    classNames={{
                      inputWrapper: "bg-white/5 border border-white/10 hover:border-white/20 focus-within:!border-blue-500 shadow-inner rounded-xl min-h-[100px]",
                      input: "text-zinc-300 placeholder:text-zinc-600"
                    }}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.comment ? (
                      <span className="text-xs text-red-500">{errors.comment.message}</span>
                    ) : <span />}
                    <Description id="review-description-count" className={`text-xs ${commentLength > 500 ? "text-red-500" : "text-zinc-500"}`}>
                      {commentLength} / 500
                    </Description>
                  </div>
                </div>

              </Modal.Body>

              <Modal.Footer className="p-4 border-t border-white/5 flex items-center justify-end gap-3 bg-[#030303] shrink-0">
                <Button
                  variant="light"
                  onPress={() => onOpenChange(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="px-6 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
                >
                  Submit Review
                </Button>
              </Modal.Footer>

            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}