"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Tv, Utensils, Wind, WashingMachine, ParkingCircle, Waves, Fan, Refrigerator, Microwave } from 'lucide-react';

const allAmenities = [
  { name: 'Wifi', icon: <Wifi className="w-8 h-8" /> },
  { name: 'TV', icon: <Tv className="w-8 h-8" /> },
  { name: 'Kitchen', icon: <Utensils className="w-8 h-8" /> },
  { name: 'Air conditioning', icon: <Wind className="w-8 h-8" /> },
  { name: 'Washing machine', icon: <WashingMachine className="w-8 h-8" /> },
  { name: 'Free parking', icon: <ParkingCircle className="w-8 h-8" /> },
  { name: 'Swimming pool', icon: <Waves className="w-8 h-8" /> },
  { name: 'Fan', icon: <Fan className="w-8 h-8" /> },
  { name: 'Refrigerator', icon: <Refrigerator className="w-8 h-8" /> },
  { name: 'Microwave', icon: <Microwave className="w-8 h-8" /> },
];

interface Step5AmenitiesProps {
  onBack: () => void;
  onFinish: () => void;
}

const Step5_Amenities = ({ onBack, onFinish }: Step5AmenitiesProps) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-slate-500 mt-2">Select all that apply.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allAmenities.map((amenity) => (
          <motion.button
            key={amenity.name}
            onClick={() => toggleAmenity(amenity.name)}
            className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-200 cursor-pointer h-32 ${
              selectedAmenities.includes(amenity.name) ? 'border-indigo-600 bg-indigo-50' : 'hover:border-gray-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {amenity.icon}
            <span className="mt-2 font-semibold text-slate-800 text-center">{amenity.name}</span>
          </motion.button>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <button 
          onClick={onBack}
          className="text-indigo-500 font-bold py-3 px-8 rounded-lg hover:bg-indigo-50 transition-colors duration-300 text-lg cursor-pointer"
        >
          Back
        </button>
        <button 
          onClick={onFinish}
          className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-600 transition-colors duration-300 text-lg cursor-pointer"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default Step5_Amenities;
