import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { eventsAPI } from '../../services/api'
import styles from './Admin.module.css'

function Admin() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    category: 'Концерты',
    location: '',
    price: '',
    description: '',
    poster: '',
    rating: 4.5,
    featured: false,
    ticketsAvailable: 100
  })

  // Guard: only admins can access this page
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    } else if (currentUser.role !== 'admin') {
      navigate('/')
    }
  }, [currentUser, navigate])

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await eventsAPI.getAll()
      setEvents(data)
    } catch (err) {
      setMessage('Ошибка загрузки событий: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, formData)
        setMessage('Событие обновлено ✓')
      } else {
        await eventsAPI.create(formData)
        setMessage('Событие создано ✓')
      }
      await loadEvents()
      resetForm()
    } catch (err) {
      setMessage('Ошибка: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      category: event.category,
      location: event.location,
      price: event.price,
      description: event.description,
      poster: event.poster || '',
      rating: event.rating || 4.5,
      featured: event.featured || false,
      ticketsAvailable: event.ticketsAvailable || 100
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить событие?')) return
    try {
      await eventsAPI.delete(id)
      setMessage('Событие удалено ✓')
      await loadEvents()
    } catch (err) {
      setMessage('Ошибка удаления: ' + err.message)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingEvent(null)
    setFormData({
      title: '',
      date: '',
      time: '',
      category: 'Концерты',
      location: '',
      price: '',
      description: '',
      poster: '',
      rating: 4.5,
      featured: false,
      ticketsAvailable: 100
    })
  }

  if (!currentUser || currentUser.role !== 'admin') return null

  return (
    <div className={styles.admin}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Админ-панель</h1>
          <button 
            className={styles.addBtn}
            onClick={() => { resetForm(); setShowForm(!showForm) }}
          >
            {showForm ? 'Отмена' : '+ Добавить событие'}
          </button>
        </div>

        {message && (
          <div className={`${styles.message} ${message.startsWith('Ошибка') ? styles.error : styles.success}`}>
            {message}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3>{editingEvent ? 'Редактировать событие' : 'Новое событие'}</h3>
            
            <input
              type="text"
              placeholder="Название"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={styles.input}
              required
            />

            <div className={styles.row}>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className={styles.input}
                required
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className={styles.input}
                required
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
              className={styles.input}
              required
            />

            <input
              type="text"
              placeholder="Цена (например: от 1000 ₸)"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className={styles.input}
              required
            />

            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={styles.textarea}
              rows="4"
              required
            />

            <input
              type="url"
              placeholder="URL постера"
              value={formData.poster}
              onChange={(e) => setFormData({...formData, poster: e.target.value})}
              className={styles.input}
            />

            <div className={styles.row}>
              <input
                type="number"
                placeholder="Рейтинг (0-5)"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                className={styles.input}
                min="0" max="5" step="0.1"
              />
              <input
                type="number"
                placeholder="Кол-во билетов"
                value={formData.ticketsAvailable}
                onChange={(e) => setFormData({...formData, ticketsAvailable: parseInt(e.target.value)})}
                className={styles.input}
                min="0"
              />
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              />
              Показывать на главной (featured)
            </label>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Сохранение...' : (editingEvent ? 'Сохранить' : 'Создать')}
            </button>
          </form>
        )}

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{events.length}</div>
            <div className={styles.statLabel}>Всего событий</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{events.filter(e => e.featured).length}</div>
            <div className={styles.statLabel}>На главной</div>
          </div>
        </div>

        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Дата</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Билеты</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.category}</td>
                  <td>{event.price}</td>
                  <td>{event.ticketsAvailable}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(event)}
                      className={styles.editBtn}
                    >
                      Изменить
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className={styles.deleteBtn}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Admin
