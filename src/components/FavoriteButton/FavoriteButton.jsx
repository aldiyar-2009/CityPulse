import { useFavorites } from '../../context/FavoritesContext'
import styles from './FavoriteButton.module.css'

function FavoriteButton({ eventId }) {
  const { favorites, toggleFavorite } = useFavorites()
  const isFavorited = favorites.includes(eventId)

  return (
    <button
      className={`${styles.btn} ${isFavorited ? styles.active : ''}`}
      onClick={() => toggleFavorite(eventId)}
      aria-label={isFavorited ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      {isFavorited ? '❤️' : '🤍'}
    </button>
  )
}

export default FavoriteButton
