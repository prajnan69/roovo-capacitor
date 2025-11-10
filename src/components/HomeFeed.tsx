"use client";

import React, { useEffect, useState, useRef } from 'react';
import ListingSection from './ListingSection';
import { API_BASE_URL } from '@/services/api';
import { SkeletonCard } from './SkeletonCard';
import MobileSearchBar from './MobileSearchBar';
import type { ListingData as Listing } from '@/types';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import supabase from '@/services/api';
import { triggerHaptic } from '@/lib/haptics';


// --- Main HomeFeed Component ---
const HomeFeed: React.FC<{ onSwitchToHost?: () => void }> = ({ onSwitchToHost }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [popularTitle, setPopularTitle] = useState('Popular homes in Karnataka');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const popularHomes = listings.slice(0, 8);
  const weekendHomes = listings.slice(8, 16);
  const newHomes = listings.slice(4, 12);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchListings = async (city?: string) => {
      setLoading(true);
      setError(null);
      try {
        const url = city ? `${API_BASE_URL}/api/listings?city=${city}` : `${API_BASE_URL}/api/listings`;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        console.log('API Response:', data);
        // Add a random rating for demonstration purposes if not present
const listingsWithExtras = (data.data || []).map((listing: Listing) => ({
...listing,
rating: listing.overall_rating || (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1),
}));
        setListings(listingsWithExtras);

        if (city && listingsWithExtras.length > 0) {
          console.log(`SUCCESS: Found listings for '${city}'. Setting title.`);
          setPopularTitle(`Popular homes in ${city}`);
        } else {
          console.log(`INFO: No listings found for '${city}' or no city provided. Defaulting title to Karnataka.`);
          setPopularTitle('Popular homes in Karnataka');
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("We couldn't load the listings. Please try again later.");
      } finally {
        // Add a small delay to prevent jarring loading flashes
        setTimeout(() => {
          setLoading(false);
          setIsInitialLoad(false);
        }, 1000);
      }
    };

    console.log('Fetching listings...');
    fetchListings();

    const fetchRecentlyViewed = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      let combinedRecentlyViewed: Listing[] = [];

      // Fetch from DB
      if (session) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/recently-viewed/${session.user.id}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            combinedRecentlyViewed.push(...data.map((item: any) => item.listings));
          }
        } catch (error) {
          console.error('Error fetching recently viewed listings from DB:', error);
        }
      }

      // Fetch from localStorage
      try {
        const localHistory = localStorage.getItem('recentlyViewed');
        if (localHistory) {
          combinedRecentlyViewed.push(...JSON.parse(localHistory));
        }
      } catch (error) {
        console.error('Error fetching recently viewed listings from localStorage:', error);
      }

      // Deduplicate
      const uniqueRecentlyViewed = Array.from(new Map(combinedRecentlyViewed.map(item => [item.id, item])).values());
      setRecentlyViewed(uniqueRecentlyViewed);
    };

    fetchRecentlyViewed();
  }, []);

  // --- Conditional Rendering Logic ---
  const renderContent = () => {
    if (isInitialLoad) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      );
    }

    if (loading) {
      return (
        <div className="bg-white p-4">
        <div className="flex flex-col space-y-6">
          <ListingSection title="Popular homes" listings={[]} loading={true} />
          <ListingSection title="Available this weekend" listings={[]} loading={true} />
          <ListingSection title="New homes on Roovo" listings={[]} loading={true} />
        </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center text-center py-12 h-64">
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
      );
    }

    if (listings.length === 0) {
      return (
        <div className="flex items-center justify-center text-center py-12 h-64">
          <p className="text-slate-600">No homes available at the moment. Please check back later!</p>
        </div>
      );
    }

    // --- Render the sections with actual data ---
    return (
      <div className="flex flex-col space-y-6">
        {recentlyViewed.length > 0 && <ListingSection title="You recently viewed" listings={recentlyViewed} loading={false} size="small" />}
        {popularHomes.length > 0 && <ListingSection title={popularTitle} listings={popularHomes} loading={false} />}
        {weekendHomes.length > 0 && <ListingSection title="Available this weekend" listings={weekendHomes} loading={false} />}
        {newHomes.length > 0 && <ListingSection title="New homes on Roovo" listings={newHomes} loading={false} />}
      </div>
    );
  };

  return (
    <>
      {isMobile && (
        <div 
          onClick={() => {
            triggerHaptic();
            setIsSearchOpen(true);
          }}
          className="bg-white p-3 rounded-full shadow-md flex items-center justify-between cursor-pointer mx-4 mt-4"
        >
          <div className="flex items-center">
            <svg className="w-6 h-6 text-slate-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <div>
              <div className="font-semibold text-slate-800">Where to?</div>
              <div className="text-sm text-slate-500">Anywhere • Any week • Add guests</div>
            </div>
          </div>
        </div>
      )}
      <main className={`w-full ${isMobile ? '' : 'max-w-7xl mx-auto px-4 sm:px-8'} py-12`}>
        {renderContent()}
      </main>
      {isSearchOpen && (
        <MobileSearchBar onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
};

export default HomeFeed;
