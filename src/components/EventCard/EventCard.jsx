import { useNavigate } from 'react-router-dom'
import FavoriteButton from '../FavoriteButton/FavoriteButton'
import styles from './EventCard.module.css'

function EventCard({ event }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/event/${event.id}`)
  }

  // Format date to readable format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long' 
    })
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.posterWrap}>
        <img
          src={event.poster}
          alt={event.title}
          className={styles.poster}
          onError={(e) => { e.target.style.display = 'none' }}
        />

        <div className={styles.overlay}>
          <div className={styles.category}>{event.category}</div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteButton eventId={event.id} />
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.title}>{event.title}</div>
        <div className={styles.meta}>
          <span className={styles.date}>{formatDate(event.date)}</span>
          <span className={styles.rating}>★ {event.rating}</span>
        </div>
        <div className={styles.price}>{event.price}</div>
      </div>
    </div>
  )
}

export default EventCard
