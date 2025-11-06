"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SlidingText = ({ animate = true }) => {
  const [index, setIndex] = useState(animate ? 0 : 4);
  const words = ["📍 Where?", "📅 When?", "🫂 Who?"];

  useEffect(() => {
    if (animate) {
      const intervalId = setInterval(() => {
        setIndex(prevIndex => {
          if (prevIndex >= words.length - 1) {
            clearInterval(intervalId);
            return prevIndex + 1;
          }
          return prevIndex + 1;
        });
      }, 1500);

      return () => clearInterval(intervalId);
    }
  }, [animate, words.length]);

  return (
    <div className="flex items-center">
      <AnimatePresence mode="wait">
        {index < words.length ? (
          <motion.span
            key={index}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {words[index]}
          </motion.span>
        ) : (
          <motion.div
            key="final-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span>📍 Where?</span>
            <span className="mx-2">|</span>
            <span>📅 When?</span>
            <span className="mx-2">|</span>
            <span>🫂 Who?</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlidingText;
