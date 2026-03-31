import { useEffect, useState } from 'react'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import { useMyTickets } from '../../context/MyTicketsContext'
import { eventsAPI } from '../../services/api'
import { NavLink } from 'react-router-dom'
import styles from './MyTickets.module.css'

function MyTickets() {
  const { tickets, updateTicketStatus, removeTicket, addTicket } = useMyTickets()
  const [allEvents, setAllEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')

  useEffect(() => {
    eventsAPI.getAll().then(setAllEvents).catch(console.error)
  }, [])

  const ticketsWithEvents = tickets.map(ticket => ({
    ...ticket,
    event: allEvents.find(e => e.id === ticket.eventId)
  })).filter(t => t.event)

  const handleAddTicket = () => {
    if (!selectedEvent) return
    addTicket(selectedEvent, 'pending')
    setSelectedEvent('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.tabs}>
          <NavLink to="/profile" className={styles.tab}>Профиль</NavLink>
          <NavLink to="/account-settings" className={styles.tab}>Настройки</NavLink>
          <NavLink to="/my-tickets" end className={`${styles.tab} ${styles.active}`}>Мои билеты</NavLink>
          <NavLink to="/favorites" className={styles.tab}>Избранное</NavLink>
        </nav>

        <div className={styles.content}>
          <h1 className={styles.title}>Мои билеты</h1>

          <div className={styles.addSection}>
            <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className={styles.select}>
              <option value="">Выберите событие</option>
              {allEvents.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <button onClick={handleAddTicket} disabled={!selectedEvent} className={styles.addBtn}>
              Добавить билет
            </button>
          </div>

          {ticketsWithEvents.length > 0 ? (
            <div className={styles.grid}>
              {ticketsWithEvents.map(({ id, event, status }) => (
                <div key={id} className={styles.ticketCard}>
                  <img src={event.poster} alt={event.title} className={styles.poster} />
                  <div className={styles.info}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.date}>{event.date}</p>
                    <select
                      value={status}
                      onChange={(e) => updateTicketStatus(id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="pending">Ожидает оплаты</option>
                      <option value="paid">Оплачен</option>
                      <option value="cancelled">Отменён</option>
                    </select>
                    <button onClick={() => removeTicket(id)} className={styles.removeBtn}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>У вас пока нет билетов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyTickets
