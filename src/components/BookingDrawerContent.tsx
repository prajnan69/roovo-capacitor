"use client";

import { useState, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import MobileWhen from './MobileWhen';
import { triggerHaptic } from '@/lib/haptics';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BookingDrawerContentProps {
  onApply: (dates: { checkIn: Date | null; checkOut: Date | null }, guests: number) => void;
  max_guests: number;
}

const BookingDrawerContent = forwardRef<HTMLDivElement, BookingDrawerContentProps>(
  ({ onApply, max_guests }, ref) => {
    const [dates, setDates] = useState<{ checkIn: Date | null; checkOut: Date | null }>({ checkIn: null, checkOut: null });
    const [guests, setGuests] = useState(1);
    const [showAlert, setShowAlert] = useState(false);

    const handleApply = () => {
      if (!dates.checkIn || !dates.checkOut) {
        setShowAlert(true);
        return;
      }
      onApply(dates, guests);
    };

    return (
      <div ref={ref}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-center">
            <MobileWhen dates={dates} setDates={setDates} />
          </div>
          <div className="mt-6 pb-4">
        <h3 className="text-lg font-bold">Guests</h3>
        <div className="flex items-center justify-between mt-2 text-lg">
          <button
            onClick={() => {
              triggerHaptic();
              setGuests(Math.max(1, guests - 1));
            }}
            className="px-4 py-2 border rounded-full"
          >
            -
          </button>
          <span className="text-xl font-bold">{guests}</span>
          <button
            onClick={() => {
              triggerHaptic();
              setGuests(Math.min(max_guests, guests + 1));
            }}
            className="px-4 py-2 border rounded-full"
          >
            +
          </button>
        </div>
      </div>
      <Button
        onClick={() => {
          triggerHaptic();
          handleApply();
        }}
        className="mt-auto w-full bg-indigo-500 hover:bg-indigo-600 text-white"
      >
        Reserve
      </Button>
        </div>
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Incomplete Selection</AlertDialogTitle>
            <AlertDialogDescription>
              Please select a check-in and check-out date to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    );
  }
);

BookingDrawerContent.displayName = "BookingDrawerContent";

export default BookingDrawerContent;
