"use client";

import { useState, useEffect } from "react";
import { Star, Trophy } from "lucide-react";
import { API_BASE_URL } from "@/services/api";
import type { ListingData } from "@/types";
import { motion } from "framer-motion";

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  guest_id: string;
}

export default function RatingsAndReviews({ ratings, listingId }: { ratings: ListingData; listingId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${listingId}`);
      const data = await response.json();
      setReviews(data);
    };
    fetchReviews();
  }, [listingId]);

  if (!ratings) return null;

  const detailedRatings = {
    cleanliness: ratings.cleanliness_rating,
    accuracy: ratings.accuracy_rating,
    checkin: ratings.checkin_rating,
    communication: ratings.communication_rating,
    location: ratings.location_rating,
    value: ratings.value_rating,
  };

  const isTopTier = Object.values(detailedRatings).every(
    (value) => value !== undefined && value >= 4.8
  );

  return (
    <div className="mt-10 space-y-10">
      {/* ---- Ratings Section ---- */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">Ratings</h2>
            {isTopTier && (
              <div className="ml-4 flex items-center bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 mr-2" />
                <span>Top Tier</span>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(detailedRatings).map(([key, value]) => {
            if (value === null || value === undefined) return null;
            return (
              <motion.div
                key={key}
                className="border border-gray-200 rounded-xl p-4 text-center bg-white shadow-sm hover:shadow-md transition-all"
                whileHover={{ scale: 1.03 }}
              >
                <h3 className="font-bold capitalize mb-2 text-gray-700">{key}</h3>
                <div className="flex items-center justify-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  <p className="text-2xl font-bold">{value.toFixed(1)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div> */}

      {/* ---- Reviews Section ---- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-t border-gray-200 pt-8"
      >
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                className="border border-gray-100 rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.561-.955L10 0l2.95 5.955 6.561.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No reviews yet on Roovo</p>
        )}
      </motion.div>
    </div>
  );
}
