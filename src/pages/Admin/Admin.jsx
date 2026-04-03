import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { moviesAPI, sportsAPI, concertsAPI, fairsAPI } from '../../services/api'
import Toast from '../../components/Toast/Toast'
import styles from './Admin.module.css'

const TABS = [
  { key: 'movies',   label: 'Кино',      api: moviesAPI   },
  { key: 'sports',   label: 'Спорт',     api: sportsAPI   },
  { key: 'concerts', label: 'Концерты',  api: concertsAPI },
  { key: 'fairs',    label: 'Ярмарки',   api: fairsAPI    },
]

const BASE_FORM = {
  title: '',
  date: '',
  time: '',
  location: '',
  price: '',
  description: '',
  poster: '',
  rating: 4.5,
  featured: false,
  ticketsAvailable: 100,
}

const EXTRA_FIELDS = {
  movies:   ['director', 'cast', 'duration'],
  sports:   ['sportType', 'teams', 'league'],
  concerts: ['artist', 'genre'],
  fairs:    ['theme', 'exhibitors', 'activities'],
}

const EXTRA_LABELS = {
  director:   'Режиссёр',
  cast:       'Актёры (через запятую)',
  duration:   'Длительность (мин)',
  sportType:  'Вид спорта',
  teams:      'Команды (через запятую)',
  league:     'Лига / Турнир',
  artist:     'Исполнитель',
  genre:      'Жанр',
  theme:      'Тематика',
  exhibitors: 'Участники / Экспоненты',
  activities: 'Активности (через запятую)',
}

function buildFormData(tab) {
  const extra = {}
  EXTRA_FIELDS[tab]?.forEach(f => { extra[f] = '' })
  return { ...BASE_FORM, ...extra }
}

function Admin() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('movies')
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState(buildFormData('movies'))

  useEffect(() => {
    if (!currentUser) navigate('/login')
    else if (currentUser.role !== 'admin') navigate('/')
  }, [currentUser, navigate])

  useEffect(() => {
    loadEvents()
    resetForm()
  }, [activeTab])

  const currentAPI = TABS.find(t => t.key === activeTab)?.api || moviesAPI

  const loadEvents = async () => {
    try {
      const data = await currentAPI.getAll()
      setEvents(data)
    } catch (err) {
      setMessage('Ошибка загрузки: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Convert comma-separated strings to arrays for array fields
    const arrayFields = ['cast', 'teams', 'exhibitors', 'activities']
    const processed = { ...formData }
    arrayFields.forEach(f => {
      if (typeof processed[f] === 'string' && processed[f]) {
        processed[f] = processed[f].split(',').map(s => s.trim()).filter(Boolean)
      }
    })
    if (processed.price) processed.price = Number(processed.price)

    try {
      if (editingEvent) {
        await currentAPI.update(editingEvent._id, processed)
        setMessage('Событие обновлено ✓')
      } else {
        await currentAPI.create(processed)
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
    // Flatten arrays for editing
    const flat = { ...buildFormData(activeTab) }
    Object.keys(flat).forEach(k => {
      if (event[k] !== undefined) {
        flat[k] = Array.isArray(event[k]) ? event[k].join(', ') : event[k]
      }
    })
    setFormData(flat)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить событие?')) return
    try {
      await currentAPI.delete(id)
      setMessage('Событие удалено ✓')
      await loadEvents()
    } catch (err) {
      setMessage('Ошибка: ' + err.message)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingEvent(null)
    setFormData(buildFormData(activeTab))
  }

  const setField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }))

  if (!currentUser || currentUser.role !== 'admin') return null

  return (
    <div className={styles.admin}>
      <Toast message={message} type={message.includes('Ошибка') ? 'error' : 'success'} onClose={() => setMessage('')} />
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Админ-панель</h1>
          <button className={styles.addBtn} onClick={() => { resetForm(); setShowForm(!showForm) }}>
            {showForm ? 'Отмена' : '+ Добавить'}
          </button>
        </div>

        {/* Category Tabs */}
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3>{editingEvent ? 'Редактировать' : `Новое событие — ${TABS.find(t=>t.key===activeTab)?.label}`}</h3>

            <input type="text" placeholder="Название*" value={formData.title} onChange={e => setField('title', e.target.value)} className={styles.input} required />

            <div className={styles.row}>
              <input type="date" value={formData.date} onChange={e => setField('date', e.target.value)} className={styles.input} required />
              <input type="time" value={formData.time} onChange={e => setField('time', e.target.value)} className={styles.input} required />
            </div>

            <input type="text" placeholder="Локация*" value={formData.location} onChange={e => setField('location', e.target.value)} className={styles.input} required />

            <div className={styles.row}>
              <input type="number" placeholder="Цена (₸)*" value={formData.price} onChange={e => setField('price', e.target.value)} className={styles.input} required min="0" />
              <input type="number" placeholder="Билетов" value={formData.ticketsAvailable} onChange={e => setField('ticketsAvailable', parseInt(e.target.value))} className={styles.input} min="0" />
            </div>

            <textarea placeholder="Описание*" value={formData.description} onChange={e => setField('description', e.target.value)} className={styles.textarea} rows="4" required />

            <input type="url" placeholder="URL постера" value={formData.poster} onChange={e => setField('poster', e.target.value)} className={styles.input} />

            <div className={styles.row}>
              <input type="number" placeholder="Рейтинг (0-5)" value={formData.rating} onChange={e => setField('rating', parseFloat(e.target.value))} className={styles.input} min="0" max="5" step="0.1" />
            </div>

            {/* Category-specific fields */}
            {EXTRA_FIELDS[activeTab]?.length > 0 && (
              <div className={styles.extraSection}>
                <h4 className={styles.extraTitle}>Специфичные поля — {TABS.find(t=>t.key===activeTab)?.label}</h4>
                {EXTRA_FIELDS[activeTab].map(field => {
                  const isRequired = ['director', 'duration', 'sportType', 'teams', 'league', 'artist', 'genre', 'theme'].includes(field);
                  return (
                    <input
                      key={field}
                      type="text"
                      placeholder={(EXTRA_LABELS[field] || field) + (isRequired ? '*' : '')}
                      value={formData[field] || ''}
                      onChange={e => setField(field, e.target.value)}
                      className={styles.input}
                      required={isRequired}
                    />
                  );
                })}
              </div>
            )}

            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={formData.featured} onChange={e => setField('featured', e.target.checked)} />
              Показывать на главной (featured)
            </label>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Сохранение...' : (editingEvent ? 'Сохранить' : 'Создать')}
            </button>
          </form>
        )}

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{events.length}</div>
            <div className={styles.statLabel}>Всего записей</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{events.filter(e => e.featured).length}</div>
            <div className={styles.statLabel}>На главной</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{events.reduce((acc, e) => acc + (e.ticketsAvailable || 0), 0)}</div>
            <div className={styles.statLabel}>Билетов доступно</div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Постер</th>
                <th>Название</th>
                <th>Дата</th>
                <th>Цена</th>
                <th>Билеты</th>
                <th>Featured</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td>
                    {event.poster
                      ? <img src={event.poster} alt={event.title} style={{ width: 50, height: 70, objectFit: 'cover', borderRadius: 6 }} />
                      : <div style={{ width: 50, height: 70, background: '#eee', borderRadius: 6 }} />
                    }
                  </td>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.price} ₸</td>
                  <td>{event.ticketsAvailable}</td>
                  <td>{event.featured ? '✅' : '—'}</td>
                  <td>
                    <button onClick={() => handleEdit(event)} className={styles.editBtn}>Изменить</button>
                    <button onClick={() => handleDelete(event._id)} className={styles.deleteBtn}>Удалить</button>
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
