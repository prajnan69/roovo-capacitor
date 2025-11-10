"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Spinner } from "../ui/shadcn-io/spinner";

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  guest_id: string;
}

interface CalendarGridProps {
  currentDate: Date;
  bookings: Booking[];
  guestNames: Record<string, string>;
  isLoading: boolean;
  direction: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarGrid = ({
  currentDate,
  bookings,
  guestNames,
  isLoading,
  direction,
  onPreviousMonth,
  onNextMonth,
}: CalendarGridProps) => {
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

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-200 overflow-x-auto">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center">
          <button
            onClick={onPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
            onClick={onNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                className="font-semibold text-gray-500 text-xs md:text-sm uppercase tracking-wider"
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

                const getStatusColor = (status: string) => {
                  switch (status) {
                    case "confirmed":
                      return "bg-red-500 text-white";
                    case "pending":
                      return "bg-yellow-400 text-black";
                    case "completed":
                      return "bg-gray-300 text-black";
                    default:
                      return "bg-gray-100";
                  }
                };

                return (
                  <div
                    key={day}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      booking
                        ? getStatusColor(booking.status)
                        : "bg-green-100 hover:bg-green-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm md:text-lg">
                        {day}
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
  );
};

export default CalendarGrid;
