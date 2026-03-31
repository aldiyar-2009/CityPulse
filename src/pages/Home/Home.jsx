import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { eventsAPI } from '../../services/api'
import EventCard from '../../components/EventCard/EventCard'
import styles from './Home.module.css'

const CATEGORIES = ['Концерты', 'Спорт', 'Кино', 'Выставки', 'Театр', 'Фестивали']

function Home() {
  const [events, setEvents] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    eventsAPI.getAll().then(setEvents).catch(console.error)
  }, [])

  const featuredEvents = events.filter(e => e.featured)

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

  const getEventsByCategory = (category) => {
    return events.filter(e => e.category === category).slice(0, 4)
  }

  return (
    <div className={styles.home}>
      {currentEvent && (
        <section className={styles.hero}>
          <div 
            className={styles.heroImage}
            style={{ backgroundImage: `url(${currentEvent.backdrop})` }}
          >
            <div className={styles.heroOverlay} />
            
            <div className={styles.heroContent}>
              <span className={styles.heroCategory}>{currentEvent.category}</span>
              <h1 className={styles.heroTitle}>{currentEvent.title}</h1>
              <div className={styles.heroMeta}>
                <span>{formatDate(currentEvent.date)}</span>
                <span>•</span>
                <span>{currentEvent.time}</span>
                <span>•</span>
                <span>★ {currentEvent.rating}</span>
              </div>
              <p className={styles.heroDescription}>
                {currentEvent.description?.slice(0, 150)}...
              </p>
              <Link to={`/event/${currentEvent.id}`} className={styles.heroBtn}>
                Подробнее
              </Link>
            </div>

            {featuredEvents.length > 1 && (
              <>
                <button className={styles.prevBtn} onClick={handlePrevSlide}>‹</button>
                <button className={styles.nextBtn} onClick={handleNextSlide}>›</button>
                
                <div className={styles.dots}>
                  {featuredEvents.map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.dot} ${i === currentSlide ? styles.active : ''}`}
                      onClick={() => setCurrentSlide(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <div className={styles.container}>
        {CATEGORIES.map(category => {
          const categoryEvents = getEventsByCategory(category)
          if (categoryEvents.length === 0) return null

          return (
            <section key={category} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{category}</h2>
                <Link to={`/catalog?category=${category}`} className={styles.seeAll}>
                  Смотреть все →
                </Link>
              </div>
              
              <div className={styles.grid}>
                {categoryEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default Home
