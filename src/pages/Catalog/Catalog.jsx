import { useEffect, useState } from 'react'
import { fetchEvents } from '../../data/events'
import { CATEGORIES } from '../../data/events'
import EventCard from '../../components/EventCard/EventCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter'
import { useDebounce } from '../../hooks/useDebounce'
import styles from './Catalog.module.css'

function Catalog() {
  const [events, setEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Все')
  
  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    fetchEvents().then(setEvents)
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(debouncedQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Все' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={styles.catalog}>
      <div className={styles.header}>
        <h1 className={styles.title}>Все события</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <CategoryFilter
        categories={CATEGORIES}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {filteredEvents.length > 0 ? (
        <div className={styles.grid}>
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>Ничего не найдено</p>
        </div>
      )}
    </div>
  )
}

export default Catalog
