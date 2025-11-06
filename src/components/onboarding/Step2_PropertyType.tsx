"use client";

import { motion } from 'framer-motion';
import { Home, Building, Tractor, Hotel, Gem } from 'lucide-react';

const propertyTypes = [
  { name: 'House', icon: <Home className="w-8 h-8" /> },
  { name: 'Flat', icon: <Building className="w-8 h-8" /> },
  { name: 'Farmhouse', icon: <Tractor className="w-8 h-8" /> },
  { name: 'Guest house', icon: <Hotel className="w-8 h-8" /> },
  { name: 'Hotel', icon: <Hotel className="w-8 h-8" /> },
  { name: 'Tiny home', icon: <Home className="w-8 h-8" /> },
  { name: 'Luxurious home', icon: <Gem className="w-8 h-8" /> },
];

interface Step2PropertyTypeProps {
  onSelect: (type: string) => void;
  onBack: () => void;
}

const Step2_PropertyType = ({ onSelect }: Step2PropertyTypeProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {propertyTypes.map((type) => (
          <motion.button
            key={type.name}
            onClick={() => onSelect(type.name)}
            className="flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-200 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {type.icon}
            <span className="mt-2 font-semibold text-slate-800">{type.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Step2_PropertyType;
