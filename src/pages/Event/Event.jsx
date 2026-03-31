import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { eventsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useBalance } from '../../context/BalanceContext'
import { useMyTickets } from '../../context/MyTicketsContext'
import { useComments } from '../../context/CommentsContext'
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton'
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
  const [message, setMessage] = useState('')

  useEffect(() => {
    eventsAPI.getById(id).then(event => {
      setEvent(event)
      setComments(getComments(id))
      
      eventsAPI.getAll().then(allEvents => {
        const similar = allEvents
          .filter(e => e.category === event.category && e.id !== event.id)
          .slice(0, 3)
        setSimilarEvents(similar)
      })
    }).catch(console.error)
  }, [id])

  const handleBuyTicket = () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    const price = parseFloat(event.price?.replace(/\D/g, '') || '0')
    
    if (balance < price) {
      setMessage('❌ Недостаточно средств')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const success = purchaseTicket(price)
    if (success) {
      addTicket(event.id, 'paid')
      setMessage('✅ Билет куплен!')
      setTimeout(() => {
        setMessage('')
        navigate('/my-tickets')
      }, 2000)
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      navigate('/login')
      return
    }

    if (!newComment.trim()) return

    addComment(id, {
      text: newComment,
      username: currentUser.name || currentUser.username,
      userEmail: currentUser.email
    })

    setComments(getComments(id))
    setNewComment('')
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }

  const formatCommentDate = (isoStr) => {
    const date = new Date(isoStr)
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric',
      month: 'short'
    }) + ' в ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  if (!event) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  return (
    <div className={styles.event}>
      <div className={styles.container}>
        <Link to="/catalog" className={styles.backBtn}>← Назад к событиям</Link>
        
        <div className={styles.main}>
          <div className={styles.left}>
            <img src={event.poster} alt={event.title} className={styles.mainImage} />
            
            {event.backdrop && (
              <img src={event.backdrop} alt={event.title} className={styles.secondImage} />
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
              <button onClick={handleBuyTicket} className={styles.buyBtn}>
                Купить билет
              </button>
              <FavoriteButton eventId={event.id} />
            </div>

            {message && (
              <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
                {message}
              </div>
            )}

            {currentUser && (
              <div className={styles.balanceInfo}>
                Баланс: {balance.toLocaleString()} ₸
              </div>
            )}

            <div className={styles.description}>
              <h2>О событии</h2>
              <p>{event.description}</p>
            </div>
          </div>
        </div>

        <div className={styles.comments}>
          <h2>Комментарии ({comments.length})</h2>
          
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите комментарий..."
              className={styles.commentInput}
              rows="3"
            />
            <button type="submit" className={styles.commentBtn}>
              Отправить
            </button>
          </form>

          <div className={styles.commentsList}>
            {comments.map(comment => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{comment.username}</span>
                  <span className={styles.commentDate}>{formatCommentDate(comment.createdAt)}</span>
                </div>
                <p className={styles.commentText}>{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

        {similarEvents.length > 0 && (
          <div className={styles.similar}>
            <h2 className={styles.similarTitle}>Похожие события</h2>
            <div className={styles.similarGrid}>
              {similarEvents.map(e => (
                <Link key={e.id} to={`/event/${e.id}`} className={styles.similarCard}>
                  <img src={e.poster} alt={e.title} className={styles.similarImage} />
                  <div className={styles.similarInfo}>
                    <h3 className={styles.similarName}>{e.title}</h3>
                    <p className={styles.similarMeta}>{e.date} • {e.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Event
