"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from '@/hooks/useWindowSize';
import axios from 'axios';

interface Message {
  text: string;
  sender: 'user' | 'agent';
}

const Support = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi there! How can I help you today?", sender: "agent" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    // This should be replaced with a proper auth solution
    // that provides the userId without a direct supabase call.
    // For now, we'll simulate it.
    setUserId('some-user-id');
  }, []);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchTicket = async () => {
        try {
          const { data: tickets } = await axios.get(`/api/support/tickets/user/${userId}`);
          if (tickets && tickets.length > 0) {
            const currentTicketId = tickets[0].id;
            setTicketId(currentTicketId);
            const { data: messages } = await axios.get(`/api/support/tickets/${currentTicketId}/messages`);
            setMessages([
              { text: "Hi there! How can I help you today?", sender: "agent" },
              ...messages.map((msg: any) => ({
                text: msg.message,
                sender: msg.sender_id === userId ? 'user' : 'agent',
              }))
            ]);
          }
        } catch (error) {
          console.error('Error fetching ticket or messages:', error);
        }
      };
      fetchTicket();
    }
  }, [isOpen, userId]);

  if (isMobile) {
    return null;
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !userId) return;

    let currentTicketId = ticketId;

    try {
      if (!currentTicketId) {
        const { data: newTicket } = await axios.post('/api/support/tickets', {
          userId,
          message: newMessage,
        });
        currentTicketId = newTicket.id;
        setTicketId(currentTicketId);
      } else {
        await axios.post(`/api/support/tickets/${currentTicketId}/messages`, {
          senderId: userId,
          message: newMessage,
        });
      }

      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col"
          >
            <div className="p-4 bg-indigo-500 text-white rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-semibold">Support</h3>
              <button onClick={() => setIsOpen(false)} className="text-white">&times;</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`rounded-lg px-3 py-2 ${message.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-indigo-500 text-white px-4 py-2 rounded-r-lg"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 rounded-full shadow-md p-3 flex items-center space-x-2"
      >
        <img src="/logo.png" alt="Support" width={24} height={24} />
        <span className="font-semibold">Support</span>
      </button>
    </div>
  );
};

export default Support;
