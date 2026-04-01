import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

const UserEventsContext = createContext(null)

const getUserEventsKey = (userId) => {
  return userId ? `citypulse_user_events_${userId}` : null
}

const getInitialUserEvents = (userId) => {
  if (!userId) return []
  
  try {
    const key = getUserEventsKey(userId)
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function UserEventsProvider({ children }) {
  const { currentUser } = useAuth()
  
  const [userEvents, setUserEvents] = useState(() => 
    getInitialUserEvents(currentUser?.id)
  )

  const saveUserEvents = (newEvents) => {
    if (currentUser?.id) {
      const key = getUserEventsKey(currentUser.id)
      localStorage.setItem(key, JSON.stringify(newEvents))
    }
  }

  const createEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `user_${Date.now()}`,
      userId: currentUser?.id,
      createdBy: currentUser?.username || 'Пользователь',
      createdAt: new Date().toISOString(),
      isUserCreated: true,
    }

    setUserEvents(prev => {
      const newEvents = [...prev, newEvent]
      saveUserEvents(newEvents)
      return newEvents
    })

    return newEvent
  }

  const updateEvent = (eventId, updates) => {
    setUserEvents(prev => {
      const newEvents = prev.map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      )
      saveUserEvents(newEvents)
      return newEvents
    })
  }

  const deleteEvent = (eventId) => {
    setUserEvents(prev => {
      const newEvents = prev.filter(e => e.id !== eventId)
      saveUserEvents(newEvents)
      return newEvents
    })
  }

  const value = {
    userEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  }

  return (
    <UserEventsContext.Provider value={value}>
      {children}
    </UserEventsContext.Provider>
  )
}

export function useUserEvents() {
  const context = useContext(UserEventsContext)
  if (!context) {
    throw new Error('useUserEvents must be used within UserEventsProvider')
  }
  return context
}
