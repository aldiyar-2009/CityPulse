import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, usersAPI, setToken, removeToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await usersAPI.getProfile();
          setCurrentUser(user);
        } catch (error) {
          console.error('Ошибка получения профиля:', error);
          removeToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (username, email, password, city = '', phone = '', adminSecretKey = '') => {
    try {
      const data = await authAPI.register({
        name: username,
        email,
        password,
        city,
        phone,
        adminSecretKey: adminSecretKey || undefined,
      });

      setToken(data.token);
      setCurrentUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        city: data.city,
        phone: data.phone,
        role: data.role,
        balance: data.balance || 0,
      });

      return data;
    } catch (error) {
      throw new Error(error.message || 'Ошибка регистрации');
    }
  };

  const login = async (email, password, adminSecretKey = '') => {
    try {
      const data = await authAPI.login({
        email,
        password,
        adminSecretKey: adminSecretKey || undefined,
      });

      setToken(data.token);
      setCurrentUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        city: data.city,
        phone: data.phone,
        role: data.role,
        balance: data.balance || 0,
      });

      return data;
    } catch (error) {
      throw new Error(error.message || 'Ошибка входа');
    }
  };

  const logout = () => {
    removeToken();
    setCurrentUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const data = await usersAPI.updateProfile(updates);
      setCurrentUser((prev) => ({
        ...prev,
        ...data,
      }));
      return data;
    } catch (error) {
      throw new Error(error.message || 'Ошибка обновления профиля');
    }
  };

  const updateBalance = (newBalance) => {
    setCurrentUser((prev) => ({
      ...prev,
      balance: newBalance,
    }));
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateProfile,
    updateBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
