"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import supabase from "../../services/api";
import { Spinner } from "../ui/shadcn-io/spinner";

const Bookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          // Fetch bookings for the host
        } catch (err) {
          console.error("Error fetching bookings:", err);
        }
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const endDate = new Date(booking.end_date);
    if (filter === 'upcoming') {
      return endDate >= new Date();
    } else {
      return endDate < new Date();
    }
  });

  return (
    <div className="p-4">
      <div className="flex mb-6">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg ${filter === 'upcoming' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`ml-4 px-4 py-2 rounded-lg ${filter === 'past' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
        >
          Past
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={booking.listing.primary_image_url}
                alt={booking.listing.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 truncate">{booking.listing.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{booking.listing.property_type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
