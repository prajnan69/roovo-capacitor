"use client";

import React, { useState } from 'react';
import MobileSearchModal from './MobileSearchModal';

interface MobileSearchBarProps {
  onClose: () => void;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({ onClose }) => {
  const [isModalOpen] = useState(true);
  const [selectedCity, setSelectedCity] = useState({ name: "Anywhere", img: "/bengaluru.png" });
  const [dates, setDates] = useState<{ checkIn: Date | null; checkOut: Date | null }>({ checkIn: null, checkOut: null });
  const [adults, setAdults] = useState(0);
  const [childrenState, setChildrenState] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const handleSearch = () => {
    localStorage.setItem('lastSearchedCity', selectedCity.name);
    onClose();
  };

  return (
    <div className="p-4">
      <MobileSearchModal
        isOpen={isModalOpen}
        onClose={handleSearch}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        dates={dates}
        setDates={setDates}
        adults={adults}
        setAdults={setAdults}
        childrenState={childrenState}
        setChildrenState={setChildrenState}
        infants={infants}
        setInfants={setInfants}
        pets={pets}
        setPets={setPets}
      />
    </div>
  );
};

export default MobileSearchBar;
