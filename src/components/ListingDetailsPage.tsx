"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Heart, Share, Star } from "lucide-react";
import MobileImageCarousel from "@/components/MobileImageCarousel";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { fetchListingById } from "@/services/api";
import supabase from "@/services/api";
import ConfirmAndPay from "@/components/ConfirmAndPay";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import BookingDrawerContent from "@/components/BookingDrawerContent";
import BookingBar from "@/components/BookingBar";
import HouseRules from "@/components/HouseRules";
import DetailedRatings from "@/components/DetailedRatings";
import Reviews from "@/components/Reviews";
import { triggerHaptic } from "@/lib/haptics";

const ListingDetailsPage = ({ match }: { match: any }) => {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNotIncluded, setShowNotIncluded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showConfirmAndPay, setShowConfirmAndPay] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [priceDetails, setPriceDetails] = useState<any>(null);
  const [isCurrentUserHost, setIsCurrentUserHost] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const id = match[1];

  useEffect(() => {
    const loadListing = async () => {
      try {
        const data = await fetchListingById(id);
        setListing(data);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session && data.host_id === session.user.id) {
          setIsCurrentUserHost(true);
        }
      } catch (e) {
        console.error("Error fetching:", e);
      } finally {
        setLoading(false);
      }
    };
    loadListing();
  }, [id]);

  const handleBackFromConfirmAndPay = () => {
    setShowConfirmAndPay(false);
  };

  const handleApplyFromDrawer = (dateRange: any, guests: number) => {
    if (dateRange?.from && dateRange?.to && listing) {
      const nights = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24));
      const newBookingDetails = {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        guests: guests,
        nights: nights,
      };
      const pricePerNight = Number(listing.price_per_night) || 0;
      const totalPrice = pricePerNight * nights;
      const newPriceDetails = {
        pricePerNight: pricePerNight,
        totalPrice: totalPrice,
        taxes: totalPrice * 0.18,
      };
      setBookingDetails(newBookingDetails);
      setPriceDetails(newPriceDetails);
      setShowConfirmAndPay(true);
    }
    setIsDrawerOpen(false);
  };

  const { scrollY } = useScroll();
  const imageOpacity = useTransform(scrollY, [0, 250], [1, 0.2]);
  const imageScale = useTransform(scrollY, [0, 250], [1, 1.1]);
  const overlayOpacity = useTransform(scrollY, [0, 250], [0, 0.5]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={28} />
      </div>
    );
  }

  if (!listing) {
    return <div>Listing not found.</div>;
  }

  if (showConfirmAndPay && bookingDetails && priceDetails) {
    return (
      <ConfirmAndPay
        listing={{
          id: String(listing.id),
          title: listing.title,
          primary_image_url: listing.primary_image_url ?? "",
          overall_rating: listing.overall_rating ?? 0,
          total_reviews: listing.total_reviews ?? 0,
          cancellation_policy:
            listing.cancellation_policy ?? "No cancellation policy provided.",
        }}
        bookingDetails={bookingDetails}
        priceDetails={priceDetails}
        onBack={handleBackFromConfirmAndPay}
        host_id={listing.host_id}
        auto_bookable={listing.auto_bookable}
      />
    );
  }

  return (
    <div className="relative bg-white text-gray-800 min-h-screen overflow-hidden">
      {/* Fixed Image Header */}
      <motion.div
        className="fixed top-0 left-0 w-full h-[45vh] overflow-hidden"
        style={{ opacity: imageOpacity, scale: imageScale }}
      >
        <MobileImageCarousel
          images={listing.all_image_urls?.map((img: any) => img.url) || []}
        />
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      {/* Top Buttons */}
      <div className="fixed top-6 left-4 right-4 flex justify-between z-40">
        <button
          onClick={() => {
            triggerHaptic();
            window.history.back();
          }}
          className="p-2 bg-black/40 backdrop-blur-md rounded-full shadow-md"
        >
          <ArrowLeft className="text-white w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => triggerHaptic()}
            className="p-2 bg-black/40 backdrop-blur-md rounded-full shadow-md"
          >
            <Share className="text-white w-5 h-5" />
          </button>
          <button
            onClick={() => triggerHaptic()}
            className="p-2 bg-black/40 backdrop-blur-md rounded-full shadow-md"
          >
            <Heart className="text-white w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-30 mt-[40vh] rounded-t-3xl bg-white shadow-2xl">
        <div className="p-6 space-y-6">
          <motion.h1
            className="text-xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {listing.title}
          </motion.h1>

          <motion.div
            className="flex items-center text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span>{listing.overall_rating}</span>
            <span className="mx-2">·</span>
            <span>{listing.location?.city}</span>
          </motion.div>

          <motion.div
            className="border-t border-gray-200 pt-4 text-base text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className={isDescriptionExpanded ? "" : "line-clamp-3"}>
              {listing.the_space}
            </p>
            <button
              onClick={() => {
                triggerHaptic();
                setIsDescriptionExpanded(!isDescriptionExpanded);
              }}
              className="text-sm font-semibold underline mt-2"
            >
              {isDescriptionExpanded ? "Show less" : "Know more"}
            </button>
          </motion.div>


          {/* Amenities */}
          <motion.div
            className="border-t border-gray-200 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-bold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {listing.included_amenities?.slice(0, 6).map((a: string) => (
                <div key={a} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
            {listing.included_amenities?.length > 6 && (
              <button
                onClick={() => triggerHaptic()}
                className="mt-3 text-sm underline font-semibold"
              >
                Show all amenities
              </button>
            )}
            <div className="mt-4">
              <button
                onClick={() => {
                  triggerHaptic();
                  setShowNotIncluded(!showNotIncluded);
                }}
                className="flex items-center gap-2 text-gray-600 font-semibold text-sm"
              >
                Show not included amenities
                <motion.span
                  animate={{ rotate: showNotIncluded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </button>
              {showNotIncluded && (
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                  {listing.not_included_amenities?.map((a: string) => (
                    <div key={a} className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* House Rules */}
          <motion.div
            className="border-t border-gray-200 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <HouseRules rules={listing} />
          </motion.div>

          {/* Detailed Ratings */}
          <motion.div
            className="border-t border-gray-200 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <DetailedRatings ratings={listing} />
          </motion.div>

          {/* Reviews */}
          <motion.div
            className="border-t border-gray-200 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Reviews ratings={listing} listingId={id} />
          </motion.div>

          <div className="h-32" /> {/* Spacer */}
        </div>
      </div>

      {/* Booking Bar */}
      <BookingBar
        price={listing.price_per_night ?? 0}
        onReserveClick={() => setIsDrawerOpen(true)}
      />

      {/* Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select dates and guests</DrawerTitle>
            <DrawerDescription>Choose your check-in and check-out dates and specify the number of guests.</DrawerDescription>
          </DrawerHeader>
          <BookingDrawerContent onApply={handleApplyFromDrawer} max_guests={listing.max_guests || 1} />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ListingDetailsPage;
