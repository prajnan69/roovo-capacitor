"use client";

import { motion, AnimatePresence } from "framer-motion";

type Image = {
  src: string;
  name: string;
};

export const AnimatedImages = ({
  images,
  active,
}: {
  images: Image[];
  active: number;
}) => {
  const isActive = (index: number) => index === active;

  return (
    <div
      className="relative h-full w-full"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <AnimatePresence>
        {images.map((image, index) => {
          const distance = index - active;

          return (
            <motion.div
              key={`${image.src}-${index}`}
              initial={{
                opacity: 0,
                scale: 0.9,
                rotateY: 20,
                z: -50,
              }}
              animate={{
                opacity: isActive(index) ? 1 : 0.6,
                scale: isActive(index) ? 1 : 0.95,
                rotateY: isActive(index)
                  ? 0 // active image flat
                  : distance < 0
                  ? -8 // slight left tilt for behind images
                  : 8, // slight right tilt for behind images
                zIndex: isActive(index)
                  ? 10
                  : images.length - Math.abs(distance),
                z: isActive(index) ? 0 : -40 * Math.abs(distance), // stacked behind each other
                y: 0,
                x: 0, // keep perfectly centered
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                rotateY: 10,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={image.src}
                alt={image.name}
                draggable={false}
                className="h-full w-full rounded-2xl object-cover shadow-lg"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
