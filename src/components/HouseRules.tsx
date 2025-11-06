"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Dog, Ban, Check, ChevronDown, Cigarette } from "lucide-react";
import type { ListingData } from "@/types";

export default function HouseRules({ rules }: { rules: ListingData }) {
  const [showAdditionalRules, setShowAdditionalRules] = useState(false);

  if (!rules) return null;

  return (
    <div className="mt-6 bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">🏡 House Rules</h2>
        <p className="text-gray-500 text-sm mt-1">Please review before booking</p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        {/* Check-in */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-800">Check-in</h3>
          </div>
          <p className="text-gray-600 text-sm">{rules.gemini_response?.house_rules?.checkIn}</p>
        </motion.div>

        {/* Check-out */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-800">Check-out</h3>
          </div>
          <p className="text-gray-600 text-sm">{rules.gemini_response?.house_rules?.checkOut}</p>
        </motion.div>

        {/* Max Guests */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-800">Max Guests</h3>
          </div>
          <p className="text-gray-600 text-sm">{rules.max_guests}</p>
        </motion.div>

        {/* Pets */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            {rules.pets_allowed ? (
              <Dog className="w-5 h-5 text-green-500" />
            ) : (
              <Ban className="w-5 h-5 text-red-500" />
            )}
            <h3 className="font-semibold text-gray-800">Pets</h3>
          </div>
          <p className="text-gray-600 text-sm">
            {rules.pets_allowed ? "Allowed 🐶" : "Not allowed 🚫"}
          </p>
        </motion.div>

        {/* Smoking */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            {rules.smoking_allowed ? (
              <Cigarette className="w-5 h-5 text-green-500" />
            ) : (
              <Ban className="w-5 h-5 text-red-500" />
            )}
            <h3 className="font-semibold text-gray-800">Smoking</h3>
          </div>
          <p className="text-gray-600 text-sm">
            {rules.smoking_allowed ? "Allowed 🚬" : "Not allowed 🚭"}
          </p>
        </motion.div>
      </div>

      {/* Additional Rules */}
      {rules.additional_rules && rules.additional_rules.length > 0 && (
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => setShowAdditionalRules(!showAdditionalRules)}
            className="flex items-center justify-between w-full text-left font-semibold text-gray-800"
          >
            <span>Additional Rules</span>
            <motion.span
              animate={{ rotate: showAdditionalRules ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </motion.span>
          </button>

          <AnimatePresence>
            {showAdditionalRules && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 pl-5 list-disc text-sm text-gray-600 space-y-1"
              >
                {rules.additional_rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
