import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing required environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export const fetchListings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/listings`);
  if (!response.ok) {
    throw new Error('Failed to fetch listings');
  }
  const data = await response.json();
  console.log('API Response:', data);
  return data;
};

export const fetchListingById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/listings/${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to fetch listing ${id}: ${response.status} ${response.statusText}`, errorText);
    throw new Error('Failed to fetch listing');
  }
  const data = await response.json();
  console.log(`Successfully fetched listing ${id}:`, data);
  return data;
};

export const getListingsByHostId = async (hostId: string) => {
  console.log(`Fetching listings for host ID: ${hostId}`);
  const response = await fetch(`${API_BASE_URL}/api/listings/host/${hostId}`);
  if (!response.ok) {
    console.error('Failed to fetch listings by host ID:', response.status, response.statusText);
    throw new Error('Failed to fetch listings by host ID');
  }
  const result = await response.json();
  console.log('Listings data:', result.data);
  return result.data;
};

export const getListingsWithBookingsByHostId = async (hostId: string) => {
  console.log(`Fetching listings with bookings for host ID: ${hostId}`);
  const response = await fetch(`${API_BASE_URL}/api/listings/host/${hostId}/with-bookings`);
  if (!response.ok) {
    console.error('Failed to fetch listings with bookings by host ID:', response.status, response.statusText);
    throw new Error('Failed to fetch listings with bookings by host ID');
  }
  const result = await response.json();
  console.log('Listings with bookings data:', result.data);
  return result.data;
};

export const fetchBookings = async (listingId?: string) => {
  let url = `${API_BASE_URL}/api/bookings`;
  if (listingId) {
    url += `?listing_id=${listingId}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

export const fetchConversationsByHostId = async (hostId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${hostId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
};

export const fetchPayoutsByHostId = async (hostId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/payouts/${hostId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payouts');
  }
  return response.json();
};

export default supabase;
