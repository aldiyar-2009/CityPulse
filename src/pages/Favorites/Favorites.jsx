import { useEffect, useState } from 'react'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import { useFavorites } from '../../context/FavoritesContext'
import { eventsAPI } from '../../services/api'
import EventCard from '../../components/EventCard/EventCard'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import styles from './Favorites.module.css'

function Favorites() {
  const { favorites } = useFavorites()
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await eventsAPI.getAll()
        setAllEvents(data)
      } catch (err) {
        setError('Не удалось загрузить события.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const favoriteEvents = allEvents.filter(e => favorites.includes(e.id))

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ProfileTabs />

        <div className={styles.content}>
          <h1 className={styles.title}>Избранное</h1>

          {loading ? (
            <LoadingSpinner text="Загружаем избранное..." />
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : favoriteEvents.length > 0 ? (
            <div className={styles.grid}>
              {favoriteEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>В избранном пока ничего нет. Добавьте события, нажав ♥</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Favorites
