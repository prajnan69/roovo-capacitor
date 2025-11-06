"use client";

import Counter from '../Counter';
import GuestCounterCharacter from './GuestCounterCharacter';
import { Plus, Minus } from 'lucide-react';

interface Step4BasicsProps {
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  setGuests: (value: number) => void;
  setBedrooms: (value: number) => void;
  setBeds: (value: number) => void;
  setBathrooms: (value: number) => void;
  onBack: () => void;
  onFinish: () => void;
}

const Step4_Basics = ({
  guests,
  bedrooms,
  beds,
  bathrooms,
  setGuests,
  setBedrooms,
  setBeds,
  setBathrooms,
  onFinish,
}: Step4BasicsProps) => {
  return (
    <div className="flex flex-col justify-center h-full max-w-lg mx-auto">
      <GuestCounterCharacter guestCount={guests} />
      <div className="space-y-2">
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <span className="text-lg font-medium text-slate-800">Guests</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={guests <= 1}
            >
              <Minus className="w-5 h-5" />
            </button>
            <Counter value={guests} fontSize={20} textColor="black" gradientFrom="transparent" />
            <button
              onClick={() => setGuests(Math.min(15, guests + 1))}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={guests >= 15}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <span className="text-lg font-medium text-slate-800">Bedrooms</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={bedrooms <= 0}
            >
              <Minus className="w-5 h-5" />
            </button>
            <Counter value={bedrooms} fontSize={20} textColor="black" gradientFrom="transparent" />
            <button
              onClick={() => setBedrooms(Math.min(15, bedrooms + 1))}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={bedrooms >= 15}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <span className="text-lg font-medium text-slate-800">Beds</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBeds(Math.max(1, beds - 1))}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={beds <= 1}
            >
              <Minus className="w-5 h-5" />
            </button>
            <Counter value={beds} fontSize={20} textColor="black" gradientFrom="transparent" />
            <button
              onClick={() => setBeds(beds + 1)}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <span className="text-lg font-medium text-slate-800">Bathrooms</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={bathrooms <= 1}
            >
              <Minus className="w-5 h-5" />
            </button>
            <Counter value={bathrooms} fontSize={20} textColor="black" gradientFrom="transparent" />
            <button
              onClick={() => setBathrooms(Math.min(15, bathrooms + 1))}
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={bathrooms >= 15}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={onFinish}
          className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-600 transition-colors duration-300 text-lg cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4_Basics;
