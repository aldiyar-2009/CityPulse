// ============================================================
// useDebounce.js — задержка обновления значения
//
// Нужен для поиска: чтобы не фильтровать массив при каждом
// нажатии клавиши, а подождать паузу (300мс по умолчанию).
//
// Пример:
//   const debouncedSearch = useDebounce(searchQuery, 300)
//   useEffect(() => { /* фильтрация */ }, [debouncedSearch])
// ============================================================

import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Устанавливаем таймер
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Если value изменилось снова — сбрасываем предыдущий таймер
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
