"use client";

import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

const SlideToReserve = ({ onSlide }: { onSlide: () => void }) => {
  const x = useMotionValue(0);
  const [slid, setSlid] = useState(false);

  const background = useTransform(
    x,
    [0, 100],
    ['#4f46e5', '#34d399']
  );

  const handleSlide = () => {
    if (!slid) {
      onSlide();
      setSlid(true);
    }
  };

  return (
    <motion.div
      className="relative w-full h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden"
      style={{ background }}
    >
      <motion.div
        className="absolute left-2 w-12 h-12 bg-white rounded-full flex items-center justify-center"
        drag="x"
        dragConstraints={{ left: 0, right: 200 }}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 150) {
            triggerHaptic();
            handleSlide();
          } else {
            x.set(0);
          }
        }}
      >
        <ChevronRight className="text-indigo-500" />
      </motion.div>
      <span>Slide to reserve</span>
    </motion.div>
  );
};

export default SlideToReserve;
