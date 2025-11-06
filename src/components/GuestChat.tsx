"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { API_BASE_URL } from "@/services/api";
import supabase from "@/services/api";
import type { User } from "@supabase/supabase-js";
import { Spinner } from "./ui/shadcn-io/spinner";
import Login from "./Login";

interface Message {
  id: number | string;
  sender_id: string;
  content: string;
  is_verified: boolean;
  status?: "sending" | "sent" | "failed";
}

interface GuestChatProps {
  conversationId?: number;
}

const GuestChat = ({ conversationId }: GuestChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [guestName, setGuestName] = useState("Guest");
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

    const fetchConversations = async () => {
      // This is a placeholder for fetching real conversations
      // In a real app, you would fetch the user's conversations from your backend
      if (isLoggedIn) {
        // setActiveConversation(conversations[0]);
      }
    };

    checkSession();
    fetchConversations();

    const fetchChatData = async () => {
      if (!conversationId) return;
      const convResponse = await fetch(`${API_BASE_URL}/api/chat/conversation/${conversationId}`);
      const convData = await convResponse.json();
      const guestId = convData.guest_id;

      const userResponse = await fetch(`${API_BASE_URL}/api/users/${guestId}`);
      const userData = await userResponse.json();
      setGuestName(userData.data.name);

      const messagesResponse = await fetch(`${API_BASE_URL}/api/chat/messages/${conversationId}`);
      const messagesData = await messagesResponse.json();
      setMessages(messagesData);
    };
    fetchChatData();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prevMessages) => {
            if (prevMessages.some((msg) => msg.id === newMessage.id)) return prevMessages;

            if (newMessage.sender_id === user?.id) {
              const optimisticMessageIndex = prevMessages.findIndex(
                (msg) => msg.status === "sending" && msg.content === newMessage.content
              );
              if (optimisticMessageIndex !== -1) {
                const updatedMessages = [...prevMessages];
                updatedMessages[optimisticMessageIndex] = {
                  ...newMessage,
                  status: "sent",
                };
                return updatedMessages;
              }
            }

            return [...prevMessages, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user?.id, isLoggedIn]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const tempId = crypto.randomUUID();
    const newMessageObj = {
      id: tempId,
      sender_id: session.user.id,
      content: newMessage,
      is_verified: true,
      status: "sending",
    };

    setMessages((prevMessages) => [...prevMessages, newMessageObj as Message]);
    setNewMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_id: session.user.id,
          content: newMessage,
        }),
      });

      if (!response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...newMessageObj, status: "failed" } : msg
          )
        );
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...newMessageObj, status: "failed" } : msg
        )
      );
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            // Re-fetch conversations after login
            const fetchConversations = async () => {
              if (isLoggedIn) {
                // setActiveConversation(conversations[0]);
              }
            };
            fetchConversations();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white text-black rounded-t-2xl overflow-hidden md:rounded-lg md:h-[calc(100vh-10rem)]">
      {/* Top header only visible on mobile */}
      <div className="md:hidden sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-200 flex items-center px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900 flex-1">{guestName}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 px-3 sm:px-4 py-2 overflow-y-auto scrollbar-hide flex flex-col-reverse">
        <div ref={messagesEndRef} />
        {Array.from(new Map(messages.map((msg) => [msg.id, msg])).values())
          .slice()
          .reverse()
          .map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`p-3 rounded-2xl mb-2 max-w-[80%] sm:max-w-xs break-words ${
                msg.sender_id === user?.id
                  ? "bg-indigo-500 text-white ml-auto rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="leading-snug">{msg.content}</p>
              {msg.status === "sending" && (
                <Spinner size={12} className="mt-1 text-white/80" />
              )}
              {msg.status === "failed" && (
                <p className="text-xs text-red-500 mt-1">Not sent</p>
              )}
            </motion.div>
          ))}
      </div>

      {/* Input (sticky with safe-area for iOS notch) */}
      <form
        onSubmit={handleSendMessage}
        className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center space-x-3"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          placeholder="Type a message..."
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-full p-3 flex items-center justify-center shadow-md"
        >
          <Send size={20} />
        </motion.button>
      </form>
    </div>
  );
};

export default GuestChat;
