import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MyTicketsContext = createContext(null);

export function MyTicketsProvider({ children }) {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // purchasedTickets on the user is [{ itemId, itemType, price, status, purchaseDate }]
    if (currentUser?.purchasedTickets) {
      setTickets(currentUser.purchasedTickets);
    } else {
      setTickets([]);
    }
  }, [currentUser]);

  // Called after a successful purchase; merges new ticket into local state
  const addTicketLocally = (ticket) => {
    setTickets(prev => [...prev, ticket]);
  };

  const value = {
    tickets,
    addTicketLocally,
  };

  return <MyTicketsContext.Provider value={value}>{children}</MyTicketsContext.Provider>;
}

export function useMyTickets() {
  const context = useContext(MyTicketsContext);
  if (!context) {
    throw new Error('useMyTickets must be used within MyTicketsProvider');
  }
  return context;
}
