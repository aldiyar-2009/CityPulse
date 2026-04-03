import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { moviesAPI } from '../../services/api'
import { useDebounce } from '../../hooks/useDebounce'
import SearchBar from '../../components/SearchBar/SearchBar'
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar'
import EventCard from '../../components/EventCard/EventCard'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import styles from './Catalog.module.css'

function Catalog() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'Все'

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: initialCategory,
    price: { min: '', max: '' }
  })

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await moviesAPI.getAll()
        setEvents(data)
      } catch (err) {
        setError('Не удалось загрузить события.')
        console.error('Ошибка загрузки каталога:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
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
            placeholder="Поиск по названию или месту..."
          />
        </div>

        <div className={styles.content}>
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
          />

          <div className={styles.results}>
            {loading ? (
              <LoadingSpinner text="Загружаем каталог..." />
            ) : error ? (
              <div className={styles.errorState}>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Повторить</button>
              </div>
            ) : (
              <>
                <div className={styles.resultsInfo}>
                  Найдено: <strong>{filteredEvents.length}</strong>
                </div>
                {filteredEvents.length > 0 ? (
                  <div className={styles.grid}>
                    {filteredEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.empty}>
                    <p>По вашему запросу ничего не найдено. Попробуйте изменить фильтры.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Catalog
