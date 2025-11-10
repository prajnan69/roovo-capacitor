"use client";

import { useNavigation } from "@/hooks/useNavigation";
import type { RefObject } from "react";

interface HostHeaderProps {
  scrollRef: RefObject<HTMLDivElement | null>;
}

const HostHeader: React.FC<HostHeaderProps> = ({ scrollRef }) => {
  const { navigate, pathname } = useNavigation();
  const navItems = [
    { id: "calendar", label: "Calendar", path: "/hosting/calendar" },
    { id: "messages", label: "Messages", path: "/hosting/messages" },
    { id: "listings", label: "Listings", path: "/hosting/listings" },
    { id: "bookings", label: "Bookings", path: "/hosting/bookings" },
    { id: "payouts", label: "Payouts", path: "/hosting/payouts" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white text-black p-4 border-b border-gray-200">
      <div ref={scrollRef} className="max-w-7xl mx-auto flex justify-between items-center overflow-x-auto scrollbar-hide">
        <nav className="flex space-x-6">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`font-semibold cursor-pointer whitespace-nowrap ${
                pathname === item.path || (item.id === "calendar" && pathname === "/hosting")
                  ? "text-black"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default HostHeader;
