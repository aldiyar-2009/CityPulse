import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchEventById } from '../../data/events'
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton'
import styles from './Event.module.css'

function Event() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)

  useEffect(() => {
    fetchEventById(id).then(setEvent)
  }, [id])

  if (!event) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className={styles.event}>
      {/* Full-width backdrop with overlay text */}
      <div 
        className={styles.heroSection}
        style={{ backgroundImage: `url(${event.backdrop})` }}
      >
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroContent}>
          <Link to="/catalog" className={styles.backBtn}>
            ← Назад к событиям
          </Link>

          <div className={styles.heroInfo}>
            <div className={styles.categoryBadge}>{event.category}</div>
            <h1 className={styles.title}>{event.title}</h1>
            
            <div className={styles.metaBar}>
              <span className={styles.metaItem}>
                📅 {formatDate(event.date)}
              </span>
              <span className={styles.metaItem}>
                🕐 {event.time}
              </span>
              <span className={styles.metaItem}>
                ⭐ {event.rating}
              </span>
              {event.age > 0 && (
                <span className={styles.metaItem}>
                  {event.age}+
                </span>
              )}
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.priceLabel}>Цена билета</span>
              <span className={styles.priceValue}>{event.price}</span>
            </div>

            {event.ticketLink && (
              <a 
                href={event.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.buyBtn}
              >
                🎫 Купить билет
              </a>
            )}

            <div className={styles.favoriteWrap}>
              <FavoriteButton eventId={event.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.container}>
          
          {/* Description */}
          <div className={styles.descBlock}>
            <h2 className={styles.sectionTitle}>О мероприятии</h2>
            <p className={styles.description}>{event.description}</p>
          </div>

          {/* Two columns: Image gallery + Map */}
          <div className={styles.twoColumns}>
            
            {/* Left: Additional Image */}
            {event.image2 && (
              <div className={styles.imageGallery}>
                <h3 className={styles.sectionTitle}>Фотографии</h3>
                <div className={styles.galleryGrid}>
                  <img 
                    src={event.poster} 
                    alt={event.title} 
                    className={styles.galleryImage}
                  />
                  <img 
                    src={event.image2} 
                    alt={`${event.title} - фото 2`} 
                    className={styles.galleryImage}
                  />
                </div>
              </div>
            )}

            {/* Right: Map */}
            <div className={styles.mapBlock}>
              <h3 className={styles.sectionTitle}>Как добраться</h3>
              <p className={styles.location}>
                📍 {event.location}
              </p>
              
              {/* Map Placeholder - ready for Google Maps integration */}
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapOverlay}>
                  <p className={styles.mapCoords}>
                    Координаты:<br/>
                    {event.coordinates.lat}, {event.coordinates.lng}
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLink}
                  >
                    Открыть в Google Maps
                  </a>
                </div>
              </div>
              
              <p className={styles.mapHint}>
                💡 Здесь будет интерактивная карта после подключения Google Maps API
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Event
