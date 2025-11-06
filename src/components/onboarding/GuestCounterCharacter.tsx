"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface GuestCounterCharacterProps {
  guestCount: number;
}

const GuestCounterCharacter = ({ guestCount }: GuestCounterCharacterProps) => {
  const [characters, setCharacters] = useState<number[]>([]);

  useEffect(() => {
    if (guestCount > characters.length) {
      // Add a new character
      const availableCharacters = Array.from({ length: 15 }, (_, i) => i + 1).filter(
        (char) => !characters.includes(char)
      );
      const randomChar = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
      setCharacters([...characters, randomChar]);
    } else if (guestCount < characters.length) {
      // Remove the last character
      setCharacters(characters.slice(0, -1));
    }
  }, [guestCount, characters]);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 flex items-end h-32">
      <AnimatePresence>
        {characters.map((char) => (
          <motion.div
            key={char}
            layout
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mx-[-10px]"
          >
            <img 
              src={`/guests/${char}.png`} 
              alt={`Character for ${char} guests`}
              width={128}
              height={128}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GuestCounterCharacter;
