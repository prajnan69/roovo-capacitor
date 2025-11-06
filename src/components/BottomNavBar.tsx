"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { useState, useEffect } from "react";
import supabase from "@/services/api";
import { FaExchangeAlt } from "react-icons/fa";
import {
  AiFillHome,
  AiOutlineHome,
  AiFillMessage,
  AiOutlineMessage,
} from "react-icons/ai";
import { IoSearch, IoSearchOutline } from "react-icons/io5";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigation } from "@/hooks/useNavigation";
import { triggerHaptic } from "@/lib/haptics";

const navItems = (isLoggedIn: boolean): {
  href: string;
  label: string;
  icon: IconType;
  activeIcon: IconType;
}[] => [
  { href: "/", label: "Home", icon: AiOutlineHome, activeIcon: AiFillHome },
  { href: "/search", label: "Search", icon: IoSearchOutline, activeIcon: IoSearch },
  { href: "/messages", label: "Messages", icon: AiOutlineMessage, activeIcon: AiFillMessage },
  isLoggedIn
    ? { href: "/profile", label: "Profile", icon: FaRegUserCircle, activeIcon: FaUserCircle }
    : { href: "/login", label: "Login", icon: FaSignInAlt, activeIcon: FaSignInAlt },
];

interface BottomNavBarProps {
  show: boolean;
  onSearchClick: () => void;
  openLogin: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ show, onSearchClick, openLogin }) => {
  const { pathname, navigate } = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      if (session) {
        // You might have a better way to check if the user is a host
        const { data: hostData, error } = await supabase
          .from('hosts')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        setIsHost(!!hostData);
      }
    };
    checkSession();
  }, []);

  const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    triggerHaptic();
    if (!isLoggedIn) {
      e.preventDefault();
      openLogin();
    } else {
      navigate("/profile");
    }
  };

  const navLinks = navItems(isLoggedIn);

  if (isHost) {
    navLinks.splice(2, 0, {
      href: "/hosting",
      label: "Hosting",
      icon: FaExchangeAlt,
      activeIcon: FaExchangeAlt,
    });
  }

  const variants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: "100%", opacity: 0 },
  };

  return (
    <motion.footer
      initial="visible"
      animate={show ? "visible" : "hidden"}
      variants={variants}
      transition={{ ease: "easeInOut", duration: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md rounded-3xl bg-white/5 backdrop-blur-lg border border-white/20 shadow-lg shadow-black/20 md:hidden"
    >
      <div
        className={`grid h-16 w-full items-center ${
          isHost ? "grid-cols-5" : "grid-cols-4"
        }`}
      >
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;
          const isSearchButton = item.label === "Search";

          const content = (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center h-full text-xs transition-all ${
                isActive ? "text-indigo-500" : "text-black"
              }`}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? -4 : 0,
                }}
                transition={{ ease: "easeInOut", duration: 0.3 }}
                className="relative"
              >
                <Icon size={22} />
              </motion.div>
              <span
                className={`mt-1 text-[11px] font-medium ${
                  isActive ? "text-indigo-500" : "text-black"
                }`}
              >
                {item.label}
              </span>
            </motion.div>
          );

          if (isSearchButton) {
            return (
              <button
                key={item.href}
                onClick={() => {
                  triggerHaptic();
                  onSearchClick();
                }}
                className="relative focus:outline-none w-full h-full flex items-center justify-center"
              >
                {content}
              </button>
            );
          }

          if (item.label === "Profile" || item.label === "Login") {
            return (
              <button
                key={item.href}
                onClick={handleProfileClick}
                className="relative w-full h-full flex items-center justify-center"
              >
                {content}
              </button>
            );
          }

          return (
            <button
              key={item.href}
              onClick={() => {
                triggerHaptic();
                navigate(item.href);
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {content}
            </button>
          );
        })}
      </div>
    </motion.footer>
  );
};

export default BottomNavBar;
