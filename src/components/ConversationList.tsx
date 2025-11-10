"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/services/api";
import supabase from "@/services/api";
import type { User } from "@supabase/supabase-js";
import { useNavigation } from "@/hooks/useNavigation";
import { formatLastMessageAt } from "@/lib/utils";
import Login from "./Login";

interface Conversation {
  id: number;
  guest_id: string;
  host_id: string;
  listing_id: number;
  last_message_at: string;
  guest: {
    name: string;
  };
  host: {
    name: string;
  };
  listing: {
    title: string;
    primary_image_url: string;
  };
}

const ConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { navigate } = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      if (session) {
        setUser(session.user);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      const response = await fetch(`${API_BASE_URL}/api/chat/conversations/guest/${user.id}`);
      const data = await response.json();
      console.log("API Response:", data);
      setConversations(data);
    };
    if (user) {
      fetchConversations();
    }
  }, [user]);

  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-white text-black flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-gray-600 mb-8">Login to view your messages.</p>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-indigo-500 text-white font-bold py-3 px-6 rounded-md hover:bg-indigo-600 transition-colors"
        >
          Login
        </button>
        <Login
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={() => {
            setIsLoginOpen(false);
            setIsLoggedIn(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white text-black">
      <div className="p-4">
        <div className="text-xl font-bold">Messages</div>
      </div>
      <div className="divide-y divide-gray-200">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => navigate(`/messages/${conversation.id}`)}
            className="p-4 flex items-center space-x-4 cursor-pointer"
          >
            <img
              src={conversation.listing.primary_image_url}
              alt={conversation.listing.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{conversation.listing.title}</h2>
                <p className="text-sm text-gray-500">
                  {formatLastMessageAt(conversation.last_message_at)}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {user?.id === conversation.guest_id
                  ? `Conversation with ${conversation.host.name}`
                  : `Conversation with ${conversation.guest.name}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
