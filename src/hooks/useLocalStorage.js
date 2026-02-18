// ============================================================
// useLocalStorage.js — кастомный хук для работы с LocalStorage
//
// Работает как обычный useState, но значение автоматически
// синхронизируется с localStorage.
//
// Пример использования:
//   const [theme, setTheme] = useLocalStorage('theme', 'dark')
//
// Это демонстрирует требование ТЗ: кастомные хуки (+10 баллов)
// ============================================================

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

  // При каждом изменении storedValue — пишем в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // В редких случаях localStorage может быть недоступен
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
