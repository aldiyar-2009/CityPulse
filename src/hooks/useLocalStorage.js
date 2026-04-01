import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  // Инициализируем стейт: читаем из localStorage или берём initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // В редких случаях localStorage может быть недоступен
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
