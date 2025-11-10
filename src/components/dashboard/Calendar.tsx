"use client";

import { useState, useEffect } from "react";
import {
  fetchBookings,
  API_BASE_URL,
  getListingsWithBookingsByHostId,
} from "../../services/api";
import supabase from "../../services/api";
import ListingCarousel from "./ListingCarousel";
import CalendarGrid from "./CalendarGrid";

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
  bookings?: Booking[];
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guestNames, setGuestNames] = useState<Record<string, string>>({});
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const getListings = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const hostId = session.user.id;
          const data = await getListingsWithBookingsByHostId(hostId);
          setListings(data);
          if (data.length > 0) {
            setSelectedListing(data[0]);
            setBookings(data[0].bookings || []);
          }
        } else {
          console.log("No active session or user ID found.");
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getListings();
  }, []);

  useEffect(() => {
    const getGuestNames = async () => {
      if (bookings.length === 0) {
        setGuestNames({});
        return;
      }

      setIsLoading(true);
      try {
        const guestIds = [...new Set(bookings.map((b: Booking) => b.guest_id))];
        const response = await fetch(`${API_BASE_URL}/api/users/by-ids`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: guestIds }),
        });

        if (!response.ok) throw new Error("Failed to fetch guest names");

        const { data: users } = await response.json();
        const namesMap = users.reduce(
          (acc: Record<string, string>, user: { id: string; name: string }) => {
            acc[user.id] = user.name;
            return acc;
          },
          {}
        );
        setGuestNames(namesMap);
      } catch (error) {
        console.error("Failed to fetch guest names:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getGuestNames();
  }, [bookings]);

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setBookings(listing.bookings || []);
  };

  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="p-4">
      <ListingCarousel
        listings={listings}
        selectedListing={selectedListing}
        onSelectListing={handleSelectListing}
      />
      <CalendarGrid
        currentDate={currentDate}
        bookings={bookings}
        guestNames={guestNames}
        isLoading={isLoading}
        direction={direction}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
      />
    </div>
  );
};

export default Calendar;
