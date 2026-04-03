import { useFavorites } from '../../context/FavoritesContext'
import styles from './FavoriteButton.module.css'

function FavoriteButton({ eventId, eventRoute }) {
  const { favorites, toggleFavorite } = useFavorites()
  const isFavorited = favorites.some(fav => fav.itemId === eventId)

  return (
    <button
      className={`${styles.btn} ${isFavorited ? styles.active : ''}`}
      onClick={(e) => { e.preventDefault(); toggleFavorite(eventId, eventRoute); }}
      aria-label={isFavorited ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      {isFavorited ? '❤️' : '🤍'}
    </button>
  )
}

export default FavoriteButton
