import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

// ============================================================
// FavoritesContext — закладки/избранное
//
// Закладки привязаны к конкретному пользователю:
// ключ в LocalStorage = 'timeline_favorites_<email>'
// Это значит у каждого юзера свой список закладок.
//
// Что умеет:
//   favorites           — массив id фильмов в закладках
//   addBookmark(id)     — добавить фильм
//   removeBookmark(id)  — удалить фильм
//   isBookmarked(id)    — проверить, есть ли фильм в закладках
//   toggleBookmark(id)  — переключить (добавить/удалить)
// ============================================================

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { currentUser } = useAuth()
  const [favorites, setFavorites] = useState([])

  // Ключ зависит от email текущего юзера
  const storageKey = currentUser
    ? `timeline_favorites_${currentUser.email}`
    : null

  // Загружаем закладки при смене пользователя (или при логине/логауте)
  useEffect(() => {
    if (storageKey) {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
      setFavorites(saved)
    } else {
      // Если пользователь вышел — очищаем закладки в стейте
      setFavorites([])
    }
  }, [storageKey])

  // Сохраняем в LocalStorage при каждом изменении закладок
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(favorites))
    }
  }, [favorites, storageKey])

  const addBookmark = (movieId) => {
    setFavorites(prev => [...prev, movieId])
  }

  const removeBookmark = (movieId) => {
    setFavorites(prev => prev.filter(id => id !== movieId))
  }

  const isBookmarked = (movieId) => favorites.includes(movieId)

  // toggleBookmark — самый удобный метод для кнопки-иконки
  const toggleBookmark = (movieId) => {
    isBookmarked(movieId) ? removeBookmark(movieId) : addBookmark(movieId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addBookmark, removeBookmark, isBookmarked, toggleBookmark }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
