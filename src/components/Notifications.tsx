"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '@/services/api';
import { API_BASE_URL } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications/${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
          }
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchNotifications().finally(() => setLoading(false));
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleIconClick = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          await fetch(`${API_BASE_URL}/api/notifications/${session.user.id}/read`, { method: 'POST' });
          setUnreadCount(0);
        } catch (err) {
          console.error("Error marking notifications as read:", err);
        }
      }
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.message_type === 'message') {
      navigate('/messages');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleIconClick} className="relative p-2 rounded-full hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full"
          />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999]"
          >
            <div className="p-4">
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="border-t border-gray-200 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    className={`p-4 border-b border-gray-200 cursor-pointer ${notification.is_read ? 'text-gray-400' : ''}`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <span className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleString()}</span>
                  </motion.div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No new notifications</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
