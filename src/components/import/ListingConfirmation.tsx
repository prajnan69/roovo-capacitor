"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  Star,
  ChevronDown,
  XCircle,
  Award,
  Bed,
  Users,
  Home,
  Sparkles,
  Check,
  Calendar,
  MessageSquare,
  Map as MapIcon,
  Heart,
} from "lucide-react";
import type { ListingData } from "@/types";
import CircularGallery from "../CircularGallery";
import ImageGallery from "./ImageGallery";
import { useWindowSize } from "@/hooks/useWindowSize";
import { FireworksBackground } from "../Fireworks";
// import Map from "./Map";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeInOut" as const, delay }
});

const imageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function ListingConfirmationRedesigned({
  data,
  onConfirm,
}: {
  data: ListingData;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showNotIncluded, setShowNotIncluded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentAmenities, setCurrentAmenities] = useState(data.amenities?.included || []);
  const [imageIndex, setImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showFireworks, setShowFireworks] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentAmenities(data.amenities?.included || []);
    setImageIndex(0);
  }, [data]);

  useEffect(() => {
    // Preload next set of images
    if (data.media && imageIndex + 5 < data.media.allImageUrls.length) {
      const nextImages = data.media.allImageUrls.slice(imageIndex + 5, imageIndex + 10);
      nextImages.forEach((image) => {
        const img = new window.Image();
        img.src = image.url;
      });
    }
  }, [imageIndex, data.media]);

  const images = data.media?.allImageUrls || [];
  const amenitiesToShow = showAllAmenities
    ? currentAmenities
    : currentAmenities.slice(0, 8);

  const handleRemoveAmenity = (amenityToRemove: string) => {
    setCurrentAmenities((prevAmenities) =>
      prevAmenities.filter((amenity) => amenity !== amenityToRemove)
    );
  };

  const ratingIcons = {
    cleanliness: <Sparkles className="w-5 h-5 text-indigo-500" />,
    accuracy: <Check className="w-5 h-5 text-indigo-500" />,
    checkIn: <Calendar className="w-5 h-5 text-indigo-500" />,
    communication: <MessageSquare className="w-5 h-5 text-indigo-500" />,
    location: <MapIcon className="w-5 h-5 text-indigo-500" />,
    value: <Heart className="w-5 h-5 text-indigo-500" />,
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {showFireworks && (
        <FireworksBackground className="fixed inset-0 z-50 pointer-events-none" />
      )}
      <motion.div className="mx-auto max-w-7xl py-6 sm:py-12 px-4 sm:px-6 lg:px-8" {...fadeInUp(0)}>
        {/* Image Banner */}
        <div className="relative h-[300px] sm:h-[450px] mb-8 sm:mb-12">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={imageIndex}
              className={`grid gap-2 h-full rounded-2xl overflow-hidden shadow-xl ${
                images.slice(imageIndex, imageIndex + 5).length === 1 ? "grid-cols-1 grid-rows-1" :
                images.slice(imageIndex, imageIndex + 5).length === 2 ? "grid-cols-2 grid-rows-1" :
                images.slice(imageIndex, imageIndex + 5).length === 3 ? "grid-cols-3 grid-rows-1" :
                images.slice(imageIndex, imageIndex + 5).length === 4 ? "grid-cols-2 grid-rows-2" :
                "grid-cols-4 grid-rows-2"
              }`}
              variants={imageContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {images.slice(imageIndex, imageIndex + 5).map((image, i) => (
                <motion.div
                  key={imageIndex + i}
                  className={`${
                    images.slice(imageIndex, imageIndex + 5).length >= 5 && i === 0 ? "col-span-2 row-span-2" : ""
                  } bg-cover bg-center relative cursor-pointer`}
                  style={{ backgroundImage: `url(${image.url})` }}
                  variants={imageVariants}
                  whileHover={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setShowGallery(true)}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {imageIndex + 5 < images.length ? (
            <button
              onClick={() => setImageIndex(imageIndex + 5)}
              className="absolute bottom-4 right-4 bg-white/50 backdrop-blur-sm text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-white/75 transition-colors cursor-pointer"
            >
              Show more pictures
            </button>
          ) : (
            <button
              onClick={() => setImageIndex(0)}
              className="absolute bottom-4 right-4 bg-white/50 backdrop-blur-sm text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-white/75 transition-colors cursor-pointer"
            >
              Back to start
            </button>
          )}
        </div>

        {showGallery &&
          (isMobile ? (
            <ImageGallery
              images={images.map(image => ({ url: image.url, alt_text: image.alt }))}
              initialIndex={0}
              onClose={() => setShowGallery(false)}
            />
          ) : (
            <CircularGallery
              items={images.map((image) => ({
                image: image.url,
                text: image.alt,
              }))}
              font=" 34px 'roboto'"
              textColor="#ffffff"
              borderRadius={0.06}
              bend={2.5}
              onClose={() => setShowGallery(false)}
            />
          ))}


        {/* Hero Section */}
        <motion.div {...fadeInUp(0.2)} className="mb-6 md:mb-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 font-montserrat">
            {data.title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mt-2 sm:mt-4 flex items-start sm:items-center">
            <MapPin className="w-6 h-6 mr-2 text-gray-500" />
            {data.location_and_neighborhood?.address}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pb-24 lg:pb-0">
          <div className="lg:col-span-2 space-y-8 sm:space-y-12">
            {/* Accommodation Info */}
            <motion.div
              {...fadeInUp(0.25)}
              className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-6 bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-2 text-gray-700 text-base sm:text-lg">
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0" />
                <span>{data.property_type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-base sm:text-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0" />
                <span>{data.house_rules?.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-base sm:text-lg">
                <Bed className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0" />
                <span>{data.accommodation?.totalBeds} beds</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-base sm:text-lg">
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0" />
                <span>{data.accommodation?.totalBathrooms} bathrooms</span>
              </div>
            </motion.div>

            {/* About this property */}
            <motion.div {...fadeInUp(0.35)}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                About this property
              </h2>
              <p className={`text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line ${!isDescriptionExpanded && "line-clamp-5"}`}>
                {data.property_description?.theSpace}
              </p>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className=" cursor-pointer mt-4 inline-flex items-center gap-2 text-indigo-600 font-semibold text-base sm:text-lg hover:text-indigo-800 transition-colors"
              >
                {isDescriptionExpanded ? "Show less" : "Read more"}{" "}
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    isDescriptionExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </motion.div>

            {/* Host Section */}
            <motion.div
              {...fadeInUp(0.45)}
              className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/40 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
            {/* Host Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-indigo-100 shadow-lg flex-shrink-0">
                {data.host_information?.profilePictureUrl ? (
<img
  src={data.host_information.profilePictureUrl}
  alt={data.host_information.name}
  width={100}
  height={100}
  className="w-full h-full object-cover"
/>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-600">
                      {data.host_information?.name ? data.host_information.name.charAt(0).toUpperCase() : ''}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  Hosted by {data.host_information?.name}
                </h2>

                <div className="flex items-center flex-wrap text-base sm:text-lg text-gray-600 gap-x-4 gap-y-2">
                  {data.host_information?.isSuperhost && (
                    <span className="inline-flex items-center">
                      <Award className="w-5 h-5 text-yellow-500 mr-1" />
                      Superhost
                    </span>
                  )}
                  <span className="inline-flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    {data.ratings_and_reviews?.overallRating} ({data.ratings_and_reviews?.totalReviews} reviews)
                  </span>
                  <span className="inline-flex items-center">
                    <Calendar className="w-5 h-5 text-gray-500 mr-1" />
                    {data.host_information?.hostingSince}
                  </span>
                </div>
                <p className="text-gray-500 text-base mt-3 max-w-lg leading-relaxed">
                  {data.host_information?.bio?.join(" ")}
                </p>
              </div>
            </div>
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div {...fadeInUp(0.55)}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base sm:text-lg text-gray-700">
                {amenitiesToShow.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-4 group relative"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span>{amenity}</span>
                    <button
                      onClick={() => handleRemoveAmenity(amenity)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label={`Remove ${amenity}`}
                    >
                      <XCircle className="w-5 h-5 text-red-500 cursor-pointer" />
                    </button>
                  </div>
                ))}
              </div>
              {data.amenities?.included?.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className=" cursor-pointer mt-6 inline-flex items-center gap-2 text-indigo-600 font-semibold text-lg hover:text-indigo-800 transition-colors"
                >
                  {showAllAmenities
                    ? "Show less"
                    : `Show all ${data.amenities.included.length} amenities`}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      showAllAmenities ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
              <div className="mt-4">
                <button
                  onClick={() => setShowNotIncluded(!showNotIncluded)}
                  className="cursor-pointer inline-flex items-center gap-2 text-gray-600 font-semibold text-lg hover:text-gray-800 transition-colors"
                >
                  Show not included amenities
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      showNotIncluded ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showNotIncluded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base sm:text-lg text-gray-700 mt-4">
                    {data.amenities?.notIncluded?.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-4 group relative"
                      >
                        <XCircle className="w-6 h-6 text-red-500" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Detailed Ratings */}
            <motion.div {...fadeInUp(0.7)}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Detailed Ratings</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(data.ratings_and_reviews?.detailedRatings || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                    {ratingIcons[key as keyof typeof ratingIcons]}
                    <span className="capitalize">{key}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Check-in/out Times */}
            <motion.div {...fadeInUp(0.7)}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Check-in & Check-out</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-gray-500" />
                  <span>{data.house_rules?.checkIn.split("m")[0]}m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-gray-500" />
                  <span>{data.house_rules?.checkOut}</span>
                </div>
              </div>
            </motion.div>

            {/* House Rules */}
            <motion.div {...fadeInUp(0.7)}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">House Rules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-6 h-6 ${data.house_rules?.petsAllowed ? 'text-green-500' : 'text-red-500'}`} />
                  <span>{data.house_rules?.petsAllowed ? "Pets allowed" : "No pets allowed"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-6 h-6 ${data.house_rules?.smokingAllowed ? 'text-green-500' : 'text-red-500'}`} />
                  <span>{data.house_rules?.smokingAllowed ? "Smoking allowed" : "No smoking allowed"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-6 h-6 ${data.house_rules?.commercialPhotographyAllowed ? 'text-green-500' : 'text-red-500'}`} />
                  <span>{data.house_rules?.commercialPhotographyAllowed ? "Commercial photography allowed" : "No commercial photography"}</span>
                </div>
                {data.house_rules?.additionalRules?.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map Section */}
            {/* {data.locationAndNeighborhood.latitude && data.locationAndNeighborhood.longitude && (
              <motion.div {...fadeInUp(0.75)}>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Location</h2>
                <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-96">
                  <Map listing={{
                    propertyDetails: {
                      coordinates: {
                        latitude: data.locationAndNeighborhood.latitude,
                        longitude: data.locationAndNeighborhood.longitude
                      }
                    }
                  } as any} />
                </div>
              </motion.div>
            )} */}
          </div>

          {/* Sticky Confirmation Card - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <motion.div
              className="sticky top-24 bg-white p-8 rounded-2xl shadow-2xl"
              {...fadeInUp(0.8)}
            >
              <h3 className="text-2xl font-bold text-gray-900">Ready to list?</h3>
              <p className="text-gray-600 mt-2 mb-6">
                Confirm the details and get your property live.
              </p>
              <button
                onClick={onConfirm}
                className=" cursor-pointer w-full inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-4 rounded-xl shadow-lg hover:bg-indigo-600 active:scale-95 transition text-lg font-bold"
              >
                Confirm pricing & List <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Confirmation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
          <button
            onClick={onConfirm}
            className="cursor-pointer w-full inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-600 active:scale-95 transition text-base font-bold"
          >
            Confirm price & List <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
