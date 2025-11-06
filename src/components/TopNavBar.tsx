"use client";

import { Link, useLocation } from 'react-router-dom';

const hostNavItems = [
  { href: '/manage-listings', label: 'Listings' },
  { href: '/manage-bookings', label: 'Bookings' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/payouts', label: 'Payouts' },
  { href: '/superhost', label: 'Superhost' },
];

const TopNavBar = () => {
  const { pathname } = useLocation();

  // Only show the top nav on host-related pages
  if (!hostNavItems.some(item => pathname.startsWith(item.href))) {
    return null;
  }

  return (
    <header className="relative z-50 bg-black text-white p-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Host Dashboard</h1>
        <nav className="flex space-x-6">
          {hostNavItems.map((item) => (
            <Link key={item.href} to={item.href} className={`font-semibold ${
                pathname === item.href ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}>
                {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default TopNavBar;
