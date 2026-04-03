import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { moviesAPI, sportsAPI, concertsAPI, fairsAPI } from '../services/api';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (currentUser?.favorites) {
      setFavorites(currentUser.favorites);
    } else {
      setFavorites([]);
    }
  }, [currentUser]);

  const toggleFavorite = async (eventId, eventRoute) => {
    try {
      // Map route to the right api
      let apiToCall = moviesAPI;
      if (eventRoute === 'sports') apiToCall = sportsAPI;
      if (eventRoute === 'concerts') apiToCall = concertsAPI;
      if (eventRoute === 'fairs') apiToCall = fairsAPI;

      const data = await apiToCall.toggleFavorite(eventId);
      setFavorites(data.favorites);
      return data.favorites;
    } catch (error) {
      console.error('Ошибка обновления избранного:', error);
      throw error;
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    toggleFavorite,
    clearFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
