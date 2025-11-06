"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  fetchBookings,
  API_BASE_URL,
  getListingsByHostId,
  default as supabase,
} from "@/services/api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import BackButton from "./BackButton";

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  guest_id: string;
}

interface Listing {
  id: string;
  title: string;
  price_per_night: number;
  weekend_price: number;
  primary_image_url: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guestNames, setGuestNames] = useState<Record<string, string>>({});
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [price, setPrice] = useState(0);
  const [weekendPrice, setWeekendPrice] = useState(0);
  const [weekendPercentage, setWeekendPercentage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const getListings = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const hostId = session.user.id;
          const data = await getListingsByHostId(hostId);
          setListings(data);
          if (data.length > 0) {
            setSelectedListing(data[0]);
            const basePrice = Number(data[0].price_per_night) || 0;
            setPrice(basePrice);
            const weekendPrice = Number(data[0].weekend_price) || basePrice * 1.2;
            setWeekendPrice(weekendPrice);
            if (basePrice > 0) {
              setWeekendPercentage(
                Math.round((weekendPrice / basePrice - 1) * 100)
              );
            }
          } else {
            setIsLoading(false);
          }
        } else {
          console.log("No active session or user ID found. Cannot fetch listings.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setIsLoading(false);
      }
    };

    getListings();
  }, []);

  useEffect(() => {
    const getBookingsAndGuests = async () => {
      if (!selectedListing) return;
      setIsLoading(true);
      try {
        const bookingsData = await fetchBookings(selectedListing.id);
        setBookings(bookingsData);

        if (bookingsData && bookingsData.length > 0) {
          const guestIds = [...new Set(bookingsData.map((b: Booking) => b.guest_id))];
          const response = await fetch(`${API_BASE_URL}/api/users/by-ids`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids: guestIds }),
          });

          if (!response.ok) {
            const errorBody = await response.text();
            console.error(
              "Failed to fetch guest names:",
              response.status,
              response.statusText,
              errorBody
            );
            throw new Error("Failed to fetch guest names");
          }

          const { data: users } = await response.json();
          const namesMap = users.reduce(
            (acc: Record<string, string>, user: { id: string; name: string }) => {
              acc[user.id] = user.name;
              return acc;
            },
            {}
          );
          setGuestNames(namesMap);
        }
      } catch (error) {
        console.error("Failed to fetch bookings or guest names:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getBookingsAndGuests();
  }, [selectedListing]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("ical", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ical/import`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Calendar imported successfully");
        if (selectedListing) {
          const data = await fetchBookings(selectedListing.id);
          setBookings(data);
        }
      } else {
        alert("Failed to import calendar");
      }
    } catch (error) {
      console.error("Failed to import calendar:", error);
      alert("Failed to import calendar");
    }
  };

  const handlePriceSave = async () => {
    if (!selectedListing) return;

    setIsSaving(true);
    setSaveSuccess(false);
    const weekend_price = price * (1 + weekendPercentage / 100);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/listings/${selectedListing.id}/price`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price_per_night: price,
            weekend_price: weekend_price,
          }),
        }
      );

      if (response.ok) {
        setWeekendPrice(weekend_price);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        console.error(
          "Failed to update price:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Failed to update price:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col md:flex-row gap-8 font-sans">
      {/* Left section */}
      <div className="w-full md:w-3/4">
        <div className="flex flex-wrap items-center mb-6 md:mb-8 gap-4">
          <BackButton variant="dark" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Calendar
          </h1>
          <div className="ml-auto flex gap-2 md:gap-4 flex-wrap">
            <button
              onClick={() => document.getElementById("ical-import")?.click()}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 md:px-6 rounded-full transition-transform transform hover:scale-105 text-sm md:text-base"
            >
              Import
            </button>
            <input
              type="file"
              id="ical-import"
              className="hidden"
              accept=".ics"
              onChange={handleImport}
            />
            {selectedListing && (
              <a
                href={`${API_BASE_URL}/api/ical/export/${selectedListing.id}`}
                download={`${selectedListing.title.replace(/\s+/g, "_")}_calendar.ics`}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 md:px-6 rounded-full transition-transform transform hover:scale-105 text-sm md:text-base"
              >
                Export
              </a>
            )}
          </div>
        </div>

        {/* Listings carousel */}
        <div className="flex overflow-x-auto gap-2 mb-6 md:mb-8 pb-2 scrollbar-hide">
          {listings.map((listing) => (
            <button
              key={listing.id}
              className={`flex-shrink-0 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 text-sm font-semibold ${
                selectedListing?.id === listing.id
                  ? "bg-indigo-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
              onClick={() => {
                setSelectedListing(listing);
                const basePrice = Number(listing.price_per_night) || 0;
                setPrice(basePrice);
                const weekendPrice =
                  Number(listing.weekend_price) || basePrice * 1.2;
                setWeekendPrice(weekendPrice);
                if (basePrice > 0) {
                  setWeekendPercentage(
                    Math.round((weekendPrice / basePrice - 1) * 100)
                  );
                }
              }}
            >
              {listing.title}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-white/10 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-lg border border-white/20 overflow-x-auto">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronLeft />
              </button>
              <h2 className="text-xl md:text-2xl font-bold mx-4 tracking-wide">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden min-w-[600px] md:min-w-0">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentDate.toString()}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-7 gap-2 text-center"
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="font-semibold text-gray-300 text-xs md:text-sm uppercase tracking-wider"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {isLoading ? (
                  <div className="col-span-7 flex justify-center items-center h-64">
                    <Spinner />
                  </div>
                ) : (
                  Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    );
                    const booking = bookings.find((b) => {
                      const startDate = new Date(b.start_date);
                      const endDate = new Date(b.end_date);
                      return date >= startDate && date <= endDate;
                    });

                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const dayPrice = isWeekend ? weekendPrice : price;

                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case "confirmed":
                          return "bg-red-600 text-white";
                        case "pending":
                          return "bg-yellow-500 text-black";
                        case "completed":
                          return "bg-gray-700 text-white";
                        default:
                          return "bg-white/10";
                      }
                    };

                    return (
                      <div
                        key={day}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          booking
                            ? getStatusColor(booking.status)
                            : "bg-green-600/30 hover:bg-green-600/50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-sm md:text-lg">
                            {day}
                          </span>
                          <span className="text-[10px] md:text-xs font-mono bg-black/20 px-2 py-1 rounded-full">
                            ₹{dayPrice?.toFixed(0)}
                          </span>
                        </div>
                        {booking && (
                          <p
                            className={`text-[10px] md:text-xs mt-2 truncate ${
                              booking.status === "pending"
                                ? "text-black/80"
                                : "text-white/80"
                            }`}
                          >
                            {guestNames[booking.guest_id] || "Guest"}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white/10 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-lg border border-white/20 flex flex-col mt-8 md:mt-0">
        {selectedListing && (
          <div className="mb-6">
            <img
              src={selectedListing.primary_image_url}
              alt={selectedListing.title}
              className="w-full h-32 object-cover rounded-xl mb-4"
            />
            <h2 className="text-lg md:text-xl font-bold tracking-tight truncate">
              {selectedListing.title}
            </h2>
          </div>
        )}
        <div className="flex-grow">
          <div className="mb-6">
            <label className="block mb-2 text-xs md:text-sm font-medium text-gray-300">
              Base Price (per night)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                ₹
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white/10 rounded-full p-2 md:p-3 pl-8 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-xs md:text-sm font-medium text-gray-300">
              Weekend Price Increase
            </label>
            <div className="flex items-center gap-2 md:gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={weekendPercentage}
                onChange={(e) => setWeekendPercentage(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm md:text-lg font-semibold w-12 md:w-16 text-center">
                {weekendPercentage}%
              </span>
            </div>
            <div className="text-right mt-2 text-gray-400 text-xs md:text-sm">
              Weekend:{" "}
              <span className="font-bold text-white">
                ₹{(price * (1 + weekendPercentage / 100)).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handlePriceSave}
          className={`bg-indigo-500 text-white font-bold py-2 md:py-3 px-3 md:px-4 rounded-full w-full transition-all duration-300 mt-auto flex items-center justify-center
            ${
              isSaving
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-indigo-600 hover:scale-105"
            }
            ${saveSuccess ? "bg-green-500" : ""}
          `}
          disabled={isSaving}
        >
          {isSaving ? (
            <Spinner className="h-5 w-5 text-white" />
          ) : saveSuccess ? (
            "Saved!"
          ) : (
            "Save Prices"
          )}
        </button>
      </div>
    </div>
  );
};
export default Calendar;
