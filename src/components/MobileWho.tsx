"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileWhoProps {
  adults: number;
  setAdults: (n: number) => void;
  childrenState: number;
  setChildrenState: (n: number) => void;
  infants: number;
  setInfants: (n: number) => void;
  pets: number;
  setPets: (n: number) => void;
}

const GuestCounter: React.FC<{ title: string; subtitle: string; value: number; setValue: (n: number) => void; }> = ({ title, subtitle, value, setValue }) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <p className="font-semibold text-slate-800 text-lg">{title}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
    <div className="flex items-center space-x-3">
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setValue(Math.max(0, value - 1))} className="p-1 rounded-full border border-slate-300 text-slate-600 hover:border-slate-500 disabled:opacity-50" disabled={value === 0}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
      </motion.button>
      <AnimatePresence mode="wait">
        <motion.span key={value} initial={{y: 8, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: -8, opacity: 0}} transition={{duration: 0.2, ease: "anticipate"}} className="text-lg font-bold w-6 text-center text-slate-900">{value}</motion.span>
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setValue(value + 1)} className="p-1 rounded-full border border-slate-300 text-slate-600 hover:border-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
      </motion.button>
    </div>
  </div>
);

const MobileWho: React.FC<MobileWhoProps> = ({ adults, setAdults, childrenState, setChildrenState, infants, setInfants, pets, setPets }) => {
  return (
    <div className="flex flex-col divide-y divide-slate-200">
      <GuestCounter title="Adults" subtitle="Ages 13 or above" value={adults} setValue={setAdults} />
      <GuestCounter title="Children" subtitle="Ages 2-12" value={childrenState} setValue={setChildrenState} />
      <GuestCounter title="Infants" subtitle="Under 2" value={infants} setValue={setInfants} />
      <GuestCounter title="Pets" subtitle="Bringing a service animal?" value={pets} setValue={setPets} />
    </div>
  );
};

export default MobileWho;
