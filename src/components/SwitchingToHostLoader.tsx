"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RotatingText from "./RotatingText";

interface LoaderProps {
  onAnimationComplete: () => void;
  onTransitionStart: () => void;
  to: "host" | "traveling";
}

const SwitchingToHostLoader = ({ onAnimationComplete, onTransitionStart, to }: LoaderProps) => {
  const [toHost, setToHost] = useState(false);

  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setToHost(true);
      onTransitionStart();
    }, 1400);

    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 3000);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete, onTransitionStart]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="relative flex items-center justify-center w-80 h-80 overflow-visible">
        {/* 🌍 Static Globe */}
        <div className="absolute bottom-0">
          <img src="/icons/globe_t.png" alt="Globe" width={250} height={250} />
        </div>

        {/* 🧍Man */}
      <AnimatePresence mode="sync">
        {!toHost ? (
          <motion.div
            key="man_t"
            initial={{ opacity: 1, rotate: 0 }} // Starts visible, no rotation
            exit={{ rotate: -180, opacity: 0 }} // Rotates away and fades
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute bottom-28"
            style={{ transformOrigin: "bottom center" }}
          >
            <img
              src="/icons/man_t.png"
              alt="Character"
              width={230}
              height={230}
            />
          </motion.div>
        ) : (
          <motion.div
            key="man_h"
            initial={{ rotate: 180, opacity: 0 }} // Enters from top, faded
            animate={{ rotate: 0, opacity: 1 }} // Rotates to upright and fades in
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute bottom-28"
            style={{ transformOrigin: "bottom center" }}
          >
            <img
              src="/icons/man_h.png"
              alt="Character"
              width={230}
              height={230}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      <div className="absolute bottom-1/4 text-center flex items-center">
        <img src="/logo.png" alt="Logo" className="h-7 mr-2" />
        <AnimatePresence mode="wait">
          <motion.div
            key={toHost ? "hosting" : "traveling"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <RotatingText
              texts={toHost ? ["Hosting"] : ["Traveling"]}
              mainClassName="text-3xl font-semibold text-neutral-900"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwitchingToHostLoader;
