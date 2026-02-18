import { createContext, useContext, useState, useEffect } from 'react'

// ============================================================
// AuthContext — управление авторизацией
//
// Что хранит:
//   currentUser — объект пользователя { username, email } или null
//
// Что умеет:
//   register(username, email, password) — сохраняет пользователя в LocalStorage
//   login(email, password)             — проверяет данные из LocalStorage
//   logout()                           — очищает сессию
//
// Как хранится сессия:
//   При логине пишем в localStorage ключ 'timeline_session'
//   При старте приложения читаем его — восстанавливаем сессию (useEffect)
// ============================================================

const AuthContext = createContext(null)

// Ключи для LocalStorage
const USERS_KEY   = 'timeline_users'    // массив всех зарегистрированных пользователей
const SESSION_KEY = 'timeline_session'  // текущий залогиненный пользователь

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  // При монтировании — восстанавливаем сессию из LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY)
    if (saved) {
      setCurrentUser(JSON.parse(saved))
    }
  }, [])

  // --- РЕГИСТРАЦИЯ ---
  const register = (username, email, password) => {
    // Читаем существующих пользователей
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

    // Проверяем: email уже занят?
    const exists = users.find(u => u.email === email)
    if (exists) {
      throw new Error('Пользователь с таким email уже существует')
    }

    // Создаём нового пользователя
    // ⚠️ В реальном проекте пароль нужно хешировать — здесь упрощённо для учёбы
    const newUser = { username, email, password }
    users.push(newUser)

    // Сохраняем список пользователей
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    // Сразу логиним нового пользователя
    const session = { username, email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setCurrentUser(session)
  }

  // --- ВХОД ---
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

    // Ищем пользователя с совпадающим email + password
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Неверный email или пароль')
    }

    // Сохраняем сессию (без пароля!)
    const session = { username: user.username, email: user.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setCurrentUser(session)
  }

  // --- ВЫХОД ---
  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Хук для удобного доступа к контексту в любом компоненте:
// const { currentUser, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext)
