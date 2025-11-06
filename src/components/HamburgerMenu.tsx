"use client";

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Briefcase,
  LogOut,
  Shield,
  MessageSquare,
} from 'lucide-react';

// const sharedLinks = [
// ];

// const hostLinks = [
// ];

const guestLinks = [
    { href: '/profile', label: 'Profile', icon: <Home size={20} /> },
    { href: '/bookings', label: 'Bookings', icon: <Briefcase size={20} /> },
    { href: '/messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { href: '/verify', label: 'Verify', icon: <Shield size={20} /> },
    { href: '/resolution-center', label: 'Resolution Center', icon: <Shield size={20} /> },
];

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const HamburgerMenu = ({ isOpen, onClose, onLogout }: HamburgerMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-none z-50" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-8 w-72 bg-white rounded-xl shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-2">
              {/* {sharedLinks.map(link => (
                <Link key={link.href} to={link.href} onClick={onClose} className="flex items-center gap-4 py-2 px-4 hover:bg-gray-100 rounded cursor-pointer">
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))} */}
              {/* <div className="border-t border-gray-200 my-2"></div> */}
              {/* {hostLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={onClose} className="flex items-center gap-4 py-2 px-4 hover:bg-gray-100 rounded cursor-pointer">
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2"></div> */}
              {guestLinks.map(link => (
                <Link key={link.href} to={link.href} onClick={onClose} className="flex items-center gap-4 py-2 px-4 hover:bg-gray-100 rounded cursor-pointer">
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2"></div>
              <button onClick={onLogout} className="flex items-center gap-4 py-2 px-4 hover:bg-gray-100 rounded cursor-pointer w-full">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HamburgerMenu;
