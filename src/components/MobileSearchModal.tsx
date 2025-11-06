"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileWhere from './MobileWhere';
import MobileWhen from './MobileWhen';
import MobileWho from './MobileWho';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: { name: string; img: string };
  setSelectedCity: (city: { name: string; img: string }) => void;
  dates: { checkIn: Date | null; checkOut: Date | null };
  setDates: (dates: { checkIn: Date | null; checkOut: Date | null }) => void;
  adults: number;
  setAdults: (n: number) => void;
  childrenState: number;
  setChildrenState: (n: number) => void;
  infants: number;
  setInfants: (n: number) => void;
  pets: number;
  setPets: (n: number) => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  setSelectedCity,
  dates,
  setDates,
  adults,
  setAdults,
  childrenState,
  setChildrenState,
  infants,
  setInfants,
  pets,
  setPets,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 bg-gray-50 z-50 flex flex-col"
        >
          <header className="flex items-center justify-center p-4 relative">
            <button onClick={onClose} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-lg font-bold">Plan your trip</h2>
          </header>

          <main className="flex-grow overflow-y-auto px-4 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-8"
            >
              <section className="bg-white p-4 rounded-2xl shadow-sm">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Where to?</h3>
                <MobileWhere selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
              </section>
              <section className="bg-white p-4 rounded-2xl shadow-sm">
                <h3 className="font-bold text-xl mb-4 text-gray-800">When's your trip?</h3>
                <MobileWhen dates={dates} setDates={setDates} />
              </section>
              <section className="bg-white p-4 rounded-2xl shadow-sm">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Who's coming?</h3>
                <MobileWho 
                  adults={adults}
                  setAdults={setAdults}
                  childrenState={childrenState}
                  setChildrenState={setChildrenState}
                  infants={infants}
                  setInfants={setInfants}
                  pets={pets}
                  setPets={setPets}
                />
              </section>
            </motion.div>
          </main>

          <motion.footer 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200"
          >
            <button 
              onClick={onClose}
              className="w-full bg-indigo-500 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 text-lg"
            >
              Search
            </button>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchModal;
