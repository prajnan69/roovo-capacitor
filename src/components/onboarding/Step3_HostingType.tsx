"use client";

import { motion } from 'framer-motion';
import { Home, BedDouble, Users } from 'lucide-react';

const hostingTypes = [
  { name: 'An entire place', icon: <Home className="w-8 h-8" /> },
  { name: 'A room', icon: <BedDouble className="w-8 h-8" /> },
  { name: 'A shared room', icon: <Users className="w-8 h-8" /> },
];

interface Step3HostingTypeProps {
  onSelect: (type: string) => void;
  onBack: () => void;
}

const Step3_HostingType = ({ onSelect }: Step3HostingTypeProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {hostingTypes.map((type) => (
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

export default Step3_HostingType;
