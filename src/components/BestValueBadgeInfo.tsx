"use client";

import { motion, type Variants } from "framer-motion";
import { BadgeCheck, X, ArrowRight, TrendingUp, Star, Eye } from "lucide-react";

interface BestValueBadgeInfoProps {
  onClose: () => void;
  // Example data to make the component dynamic
  airbnbBasePrice: number;
}

export default function BestValueBadgeInfo({
  onClose,
  airbnbBasePrice,
}: BestValueBadgeInfoProps) {

  // --- CALCULATIONS FOR THE EXAMPLE ---
  const recommendedDiscount = 0.06; // 6%
  const airbnbCommission = 0.17; // 17%
  
  const roovoPrice = airbnbBasePrice * (1 - recommendedDiscount);
  const airbnbHostNet = airbnbBasePrice * (1 - airbnbCommission);
  const roovoHostNet = roovoPrice; // Assuming HostPro for simplicity in this example
  const profitDifference = roovoHostNet - airbnbHostNet;

  // --- ANIMATION VARIANTS ---
  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, y: 50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.2, duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10">
          <X size={24} />
        </button>

        <div className="p-8 md:p-12 overflow-y-auto scrollbar-hide">
          {/* --- 1. HOOK & CORE BENEFIT --- */}
          <motion.div variants={itemVariants} custom={0} className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-4">
              <BadgeCheck className="w-12 h-12 text-green-500" strokeWidth={2.5} />
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                The &apos;Best Value&apos; Badge
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              It&apos;s more than an icon. It&apos;s your key to higher rankings, more bookings, and greater profits on Roovo.
            </p>
          </motion.div>

          {/* --- 2. THE THREE PILLARS OF VALUE --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
            <motion.div variants={itemVariants} custom={1} className="space-y-2">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Higher Search Ranking</h3>
              <p className="text-gray-600">Our algorithm rewards fairness. &apos;Best Value&apos; listings get a significant, automatic boost in search results.</p>
            </motion.div>
            <motion.div variants={itemVariants} custom={2} className="space-y-2">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Attract More Clicks</h3>
              <p className="text-gray-600">The badge makes your listing stand out. Guests are up to 40% more likely to click on a listing that promises the best deal.</p>
            </motion.div>
            <motion.div variants={itemVariants} custom={3} className="space-y-2">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Build Guest Trust</h3>
              <p className="text-gray-600">The badge tells guests they&apos;ve found something special. It builds trust before they even click, leading to higher conversion rates.</p>
            </motion.div>
          </div>

          {/* --- 3. THE "HOW-TO" GUIDE --- */}
          <motion.div variants={itemVariants} custom={4} className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">How to Get the Badge: It&apos;s Simple.</h2>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 text-center">
              <div className="flex-1 bg-gray-50 p-6 rounded-xl border">
                <p className="text-5xl font-extrabold text-indigo-600 mb-2">1</p>
                <p className="font-semibold">Price your listing on Roovo at least 5% lower than on other platforms.</p>
              </div>
              <div className="flex items-center text-gray-300">
                <ArrowRight size={24} />
              </div>
              <div className="flex-1 bg-gray-50 p-6 rounded-xl border">
                <p className="text-5xl font-extrabold text-indigo-600 mb-2">2</p>
                <p className="font-semibold">Our system automatically verifies your price. No manual work needed.</p>
              </div>
              <div className="flex items-center text-gray-300">
                <ArrowRight size={24} />
              </div>
              <div className="flex-1 bg-green-50 p-6 rounded-xl border border-green-200">
                <p className="text-5xl font-extrabold text-green-600 mb-2">3</p>
                <p className="font-semibold text-green-800">Your badge is awarded and your listing gets an instant ranking boost!</p>
              </div>
            </div>
          </motion.div>

          {/* --- 4. THE FINANCIAL PROOF --- */}
          <motion.div variants={itemVariants} custom={5} className="bg-indigo-50 p-8 rounded-2xl border border-indigo-200 mb-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-indigo-900">Lower Price, Higher Profit. Here&apos;s the Math.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-700">On Airbnb</h4>
                    <p className="text-gray-500">You list for: <span className="font-bold">₹{airbnbBasePrice.toFixed(2)}</span></p>
                    <p className="text-gray-500">Platform fee (≈17%): <span className="font-bold text-red-500">-₹{(airbnbBasePrice * airbnbCommission).toFixed(2)}</span></p>
                    <hr className="my-3"/>
                    <p className="font-semibold">Your Net Profit:</p>
                    <p className="text-3xl font-bold text-gray-800">₹{airbnbHostNet.toFixed(2)}</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-lg border-2 border-green-400">
                    <h4 className="text-lg font-semibold text-green-800 flex items-center justify-center gap-2">
                        <BadgeCheck className="text-green-500" /> On Roovo with Badge
                    </h4>
                    <p className="text-gray-500">You list for: <span className="font-bold">₹{roovoPrice.toFixed(2)}</span> (-{recommendedDiscount * 100}%)</p>
                    <p className="text-gray-500">Roovo Fee (HostPro): <span className="font-bold text-green-600">-₹0</span></p>
                     <hr className="my-3"/>
                    <p className="font-semibold">Your Net Profit:</p>
                    <p className="text-4xl font-extrabold text-green-600">₹{roovoHostNet.toFixed(2)}</p>
                    <p className="mt-2 text-sm font-semibold text-green-700 bg-green-100 rounded-full px-3 py-1">
                        +₹{profitDifference.toFixed(2)} more profit per night!
                    </p>
                </div>
            </div>
          </motion.div>

          {/* --- 5. CALL TO ACTION --- */}
          <motion.div variants={itemVariants} custom={6} className="text-center">
             <button
              onClick={onClose} // In a real app, this would link to the pricing page
              className="inline-flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform text-lg font-bold"
            >
              Update My Pricing
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
