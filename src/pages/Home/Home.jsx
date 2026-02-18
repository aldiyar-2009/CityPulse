import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchEvents } from '../../data/events'
import EventCard from '../../components/EventCard/EventCard'
import styles from './Home.module.css'

function Home() {
  const [events, setEvents] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents().then(setEvents)
  }, [])

  const featuredEvents = events.filter(e => e.featured)
  const otherEvents = events.filter(e => !e.featured).slice(0, 6)

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (featuredEvents.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredEvents.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [featuredEvents.length])

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredEvents.length) % featuredEvents.length)
  }

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredEvents.length)
  }

  const currentEvent = featuredEvents[currentSlide]

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className={styles.home}>
      {/* Hero Slider */}
      {currentEvent && (
        <section className={styles.hero}>
          <div 
            className={styles.heroBackdrop}
            style={{ backgroundImage: `url(${currentEvent.backdrop})` }}
          >
            <div className={styles.heroOverlay} />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroInfo}>
              <span className={styles.heroCategory}>{currentEvent.category}</span>
              <h1 className={styles.heroTitle}>{currentEvent.title}</h1>
              
              <div className={styles.heroMeta}>
                <span className={styles.heroMetaItem}>
                  📅 {formatDate(currentEvent.date)}
                </span>
                <span className={styles.heroMetaItem}>
                  🕐 {currentEvent.time}
                </span>
                <span className={styles.heroMetaItem}>
                  📍 {currentEvent.location}
                </span>
                <span className={styles.heroMetaItem}>
                  ⭐ {currentEvent.rating}
                </span>
              </div>

              <p className={styles.heroDescription}>
                {currentEvent.description.slice(0, 200)}...
              </p>

              <div className={styles.heroActions}>
                <button 
                  className={styles.heroBtn}
                  onClick={() => navigate(`/event/${currentEvent.id}`)}
                >
                  Подробнее
                </button>
                <span className={styles.heroPrice}>{currentEvent.price}</span>
              </div>
            </div>

            {/* Slider Controls */}
            <button className={styles.sliderPrev} onClick={handlePrevSlide} aria-label="Предыдущее">
              ←
            </button>
            <button className={styles.sliderNext} onClick={handleNextSlide} aria-label="Следующее">
              →
            </button>

            {/* Dots Indicator */}
            <div className={styles.sliderDots}>
              {featuredEvents.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Слайд ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Events */}
      {otherEvents.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Другие события</h2>
            <Link to="/catalog" className={styles.sectionLink}>
              Все события →
            </Link>
          </div>
          
          <div className={styles.grid}>
            {otherEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
