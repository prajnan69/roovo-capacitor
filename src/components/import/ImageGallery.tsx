"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: { url: string; alt_text: string }[];
  initialIndex: number;
  onClose: () => void;
}

const ImageGallery = ({ images, initialIndex, onClose }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        {/* Preload all images in the background */}
        <div style={{ display: "none" }}>
          {images.map((image, index) => (
            <img key={index} src={image.url} alt={image.alt_text} width={800} height={600} />
          ))}
        </div>

        <motion.div
          key={currentIndex}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={images[currentIndex].url} alt={images[currentIndex].alt_text} width={800} height={600} className="max-h-[80vh] max-w-[80vw] rounded-lg" />
          <h2 className="text-white text-2xl font-bold mt-4 text-center">{images[currentIndex].alt_text}</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm text-gray-800 font-semibold p-2 rounded-full shadow-md hover:bg-white/75 transition-colors cursor-pointer"
          >
            <X />
          </button>
        </motion.div>
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm text-gray-800 font-semibold p-2 rounded-full shadow-md hover:bg-white/75 transition-colors cursor-pointer"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm text-gray-800 font-semibold p-2 rounded-full shadow-md hover:bg-white/75 transition-colors cursor-pointer"
        >
          <ChevronRight />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageGallery;
