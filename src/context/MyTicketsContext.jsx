import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MyTicketsContext = createContext(null);

export function MyTicketsProvider({ children }) {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (currentUser?.purchasedTickets) {
      setTickets(currentUser.purchasedTickets);
    } else {
      setTickets([]);
    }
  }, [currentUser]);

  const addTicket = (eventId, status = 'paid') => {
    const newTicket = {
      _id: Date.now().toString(),
      eventId,
      status,
      purchaseDate: new Date().toISOString(),
    };
    setTickets((prev) => [...prev, newTicket]);
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket))
    );
  };

  const removeTicket = (ticketId) => {
    setTickets((prev) => prev.filter((t) => t._id !== ticketId));
  };

  const value = {
    tickets,
    addTicket,
    updateTicketStatus,
    removeTicket,
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
