"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Settings, ChevronUp, ChevronDown } from "lucide-react"; // Added icons
import { triggerHaptic } from "@/lib/haptics";
import {
  fetchBookings,
  API_BASE_URL,
  getListingsWithBookingsByHostId,
  default as supabase,
} from "@/services/api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import BackButton from "./BackButton";
import ShinyText from "./ShinyText";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Calendar as UICalendar } from "@/components/ui/calendar";

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
  bookings: Booking[];
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guestNames, setGuestNames] = useState<Record<string, string>>({});
  const [listings, setListings] = useState<Listing[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedListing = listings.length > 0 ? listings[currentIndex] : null;
  const [price, setPrice] = useState(0);
  const [weekendPercentage, setWeekendPercentage] = useState(20);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isBookingsLoading, setIsBookingsLoading] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPriceEditorOpen, setIsPriceEditorOpen] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [untilDate, setUntilDate] = useState<Date | undefined>(undefined);

  const handlePriceEditorOpenChange = (open: boolean) => {
    setIsPriceEditorOpen(open);
    triggerHaptic();
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const hostId = session.user.id;
          const listingsData = await getListingsWithBookingsByHostId(hostId);
          setListings(listingsData);

          if (listingsData.length > 0) {
            // The first listing is selected by default via currentIndex state
          }
        }
      } catch (e) {
        console.error("Failed to fetch initial data:", e);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedListing) return;
    console.log('selectedListing', selectedListing);
    setBookings(selectedListing.bookings);

    // Update prices
    const base = Number(selectedListing.price_per_night) || 0;
    const weekend = Number(selectedListing.weekend_price) || 0;
    setPrice(base);
    if (weekend > 0 && base > 0) {
      setWeekendPercentage(((weekend - base) / base) * 100);
    } else {
      setWeekendPercentage(20); // Reset to default if no weekend price
    }

    const fetchGuestNames = async () => {
      if (selectedListing.bookings.length > 0) {
        const guestIds = [...new Set(selectedListing.bookings.map((b: { guest_id: any; }) => b.guest_id))];
        const res = await fetch(`${API_BASE_URL}/api/users/by-ids`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: guestIds }),
        });
        const { data: users } = await res.json();
        const names = users.reduce((a: any, u: any) => {
          a[u.id] = u.name;
          return a;
        }, {});
        setGuestNames(names);
      }
    };
    fetchGuestNames();
  }, [selectedListing]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const goToPrev = () => {
    setDirection(-1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    triggerHaptic();
  };
  const goToNext = () => {
    setDirection(1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    triggerHaptic();
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: (d: number) => ({ x: d < 0 ? "100%" : "-100%", opacity: 0, transition: { duration: 0.4 } }),
  };

  const weekendPrice = price * (1 + weekendPercentage / 100);

  const handleSave = async () => {
    if (!selectedListing) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/listings/${selectedListing.id}/price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price_per_night: price, weekend_price: weekendPrice }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        // Update the listings array which will update the selectedListing
        setListings(prev => prev.map(l => l.id === selectedListing!.id ? { ...l, price_per_night: price, weekend_price: weekendPrice } : l));
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save price:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRollerClick = async () => {
    if (listings.length > 1) {
      setShowSwipeHint(true);
      setTimeout(() => setShowSwipeHint(false), 2500);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-4 font-sans flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
      </div>
      <Drawer open={isPriceEditorOpen} onOpenChange={handlePriceEditorOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Prices for {selectedListing?.title}</DrawerTitle>
            <DrawerDescription>
              Adjust the base price and weekend price increase.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div>
              <label className="text-sm text-gray-600 block mb-2">Price Change</label>
              <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-3">
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="5"
                  value={weekendPercentage}
                  onChange={e => {
                    setWeekendPercentage(Number(e.target.value));
                    triggerHaptic();
                  }}
                  className="flex-grow h-2 rounded-full bg-gray-300 accent-indigo-500"
                  aria-label="Price change percentage"
                />
                <span className="text-lg font-semibold w-16 text-right text-black">{weekendPercentage}%</span>
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                Price change: ₹{(price * (weekendPercentage / 100)).toFixed(0)}
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm text-gray-600 block mb-2">Until when</label>
              <UICalendar
                mode="single"
                selected={untilDate}
                onSelect={setUntilDate}
                className="rounded-md border"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Summary</h3>
              <div className="flex justify-between mt-2">
                <p>Base Price:</p>
                <p>₹{price.toFixed(0)}</p>
              </div>
              <div className="flex justify-between">
                <p>Weekend Price:</p>
                <p>₹{weekendPrice.toFixed(0)}</p>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Slide to confirm"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Listing Selector (Vertical Roller) */}
      <div className="relative h-24 cursor-pointer" onClick={handleRollerClick}>
        <AnimatePresence>
          {selectedListing && (
            <motion.div
              key={selectedListing.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y < -50) { // Swiped Up
                  setCurrentIndex(prev => (prev + 1) % listings.length);
                  triggerHaptic();
                } else if (offset.y > 50) { // Swiped Down
                  setCurrentIndex(prev => (prev - 1 + listings.length) % listings.length);
                  triggerHaptic();
                }
              }}
              className="absolute inset-0 flex items-center gap-4 p-2 bg-white rounded-lg shadow-md"
            >
              <img
                src={selectedListing.primary_image_url}
                alt={selectedListing.title}
                className="w-20 h-20 object-cover rounded-md aspect-square"
              />
              <h3 className="text-lg font-semibold">{selectedListing.title}</h3>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg pointer-events-none"
            >
              <ChevronUp className="text-white animate-pulse" />
              <span className="text-white text-xs font-semibold">Swipe to change</span>
              <ChevronDown className="text-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center bg-white rounded-xl p-2">
        <button onClick={goToPrev} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeft /></button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={goToNext} className="p-2 rounded-full hover:bg-gray-200"><ChevronRight /></button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-grow relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentDate.toString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-7 gap-1 text-center h-full w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) {
                goToNext();
              } else if (swipe > 10000) {
                goToPrev();
              }
            }}
          >
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={`${day}-${index}`} className="text-xs font-semibold text-gray-400 mb-2">{day}</div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            {isBookingsLoading ? (
              <div className="col-span-7 flex justify-center items-center h-full"><Spinner /></div>
            ) : (
              Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                const booking = bookings.find(b => {
                  const s = new Date(b.start_date);
                  const e = new Date(b.end_date);
                  // Ensure comparison is only on date part
                  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  const sOnly = new Date(s.getFullYear(), s.getMonth(), s.getDate());
                  const eOnly = new Date(e.getFullYear(), e.getMonth(), e.getDate());
                  return dateOnly >= sOnly && dateOnly <= eOnly;
                });
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const dayPrice = isWeekend ? weekendPrice : price;
                const isCurrentDay = date.getDate() === new Date().getDate() &&
                                     date.getMonth() === new Date().getMonth() &&
                                     date.getFullYear() === new Date().getFullYear();

                const color = booking
                  ? booking.status === "confirmed"
                    ? "bg-red-600/80"
                    : booking.status === "pending"
                    ? "bg-yellow-500/80 text-black"
                    : "bg-gray-600/80"
                  : "bg-green-600/30";

                return (
                  <motion.div
                    key={d}
                    className={`flex flex-col p-2 rounded-lg text-xs min-h-[80px]
                                ${color}
                                ${isCurrentDay ? "border-2 border-indigo-400" : ""}
                                relative overflow-hidden`}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setIsPriceEditorOpen(true);
                    }}
                  >
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-bold">{d}</span>
                    </div>
                    {booking && (
                      <p className={`truncate text-[10px] ${booking.status === "pending" ? "text-gray-800" : "text-gray-700"}`}>
                        {guestNames[booking.guest_id] || "Guest"}
                      </p>
                    )}
                    <div className="flex-grow"></div>
                    {date >= new Date() && (
                      <div className="text-right text-[9px]">
                        ₹{dayPrice.toFixed(0)}
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Calendar;
