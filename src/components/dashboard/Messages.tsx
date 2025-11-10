"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../services/api";
import { API_BASE_URL } from "../../services/api";
import Chat from "../Chat";

interface MessagesPageProps {
  conversations: any[];
  selectedConversation: any;
  onConversationSelect: (conversation: any) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({
  conversations: initialConversations,
  selectedConversation,
  onConversationSelect,
}) => {
  const [conversations, setConversations] = useState<any[]>(initialConversations);

  const handleConversationSelect = (conversation: any) => {
    onConversationSelect(conversation);
  };

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  useEffect(() => {
    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        (payload) => {
          setConversations((prev) => {
            const newConversations = [...prev];
            const index = newConversations.findIndex(
              (c) => c.id === (payload.new as any).id
            );
            if (index !== -1) {
              newConversations.splice(index, 1);
            }
            newConversations.unshift(payload.new as any);
            return newConversations;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      <AnimatePresence initial={false} mode="wait">
        {!selectedConversation ? (
          <motion.div
            key="list"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-4"
          >
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((convo) => (
                  <motion.div
                    key={convo.id}
                    layoutId={`conversation-${convo.id}`}
                    onClick={() => handleConversationSelect(convo)}
                    className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-4 cursor-pointer"
                    whileTap={{ scale: 0.97 }}
                  >
                    <img
                      src={convo.listing.primary_image_url ?? "/placeholder.svg"}
                      alt="Listing"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-800 truncate-one-line max-w-[150px]">{convo.listing.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(convo.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{convo.guest.name || "Guest"}</p>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {convo.last_message?.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            className="absolute inset-0 bg-white flex flex-col"
          >
            <motion.div
              layoutId={`conversation-${selectedConversation.id}`}
              className="flex items-center p-3 border-b bg-white sticky top-0 z-10"
              transition={{ type: "spring", stiffness: 500, damping: 50 }}
            >
              <button
                onClick={() => handleConversationSelect(null)}
                className="text-gray-600 mr-3 p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <img
                src={selectedConversation.listing.primary_image_url ?? "/placeholder.svg"}
                alt="Listing"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-800">{selectedConversation.listing.title}</p>
                <p className="text-xs text-gray-500">{selectedConversation.listing.property_type}</p>
              </div>
            </motion.div>
            <div className="flex-1 overflow-y-auto">
              <Chat conversationId={selectedConversation.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesPage;
