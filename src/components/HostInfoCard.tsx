"use client";

import { motion } from "framer-motion";
import { Award, Star, Calendar } from "lucide-react";
import type { ListingData } from "@/types";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeInOut" as const, delay }
});

export default function HostInfoCard({ hostInformation, reviewsAndRatings }: { hostInformation: ListingData, reviewsAndRatings: ListingData }) {
  return (
    <motion.div
      {...fadeInUp(0.45)}
      className="relative z-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/40 to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-indigo-100 shadow-lg flex-shrink-0">
            {hostInformation?.host_profile_picture_url ? (
<img
  src={hostInformation.host_profile_picture_url}
  alt={hostInformation.host_name}
  width={80}
  height={80}
  className="rounded-full object-cover"
/>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-600">
                  {hostInformation?.host_name ? hostInformation.host_name.charAt(0).toUpperCase() : ''}
                </span>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Hosted by {hostInformation?.host_name}
            </h2>

            <div className="flex items-center flex-wrap text-base sm:text-lg text-gray-600 gap-x-4 gap-y-2">
              {hostInformation?.is_superhost && (
                <span className="inline-flex items-center">
                  <Award className="w-5 h-5 text-yellow-500 mr-1" />
                  Superhost
                </span>
              )}
              <span className="inline-flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                {reviewsAndRatings?.overall_rating} 
              </span>
              <span className="inline-flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-1" />
                {hostInformation?.hosting_since}
              </span>
            </div>
            <p className="text-gray-500 text-base mt-3 max-w-lg leading-relaxed">
              {hostInformation?.host_bio?.join(" ")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
