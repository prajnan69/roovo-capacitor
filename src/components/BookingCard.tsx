"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import DatePicker from './DatePicker';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import supabase, { API_BASE_URL } from '../services/api';
import { Spinner } from './ui/shadcn-io/spinner';

interface BookingCardProps {
  price: number;
  max_guests: number;
  host_id: string;
  listing_id: number;
  onReserveClick: (bookingDetails: any, priceDetails: any) => void;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  onDateSelect: (date: Date) => void;
  disabled?: boolean;
}

const BookingCard = ({ 
  price, 
  max_guests, 
  listing_id, 
  onReserveClick,
  checkInDate,
  checkOutDate,
  onDateSelect,
  disabled = false
}: BookingCardProps) => {
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState("");

  const calendarRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(calendarRef, () => setShowCalendar(false));

  const guestsRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(guestsRef, () => setShowGuests(false));

  const numberOfNights = checkInDate && checkOutDate
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = numberOfNights * price;
  const taxes = totalPrice * 0.18;

  const handleReserve = () => {
    if (!checkInDate || !checkOutDate || guests === 0) {
      alert('Please select dates and number of guests.');
      return;
    }

    const bookingDetails = {
      startDate: checkInDate.toISOString(),
      endDate: checkOutDate.toISOString(),
      guests,
      nights: numberOfNights,
    };

    const priceDetails = {
      pricePerNight: price,
      totalPrice,
      taxes,
    };

    onReserveClick(bookingDetails, priceDetails);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-2xl shadow-2xl sticky top-24"
    >
      <div className="flex items-baseline mb-4">
        <span className="text-2xl font-bold">₹{price.toLocaleString()}</span>
        <span className="text-gray-600 ml-1">/ night</span>
      </div>
      <div className="border rounded-lg relative">
        <div className="grid grid-cols-2">
          <div className="p-3 border-r" onClick={() => setShowCalendar(true)}>
            <label htmlFor="checkin" className="text-xs font-semibold text-gray-600">CHECK-IN</label>
            <input type="text" id="checkin" value={checkInDate ? checkInDate.toLocaleDateString() : 'Add date'} className="w-full text-sm" readOnly />
          </div>
          <div className="p-3" onClick={() => setShowCalendar(true)}>
            <label htmlFor="checkout" className="text-xs font-semibold text-gray-600">CHECKOUT</label>
            <input type="text" id="checkout" value={checkOutDate ? checkOutDate.toLocaleDateString() : 'Add date'} className="w-full text-sm" readOnly />
          </div>
        </div>
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              ref={calendarRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 top-full mt-2"
            >
              <DatePicker onSelect={onDateSelect} checkIn={checkInDate} checkOut={checkOutDate} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="p-3 border-t relative">
          <div onClick={() => setShowGuests(!showGuests)}>
            <label htmlFor="guests" className="text-xs font-semibold text-gray-600">GUESTS</label>
            <div className="flex justify-between items-center">
              <span className="text-sm">{guests} guest{guests > 1 && 's'} (Max {max_guests})</span>
              <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showGuests ? 'rotate-180' : ''}`} />
            </div>
          </div>
          <AnimatePresence>
            {showGuests && (
              <motion.div
                ref={guestsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 top-full mt-2 bg-white p-4 rounded-lg shadow-lg border"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Guests</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-1 rounded-full border hover:bg-gray-100">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{guests}</span>
                    <button onClick={() => setGuests(Math.min(max_guests, guests + 1))} className="p-1 rounded-full border hover:bg-gray-100">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <button
        onClick={handleReserve}
        className={`cursor-pointer w-full mt-4 bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
        }`}
        disabled={disabled}
      >
        {disabled ? 'This is your listing' : 'Reserve'}
      </button>
      <AnimatePresence>
        {showChatModal ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-24 p-2 border rounded-lg mt-4"
              placeholder="Send your query to the host"
            />
            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={() => setShowChatModal(false)}
                className="bg-gray-200 text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsLoading(true);
                  const { data: { session } } = await supabase.auth.getSession();
                  if (!session) {
                    // or show a login modal
                    setIsLoading(false);
                    return;
                  }
                  const guest_id = session.user.id;
                    const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                      body: JSON.stringify({
                        listing_id,
                        guest_id,
                        message,
                      }),
                  });
                  const newConversation = await response.json();
                  window.location.href = `/messages?conversationId=${newConversation.id}`;
                  setIsLoading(false);
                }}
                className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Send
              </button>
            </div>
          </motion.div>
        ) : (
          <button 
            onClick={() => setShowChatModal(true)}
            className="w-full mt-2 bg-indigo-500 text-white font-bold py-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : 'Chat with host'}
          </button>
        )}
      </AnimatePresence>
      <p className="text-center text-sm text-gray-600 mt-2">You won't be charged yet</p>
    </motion.div>
  );
};
export default BookingCard;
