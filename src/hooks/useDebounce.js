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
