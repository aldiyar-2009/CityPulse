import { useState } from 'react'
import { useUserEvents } from '../../context/UserEventsContext'
import EventCard from '../../components/EventCard/EventCard'
import { NavLink } from 'react-router-dom'
import styles from './UserEvents.module.css'

function UserEvents() {
  const { userEvents, createEvent, deleteEvent } = useUserEvents()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    category: 'Концерты',
    location: '',
    price: '',
    description: '',
    poster: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    rating: 4.5
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createEvent(formData)
    setFormData({
      title: '',
      date: '',
      time: '',
      category: 'Концерты',
      location: '',
      price: '',
      description: '',
      poster: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
      rating: 4.5
    })
    setShowForm(false)
  }

  return (
    <div className={styles.userEvents}>
      <div className={styles.container}>
        <nav className={styles.tabs}>
          <NavLink to="/profile" className={styles.tab}>Профиль</NavLink>
          <NavLink to="/account-settings" className={styles.tab}>Настройка профиля</NavLink>
          <NavLink to="/my-tickets" className={styles.tab}>Мои билеты</NavLink>
          <NavLink to="/favorites" className={styles.tab}>Избранное</NavLink>
          <NavLink to="/user-events" end className={`${styles.tab} ${styles.active}`}>Мои события</NavLink>
        </nav>

        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Мои события</h1>
            <button className={styles.createBtn} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Отмена' : '+ Создать событие'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                placeholder="Название события"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className={styles.input}
              />

              <div className={styles.row}>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  className={styles.input}
                />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                  className={styles.input}
                />
              </div>

              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={styles.input}
              >
                <option value="Концерты">Концерты</option>
                <option value="Спорт">Спорт</option>
                <option value="Кино">Кино</option>
                <option value="Выставки">Выставки</option>
                <option value="Театр">Театр</option>
                <option value="Фестивали">Фестивали</option>
              </select>

              <input
                type="text"
                placeholder="Локация"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                className={styles.input}
              />

              <input
                type="text"
                placeholder="Цена (например: от 1000 ₽)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                className={styles.input}
              />

              <textarea
                placeholder="Описание"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className={styles.textarea}
              />

              <button type="submit" className={styles.submitBtn}>
                Создать событие
              </button>
            </form>
          )}

          <div className={styles.grid}>
            {userEvents.map(event => (
              <div key={event.id} className={styles.eventItem}>
                <EventCard event={event} />
                <button
                  onClick={() => deleteEvent(event.id)}
                  className={styles.deleteBtn}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          {userEvents.length === 0 && !showForm && (
            <div className={styles.empty}>
              <p>Вы ещё не создали ни одного события</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserEvents
