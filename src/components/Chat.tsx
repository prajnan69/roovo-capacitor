"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { API_BASE_URL } from '@/services/api';
import supabase from "@/services/api";
import type { User } from "@supabase/supabase-js";
import { Spinner } from "./ui/shadcn-io/spinner";

interface Message {
  id: number | string;
  sender_id: string;
  content: string;
  is_verified: boolean;
  status?: 'sending' | 'sent' | 'failed';
}

interface ChatProps {
  conversationId: number;
}

const Chat = ({ conversationId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [hostName, setHostName] = useState('Host');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    getUser();

    const fetchChatData = async () => {
      // Fetch conversation details to get host_id
      const convResponse = await fetch(`${API_BASE_URL}/api/chat/conversation/${conversationId}`);
      const convData = await convResponse.json();
      console.log('Conversation data:', convData);
      const hostId = convData.host_id;

      // Fetch host's name
      const userResponse = await fetch(`${API_BASE_URL}/api/users/${hostId}`);
      const userData = await userResponse.json();
      console.log('User data:', userData);
      setHostName(userData.data.name);

      // Fetch messages
      const messagesResponse = await fetch(`${API_BASE_URL}/api/chat/messages/${conversationId}`);
      const messagesData = await messagesResponse.json();
      setMessages(messagesData);
    };
    fetchChatData();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages((prevMessages) => {
          // Prevent duplicates by ID
          if (prevMessages.some((msg) => msg.id === newMessage.id)) {
            return prevMessages;
          }

          // Replace optimistic message
          if (newMessage.sender_id === user?.id) {
            const optimisticMessageIndex = prevMessages.findIndex(
              (msg) =>
                msg.status === "sending" && msg.content === newMessage.content
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
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user?.id]);

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
      status: 'sending',
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
        console.error('Failed to send message:', response);
        setMessages(prevMessages => prevMessages.map(msg => msg.id === tempId ? { ...newMessageObj, status: 'failed' } : msg));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => prevMessages.map(msg => msg.id === tempId ? { ...newMessageObj, status: 'failed' } : msg) as Message[]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-lg scrollbar-hide">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold">{hostName}</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} />
        {Array.from(new Map(messages.map(msg => [msg.id, msg])).values()).slice().reverse().map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg mb-2 max-w-xs ${
              msg.sender_id === user?.id
                ? "bg-indigo-500 text-white ml-auto"
                : "bg-gray-700"
            }`}
          >
            <p>{msg.content}</p>
            {msg.status === 'sending' && <Spinner size={12} />}
            {msg.status === 'failed' && <p className="text-xs text-red-500 mt-1">Not sent</p>}
          </motion.div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-gray-800 rounded-full px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="ml-4 bg-indigo-500 hover:bg-indigo-600 rounded-full p-3"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
