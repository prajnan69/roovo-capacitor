import { API_BASE_URL } from './api';
import supabase from './api';

export const preloadAllGuestChats = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return;
  }

  const conversationsResponse = await fetch(`${API_BASE_URL}/api/chat/conversations/user/${session.user.id}`);
  const conversations = await conversationsResponse.json();

  const preloadPromises = conversations.map((conversation: { id: number }) => {
    const conversationId = conversation.id;
    const fetchConversation = fetch(`${API_BASE_URL}/api/chat/conversation/${conversationId}`).then(res => res.json());
    const fetchMessages = fetch(`${API_BASE_URL}/api/chat/messages/${conversationId}`).then(res => res.json());

    return Promise.all([fetchConversation, fetchMessages]).then(([conversationData]) => {
      const guestId = conversationData.guest_id;
      return fetch(`${API_BASE_URL}/api/users/${guestId}`).then(res => res.json());
    });
  });

  await Promise.all(preloadPromises);
};
