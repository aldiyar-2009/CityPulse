const API_URL = 'http://localhost:5000/api';

// Получить токен из localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Установить токен в localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Удалить токен из localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Базовый fetch с обработкой ошибок
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
      throw new Error(data.message || 'Ошибка сервера');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => 
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

// Users API
export const usersAPI = {
  getProfile: () => fetchAPI('/users/profile'),

  updateProfile: (updates) =>
    fetchAPI('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  addBalance: (amount) =>
    fetchAPI('/users/balance', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};

// Events API
export const eventsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/events${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => fetchAPI(`/events/${id}`),

  purchase: (eventId, price) =>
    fetchAPI('/events/purchase', {
      method: 'POST',
      body: JSON.stringify({ eventId, price }),
    }),

  toggleFavorite: (eventId) =>
    fetchAPI('/events/favorite', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    }),

  // Admin only
  create: (eventData) =>
    fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  update: (id, updates) =>
    fetchAPI(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

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
