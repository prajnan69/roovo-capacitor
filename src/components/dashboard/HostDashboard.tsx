"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HostHeader from "./HostHeader";
import Calendar from "../Calendar";
import Messages from "./Messages";
import ManageListings from "./ManageListings";
import Bookings from "./Bookings";
import Payouts from "./Payouts";
import { useNavigation } from "@/hooks/useNavigation";
import supabase, { fetchConversationsByHostId } from "../../services/api";

interface HostDashboardProps {
  conversations: any[];
  selectedConversation: any;
  onConversationSelect: (conversation: any) => void;
}

const HostDashboard: React.FC<HostDashboardProps> = ({ conversations, selectedConversation, onConversationSelect }) => {
  const { pathname } = useNavigation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  useEffect(() => {
    const scrollable = scrollRef.current;
    if (scrollable) {
      const handleScroll = () => {
        scrollPosition.current = scrollable.scrollLeft;
      };
      scrollable.addEventListener("scroll", handleScroll);
      return () => {
        scrollable.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollPosition.current;
    }
  }, [pathname]);

  const renderContent = () => {
    if (pathname === "/hosting/calendar") {
      return <Calendar />;
    }
    if (pathname === "/hosting/messages") {
      return <Messages conversations={conversations} selectedConversation={selectedConversation} onConversationSelect={onConversationSelect} />;
    }
    if (pathname === "/hosting/listings") {
      return <ManageListings />;
    }
    if (pathname === "/hosting/bookings") {
      return <Bookings />;
    }
    if (pathname === "/hosting/payouts") {
      return <Payouts />;
    }
    return <Calendar />;
  };

  return (
    <div className="h-screen flex flex-col">
      {!selectedConversation && <HostHeader scrollRef={scrollRef as React.RefObject<HTMLDivElement>} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-grow overflow-y-auto"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HostDashboard;
