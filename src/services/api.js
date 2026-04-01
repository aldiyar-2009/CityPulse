// Use VITE_ env var for production URL, fallback to localhost in dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

/**
 * Base fetch helper with auth headers and unified error handling.
 * Throws an Error with the server's message on non-2xx responses.
 */
const fetchAPI = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Ошибка сервера (${response.status})`);
    }

    return data;
  } catch (error) {
    // Re-throw to let callers handle it
    console.error(`API Error [${url}]:`, error.message);
    throw error;
  }
};

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authAPI = {
  /** Register a new user */
  register: (userData) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  /** Login with email + password */
  login: (credentials) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

// ── Users API ─────────────────────────────────────────────────────────────────

export const usersAPI = {
  /** Get current user's profile */
  getProfile: () => fetchAPI('/users/profile'),

  /** Update profile fields */
  updateProfile: (updates) =>
    fetchAPI('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  /** Top up wallet balance */
  addBalance: (amount) =>
    fetchAPI('/users/balance', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};

// ── Events API ────────────────────────────────────────────────────────────────

export const eventsAPI = {
  /**
   * Get all events, optionally filtered.
   * @param {Object} params - { category, featured, limit }
   */
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/events${queryString ? `?${queryString}` : ''}`);
  },

  /** Get a single event by numeric ID */
  getById: (id) => fetchAPI(`/events/${id}`),

  /** Purchase a ticket for an event */
  purchase: (eventId, price) =>
    fetchAPI('/events/purchase', {
      method: 'POST',
      body: JSON.stringify({ eventId, price }),
    }),

  /** Toggle favorite status for an event */
  toggleFavorite: (eventId) =>
    fetchAPI('/events/favorite', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    }),

  // Admin-only operations

  /** Create a new event */
  create: (eventData) =>
    fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  /** Update an existing event */
  update: (id, updates) =>
    fetchAPI(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  /** Delete an event */
  delete: (id) =>
    fetchAPI(`/events/${id}`, {
      method: 'DELETE',
    }),
};

export default {
  auth: authAPI,
  users: usersAPI,
  events: eventsAPI,
};
