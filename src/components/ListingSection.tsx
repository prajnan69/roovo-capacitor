"use client";

import React, { useRef, useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import { SkeletonCard } from './SkeletonCard';
import { motion } from 'framer-motion';
import type { ListingData as Listing } from '@/types';

interface ListingSectionProps {
  title: string;
  listings: Listing[];
  loading: boolean;
  onImageLoad?: () => void;
  size?: 'small' | 'normal';
}

const ListingSection: React.FC<ListingSectionProps> = ({ title, listings, loading, onImageLoad = () => {}, size = 'normal' }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // This function checks if scrolling is possible in either direction
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Check if there's content to scroll to the left
      setCanScrollLeft(container.scrollLeft > 0);

      // Check if there's content to scroll to the right
      // The +1 is a small buffer for fractional pixel values
      const isScrollable = container.scrollWidth > container.clientWidth;
      const hasScrolledToEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 1;
      setCanScrollRight(isScrollable && !hasScrolledToEnd);
    }
  };

  // Run the scroll check when the component mounts or when listings data/loading state changes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // A small delay ensures the layout is stable before the initial check
      const timer = setTimeout(checkScrollability, 100);
      
      // Also re-check whenever the window is resized
      window.addEventListener('resize', checkScrollability);
      
      // Cleanup the event listener and timer when the component unmounts
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [listings, loading]);


  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Scroll by 80% of the container's visible width for a pleasant "page-like" scroll
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    // The 'group' class allows child elements to change styles based on the parent's state (e.g., on hover)
    <section className="relative group">
      {/* --- Section Header --- */}
      <div className={`flex items-center justify-between mb-4 ${isMobile ? 'px-4' : ''}`}>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      </div>

      {/* Buttons will be positioned relative to this container */}
      <div className="relative">
        {/* --- Horizontally Scrollable Content --- */}
        <motion.div
          ref={scrollContainerRef}
          onScroll={checkScrollability} // Re-check scrollability whenever the user manually scrolls
          className={`flex ${isMobile ? 'space-x-4 px-4' : 'space-x-6'} overflow-x-auto pb-4 scrollbar-hide`}
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => <div key={`skel-${index}`} className={size === 'small' ? 'w-40' : 'w-56'}><SkeletonCard /></div>)
            : listings.map((listing) => (
                <motion.div
                  key={listing.id}
                  className={size === 'small' ? 'w-40' : 'w-56'}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <ListingCard listing={listing} onImageLoad={onImageLoad} isMobile={isMobile} size={size} />
                </motion.div>
              ))
          }
        </motion.div>
        
        {/* Left Scroll Button - appears on group hover and disappears when disabled */}
        {!isMobile && <button
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-full -translate-x-1/2 z-10 p-2 rounded-full bg-white shadow-lg border border-slate-200 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>}
        
        {/* Right Scroll Button - appears on group hover and disappears when disabled */}
        {!isMobile && <button
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-full translate-x-1/2 z-10 p-2 rounded-full bg-white shadow-lg border border-slate-200 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-default"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>}
      </div>
    </section>
  );
};

export default ListingSection;
