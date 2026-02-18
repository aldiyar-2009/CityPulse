// ============================================================
// Profile.jsx — Защищённая страница профиля
//
// Доступна только авторизованным (PrivateRoute в App.jsx).
// Показывает информацию о пользователе и его закладки.
// ============================================================

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'
import { fetchEvents } from '../../data/events'
import EventCard from '../../components/EventCard/EventCard'
import styles from './Profile.module.css'

function Profile() {
  const { currentUser, logout } = useAuth()
  const { favorites } = useFavorites()
  const [allEvents, setAllEvents] = useState([])

  // Загружаем все события чтобы найти события из избранного
  useEffect(() => {
    fetchEvents().then(setAllEvents)
  }, [])

  // Фильтруем только те события, которые в избранном
  const favoriteEvents = allEvents.filter((e) => favorites.includes(e.id))

  // Первые буквы имени для аватара
  const initials = currentUser?.username
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* ===== КАРТОЧКА ПОЛЬЗОВАТЕЛЯ ===== */}
        <aside className={styles.card}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.name}>{currentUser?.username}</div>
          <div className={styles.email}>{currentUser?.email}</div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>{favorites.length}</div>
              <div className={styles.statLbl}>Закладки</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>{allEvents.length}</div>
              <div className={styles.statLbl}>Доступно</div>
            </div>
          </div>

          <button className={styles.btnLogout} onClick={logout}>
            Выйти из аккаунта
          </button>
        </aside>

        {/* ===== ИЗБРАННОЕ ===== */}
        <div className={styles.main}>
          <h2 className={styles.sectionTitle}>
            Избранные события
            <span className={styles.count}>{favorites.length}</span>
          </h2>

          {favoriteEvents.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>❤️</div>
              <p>Вы ещё не добавили ни одного события в избранное.</p>
              <p className={styles.hint}>Нажмите на сердечко на любой карточке события.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {favoriteEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile
