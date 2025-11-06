"use client";

import { Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import type { ListingData } from "@/types";

export default function DetailedRatings({ ratings }: { ratings: ListingData }) {
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
    <div className="mt-8 bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">⭐ Ratings</h2>
        {isTopTier && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full"
          >
            <Trophy className="w-4 h-4 mr-2" />
            <span>Top Tier</span>
          </motion.div>
        )}
      </div>

      {/* Ratings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
        {Object.entries(detailedRatings).map(([key, value]) => {
          if (value === null || value === undefined) return null;

          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-200 text-center"
            >
              <h3 className="font-semibold capitalize text-gray-800">
                {key.replace(/_/g, " ")}
              </h3>
              <div className="flex items-center justify-center">
                <Star className="w-5 h-5 mr-1 text-yellow-500" />
                <p className="text-lg font-bold text-gray-900">{value.toFixed(1)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
