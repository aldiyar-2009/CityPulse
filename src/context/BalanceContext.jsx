import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { usersAPI } from '../services/api';

const BalanceContext = createContext(null);

export function BalanceProvider({ children }) {
  const { currentUser, updateBalance: updateAuthBalance } = useAuth();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (currentUser) {
      setBalance(currentUser.balance || 0);
    } else {
      setBalance(0);
    }
  }, [currentUser]);

  const addBalance = async (amount) => {
    try {
      const data = await usersAPI.addBalance(amount);
      const newBalance = data.balance;
      setBalance(newBalance);
      updateAuthBalance(newBalance);
      return newBalance;
    } catch (error) {
      throw new Error(error.message || 'Ошибка пополнения баланса');
    }
  };

  const purchaseTicket = (price) => {
    const ticketPrice = parseFloat(price);
    if (balance >= ticketPrice) {
      const newBalance = balance - ticketPrice;
      setBalance(newBalance);
      updateAuthBalance(newBalance);
      return true;
    }
    return false;
  };

  const value = {
    balance,
    addBalance,
    purchaseTicket,
  };

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within BalanceProvider');
  }
  return context;
}
