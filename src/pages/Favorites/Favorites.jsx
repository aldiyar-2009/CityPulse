import { useEffect, useState } from 'react'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import { useFavorites } from '../../context/FavoritesContext'
import { eventsAPI } from '../../services/api'
import EventCard from '../../components/EventCard/EventCard'
import { NavLink } from 'react-router-dom'
import styles from './Favorites.module.css'

function Favorites() {
  const { favorites } = useFavorites()
  const [allEvents, setAllEvents] = useState([])

  useEffect(() => {
    eventsAPI.getAll().then(setAllEvents).catch(console.error)
  }, [])

  const favoriteEvents = allEvents.filter(e => favorites.includes(e.id))

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.tabs}>
          <NavLink to="/profile" className={styles.tab}>Профиль</NavLink>
          <NavLink to="/account-settings" className={styles.tab}>Настройки</NavLink>
          <NavLink to="/my-tickets" className={styles.tab}>Мои билеты</NavLink>
          <NavLink to="/favorites" end className={`${styles.tab} ${styles.active}`}>Избранное</NavLink>
        </nav>

        <div className={styles.content}>
          <h1 className={styles.title}>Избранное</h1>

          {favoriteEvents.length > 0 ? (
            <div className={styles.grid}>
              {favoriteEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>В избранном пока ничего нет</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Favorites
