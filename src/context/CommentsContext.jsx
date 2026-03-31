import { createContext, useContext, useState } from 'react'

const CommentsContext = createContext(null)

const getCommentsKey = (eventId) => {
  return `citypulse_comments_${eventId}`
}

const getInitialComments = (eventId) => {
  try {
    const key = getCommentsKey(eventId)
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CommentsProvider({ children }) {
  const [commentsCache, setCommentsCache] = useState({})

  const getComments = (eventId) => {
    if (commentsCache[eventId]) {
      return commentsCache[eventId]
    }
    return getInitialComments(eventId)
  }

  const addComment = (eventId, comment) => {
    const newComment = {
      id: Date.now().toString(),
      ...comment,
      createdAt: new Date().toISOString()
    }

    const key = getCommentsKey(eventId)
    const currentComments = getInitialComments(eventId)
    const updatedComments = [newComment, ...currentComments]
    
    localStorage.setItem(key, JSON.stringify(updatedComments))
    setCommentsCache(prev => ({
      ...prev,
      [eventId]: updatedComments
    }))
  }

  const value = {
    getComments,
    addComment
  }

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  )
}

export function useComments() {
  const context = useContext(CommentsContext)
  if (!context) {
    throw new Error('useComments must be used within CommentsProvider')
  }
  return context
}
