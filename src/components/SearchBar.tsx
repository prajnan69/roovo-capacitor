import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <input
        type="text"
        placeholder="Search for amazing places"
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
  );
};

export default SearchBar;