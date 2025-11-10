import { API_BASE_URL } from './api';
import supabase from './api';

export const preloadProfileData = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/users/${session.user.id}`);
  const { data } = await response.json();
  return data;
};
