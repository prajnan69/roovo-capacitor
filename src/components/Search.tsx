"use client";

const searchResults = [
  {
    title: 'Modern Downtown Loft',
    type: 'Entire home',
    price: 120,
    rating: 4.9,
    imageUrl: '/placeholder.svg',
  },
  {
    title: 'Cozy Beachside Cottage',
    type: 'Entire home',
    price: 95,
    rating: 4.8,
    imageUrl: '/placeholder.svg',
  },
  {
    title: 'Rustic Mountain Cabin',
    type: 'Entire home',
    price: 150,
    rating: 4.9,
    imageUrl: '/placeholder.svg',
  },
  {
    title: 'Private Room in City Center',
    type: 'Private room',
    price: 60,
    rating: 4.7,
    imageUrl: '/placeholder.svg',
  },
];

const Search = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Filters Bar */}
      <div className="p-4 border-b border-gray-800 bg-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <input type="text" placeholder="Location" className="bg-gray-900 border border-gray-700 p-2 w-1/3" />
          <input type="text" placeholder="Check in" className="bg-gray-900 border border-gray-700 p-2 w-1/6" />
          <input type="text" placeholder="Check out" className="bg-gray-900 border border-gray-700 p-2 w-1/6" />
          <input type="number" placeholder="Guests" className="bg-gray-900 border border-gray-700 p-2 w-1/6" />
          <button className="bg-white text-black font-bold py-2 px-6 flex-grow">Search</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            {/* Price Range */}
            <div>
              <h3 className="text-lg font-bold mb-2">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input type="number" placeholder="Min" className="w-full bg-black border border-gray-700 p-2" />
                <span>-</span>
                <input type="number" placeholder="Max" className="w-full bg-black border border-gray-700 p-2" />
              </div>
            </div>
            {/* Accommodation Type */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Accommodation Type</h3>
              <div className="space-y-2">
                <label className="flex items-center"><input type="checkbox" className="mr-2 bg-black border-gray-600" /> Entire Home</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2 bg-black border-gray-600" /> Private Room</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2 bg-black border-gray-600" /> Unique Stays</label>
              </div>
            </div>
            {/* Amenities */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Amenities</h3>
              <div className="space-y-2">
                <label className="flex items-center"><input type="checkbox" className="mr-2 bg-black border-gray-600" /> Wi-Fi</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2 bg-black border-gray-600" /> Kitchen</label>
                <label className="flex items-center"><input type="checkbox" className="mr-2 bg-black border-gray-600" /> Parking</label>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4">Results</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {searchResults.map((result, index) => (
              <div key={index} className="border border-gray-800 bg-gray-900">
                <div className="w-full h-48 bg-gray-700"></div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{result.type}</span>
                    <span className="font-bold">{result.rating} ★</span>
                  </div>
                  <h3 className="text-lg font-bold mt-2">{result.title}</h3>
                  <p className="mt-2 font-bold">${result.price} <span className="font-normal text-gray-400">/ night</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
