"use client";

interface Listing {
  id: string;
  title: string;
  price_per_night: number;
  weekend_price: number;
  primary_image_url: string;
}

interface ListingCarouselProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelectListing: (listing: Listing) => void;
}

const ListingCarousel = ({
  listings,
  selectedListing,
  onSelectListing,
}: ListingCarouselProps) => {
  return (
    <div className="flex overflow-x-auto gap-2 mb-6 md:mb-8 pb-2 scrollbar-hide">
      {listings.map((listing) => (
        <button
          key={listing.id}
          className={`flex-shrink-0 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 text-sm font-semibold ${
            selectedListing?.id === listing.id
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => onSelectListing(listing)}
        >
          {listing.title}
        </button>
      ))}
    </div>
  );
};

export default ListingCarousel;
