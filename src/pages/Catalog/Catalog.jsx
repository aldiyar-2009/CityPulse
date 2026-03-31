import { useEffect, useState } from 'react'
import { eventsAPI } from '../../services/api'
import { useDebounce } from '../../hooks/useDebounce'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar'
import EventCard from '../../components/EventCard/EventCard'
import styles from './Catalog.module.css'

function Catalog() {
  const [events, setEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: 'Все',
    price: { min: '', max: '' }
  })

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    eventsAPI.getAll().then(setEvents).catch(console.error)
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(debouncedQuery.toLowerCase())

    const matchesCategory = 
      filters.category === 'Все' || event.category === filters.category

    let matchesPrice = true
    if (filters.price.min || filters.price.max) {
      const eventPrice = parseInt(event.price?.replace(/\D/g, '') || '0')
      const minPrice = parseInt(filters.price.min || '0')
      const maxPrice = parseInt(filters.price.max || '999999')
      matchesPrice = eventPrice >= minPrice && eventPrice <= maxPrice
    }

    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className={styles.catalog}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Все события</h1>
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск..."
          />
        </div>

        <div className={styles.content}>
          <FilterSidebar 
            filters={filters}
            onFiltersChange={setFilters}
          />

          <div className={styles.results}>
            <div className={styles.resultsInfo}>
              Найдено: {filteredEvents.length}
            </div>

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
        </div>
      </div>
    </div>
  )
}

export default Catalog
