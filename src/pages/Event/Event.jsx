import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { eventsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useBalance } from '../../context/BalanceContext'
import { useMyTickets } from '../../context/MyTicketsContext'
import { useComments } from '../../context/CommentsContext'
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import Toast from '../../components/Toast/Toast'
import styles from './Event.module.css'

function Event() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { balance, purchaseTicket } = useBalance()
  const { addTicket } = useMyTickets()
  const { getComments, addComment } = useComments()

  const [event, setEvent] = useState(null)
  const [similarEvents, setSimilarEvents] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buying, setBuying] = useState(false)

  const closeToast = () => setToast({ message: '', type: 'success' })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await eventsAPI.getById(id)
        setEvent(data)
        setComments(getComments(id))

        // Fetch similar events (don't let this block the main event)
        try {
          const allEvents = await eventsAPI.getAll()
          const similar = allEvents
            .filter(e => e.category === data.category && e.id !== data.id)
            .slice(0, 3)
          setSimilarEvents(similar)
        } catch {
          // Similar events are optional — silently ignore errors
        }
      } catch (err) {
        setError('Событие не найдено или произошла ошибка сервера.')
        console.error('Ошибка загрузки события:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleBuyTicket = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    const price = parseFloat(event.price?.replace(/\D/g, '') || '0')

    if (balance < price) {
      setToast({ message: 'Недостаточно средств на балансе', type: 'error' })
      return
    }

    try {
      setBuying(true)
      const success = purchaseTicket(price)
      if (success) {
        addTicket(event.id, 'paid')
        setToast({ message: 'Билет успешно куплен! Переход в «Мои билеты»...', type: 'success' })
        setTimeout(() => navigate('/my-tickets'), 2500)
      }
    } catch (err) {
      setToast({ message: 'Ошибка при покупке билета: ' + err.message, type: 'error' })
    } finally {
      setBuying(false)
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()

    if (!currentUser) {
      navigate('/login')
      return
    }

    if (!newComment.trim()) {
      setToast({ message: 'Комментарий не может быть пустым', type: 'error' })
      return
    }

    try {
      addComment(id, {
        text: newComment.trim(),
        username: currentUser.name || currentUser.username,
        userEmail: currentUser.email,
      })
      setComments(getComments(id))
      setNewComment('')
    } catch (err) {
      setToast({ message: 'Не удалось добавить комментарий', type: 'error' })
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatCommentDate = (isoStr) => {
    const date = new Date(isoStr)
    return (
      date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) +
      ' в ' +
      date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    )
  }

  if (loading) return <LoadingSpinner text="Загружаем событие..." />

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>{error}</p>
        <Link to="/catalog" className={styles.backLink}>← Вернуться в каталог</Link>
      </div>
    )
  }

  if (!event) return null

  return (
    <div className={styles.event}>
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      <div className={styles.container}>
        <Link to="/catalog" className={styles.backBtn}>← Назад к событиям</Link>

        <div className={styles.main}>
          <div className={styles.left}>
            <img src={event.poster} alt={event.title} className={styles.mainImage} loading="lazy" />
            {event.backdrop && (
              <img src={event.backdrop} alt={`${event.title} — баннер`} className={styles.secondImage} loading="lazy" />
            )}
          </div>

          <div className={styles.right}>
            <div className={styles.header}>
              <h1 className={styles.title}>{event.title}</h1>
              <div className={styles.meta}>
                <span className={styles.category}>{event.category}</span>
                <span className={styles.rating}>★ {event.rating}</span>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>📅</div>
                <div>
                  <div className={styles.infoLabel}>Дата</div>
                  <div className={styles.infoValue}>{formatDate(event.date)}</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>🕐</div>
                <div>
                  <div className={styles.infoLabel}>Время</div>
                  <div className={styles.infoValue}>{event.time}</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>📍</div>
                <div>
                  <div className={styles.infoLabel}>Место</div>
                  <div className={styles.infoValue}>{event.location}</div>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>💰</div>
                <div>
                  <div className={styles.infoLabel}>Цена</div>
                  <div className={styles.infoValue}>{event.price}</div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                onClick={handleBuyTicket}
                className={styles.buyBtn}
                disabled={buying}
                aria-label="Купить билет"
              >
                {buying ? 'Обработка...' : 'Купить билет'}
              </button>
              <FavoriteButton eventId={event.id} />
            </div>

            {currentUser && (
              <div className={styles.balanceInfo}>
                Баланс: <strong>{balance.toLocaleString()} ₸</strong>
              </div>
            )}

            <div className={styles.description}>
              <h2>О событии</h2>
              <p>{event.description}</p>
            </div>
          </div>
        </div>

        {/* Comments */}
        <section className={styles.comments} aria-label="Комментарии">
          <h2>Комментарии ({comments.length})</h2>

          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={currentUser ? 'Напишите комментарий...' : 'Войдите, чтобы оставить комментарий'}
              className={styles.commentInput}
              rows="3"
              maxLength={500}
              aria-label="Текст комментария"
            />
            <div className={styles.commentFormFooter}>
              <span className={styles.charCount}>{newComment.length}/500</span>
              <button type="submit" className={styles.commentBtn} disabled={!newComment.trim()}>
                Отправить
              </button>
            </div>
          </form>

          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <p className={styles.noComments}>Пока нет комментариев. Будьте первым!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{comment.username}</span>
                    <span className={styles.commentDate}>{formatCommentDate(comment.createdAt)}</span>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Similar events */}
        {similarEvents.length > 0 && (
          <section className={styles.similar} aria-label="Похожие события">
            <h2 className={styles.similarTitle}>Похожие события</h2>
            <div className={styles.similarGrid}>
              {similarEvents.map(e => (
                <Link key={e.id} to={`/event/${e.id}`} className={styles.similarCard}>
                  <img src={e.poster} alt={e.title} className={styles.similarImage} loading="lazy" />
                  <div className={styles.similarInfo}>
                    <h3 className={styles.similarName}>{e.title}</h3>
                    <p className={styles.similarMeta}>{formatDate(e.date)} • {e.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Event
