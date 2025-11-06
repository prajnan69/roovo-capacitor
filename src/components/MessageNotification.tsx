"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedList } from "@/components/ui/animated-list";
import supabase from '@/services/api';

interface Notification {
  id: string;
  name: string;
  description: string;
  conversation_id: string;
}

const Notification = ({ name, description }: Notification) => {
  return (
    <figure
      className="relative mx-auto min-h-fit w-full max-w-[350px] cursor-pointer overflow-hidden rounded-full p-3"
      style={{
        backgroundColor: "rgba(129, 140, 248, 0.9)",
        boxShadow: `0 10px 30px -5px rgba(129, 140, 248, 0.2)`,
      }}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: "white",
          }}
        >
          <span className="text-lg">💬</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-white">
            <span className="text-sm sm:text-lg">{name}</span>
          </figcaption>
          <p className="text-sm font-normal text-white/80">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

const MessageNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const newMessage = payload.new;

        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .select('host_id')
          .eq('id', newMessage.conversation_id)
          .single();

        if (convError) {
          console.error('Error fetching conversation:', convError);
          return;
        }

        const { data: host, error: hostError } = await supabase
          .from('users')
          .select('name')
          .eq('id', conversation.host_id)
          .single();

        if (hostError) {
          console.error('Error fetching host:', hostError);
          return;
        }

        const notification: Notification = {
          id: newMessage.id,
          name: `New Message from ${host.name}`,
          description: newMessage.content,
          conversation_id: newMessage.conversation_id,
        };
        setNotifications((prev) => [...prev, notification]);

        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== newMessage.id));
        }, 3000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClick = (conversationId: string) => {
    navigate(`/messages?conversationId=${conversationId}`);
    setNotifications([]);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatedList>
        {notifications.map((item) => (
          <div key={item.id} onClick={() => handleClick(item.conversation_id)}>
            <Notification {...item} />
          </div>
        ))}
      </AnimatedList>
    </div>
  );
};

export default MessageNotification;
