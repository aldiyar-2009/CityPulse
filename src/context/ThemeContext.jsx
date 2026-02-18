import { createContext, useContext, useState, useEffect } from 'react'

// ============================================================
// ThemeContext — тёмная/светлая тема
//
// Как работает:
//   1. Храним тему в localStorage под ключом 'timeline_theme'
//   2. При переключении добавляем/убираем класс 'light' на <html>
//   3. В index.css есть селектор html.light { ... } с другими переменными
//   4. Все компоненты автоматически меняют цвета через var(--bg) и т.д.
// ============================================================

const ThemeContext = createContext(null)

const THEME_KEY = 'timeline_theme'

export function ThemeProvider({ children }) {
  // Читаем сохранённую тему, иначе 'dark' по умолчанию
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || 'dark'
  )

  // При смене темы — обновляем класс на <html> и сохраняем в LocalStorage
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'light') {
      html.classList.add('light')
    } else {
      html.classList.remove('light')
    }
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
