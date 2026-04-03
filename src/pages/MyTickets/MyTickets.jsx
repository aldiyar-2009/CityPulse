import { useEffect, useState } from 'react'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import { useMyTickets } from '../../context/MyTicketsContext'
import { moviesAPI, sportsAPI, concertsAPI, fairsAPI } from '../../services/api'
import { Link } from 'react-router-dom'
import styles from './MyTickets.module.css'

const apiByType = {
  Movie:   { api: moviesAPI,   route: 'movies'   },
  Sport:   { api: sportsAPI,   route: 'sports'   },
  Concert: { api: concertsAPI, route: 'concerts' },
  Fair:    { api: fairsAPI,    route: 'fairs'    },
}

const STATUS_LABELS = {
  paid:      { text: 'Оплачен',         color: '#16a34a', bg: '#dcfce7' },
  pending:   { text: 'Ожидает оплаты',  color: '#d97706', bg: '#fef9c3' },
  cancelled: { text: 'Отменён',         color: '#dc2626', bg: '#fee2e2' },
}

function MyTickets() {
  const { tickets } = useMyTickets()
  const [allEvents, setAllEvents] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [movies, sports, concerts, fairs] = await Promise.all([
          moviesAPI.getAll().then(r => r.map(e => ({ ...e, route: 'movies', category: 'Кино'      }))),
          sportsAPI.getAll().then(r => r.map(e => ({ ...e, route: 'sports', category: 'Спорт'     }))),
          concertsAPI.getAll().then(r => r.map(e => ({ ...e, route: 'concerts', category: 'Концерты' }))),
          fairsAPI.getAll().then(r => r.map(e => ({ ...e, route: 'fairs', category: 'Ярмарки'    }))),
        ])
        const map = {}
        ;[...movies, ...sports, ...concerts, ...fairs].forEach(e => { map[e._id] = e })
        setAllEvents(map)
      } catch(err) {
        console.error('Ошибка загрузки событий:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const ticketsWithDetails = tickets
    .map(ticket => ({ ...ticket, event: allEvents[ticket.itemId] }))
    .filter(t => t.event)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ProfileTabs />

        <div className={styles.content}>
          <h1 className={styles.title}>Мои билеты</h1>

          {loading ? (
            <p style={{ color: '#888' }}>Загружаем данные...</p>
          ) : ticketsWithDetails.length > 0 ? (
            <div className={styles.grid}>
              {ticketsWithDetails.map((ticket, idx) => {
                const { event, status, price, purchaseDate, itemType } = ticket
                const sl = STATUS_LABELS[status] || STATUS_LABELS.pending
                const route = apiByType[itemType]?.route || 'movies'
                return (
                  <div key={ticket._id || idx} className={styles.ticketCard}>
                    {event.poster && (
                      <img src={event.poster} alt={event.title} className={styles.poster} />
                    )}
                    <div className={styles.info}>
                      <div className={styles.categoryBadge}>{event.category}</div>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <p className={styles.date}>{event.date} · {event.location}</p>
                      <p className={styles.priceRow}>Цена: <b>{price} ₸</b></p>
                      {purchaseDate && (
                        <p className={styles.purchaseDate}>
                          Куплен: {new Date(purchaseDate).toLocaleDateString('ru-RU')}
                        </p>
                      )}
                      <span className={styles.statusBadge} style={{ color: sl.color, background: sl.bg }}>
                        {sl.text}
                      </span>
                      <Link to={`/${route}/${ticket.itemId}`} className={styles.detailsLink}>
                        Открыть →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>У вас пока нет купленных билетов.</p>
              <Link to="/" className={styles.browseLink}>Посмотреть события</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyTickets
