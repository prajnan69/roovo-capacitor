import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoovoLogo from './RoovoLogo';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: 'drop-shadow(0 0 1.5rem #8400FF)',
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <RoovoLogo />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
