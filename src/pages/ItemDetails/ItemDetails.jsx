import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { moviesAPI, sportsAPI, concertsAPI, fairsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useMyTickets } from '../../context/MyTicketsContext';
import SeatSelection from '../../components/SeatSelection/SeatSelection';
import ReceiptModal from '../../components/ReceiptModal/ReceiptModal';
import styles from '../Event/Event.module.css';

const apiMap = {
  movies: moviesAPI,
  sports: sportsAPI,
  concerts: concertsAPI,
  fairs: fairsAPI
};

const ItemDetails = () => {
  const { category, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [purchasedTicket, setPurchasedTicket] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addTicketLocally } = useMyTickets();
  
  const isMovie = category === 'movies';

  useEffect(() => {
    const api = apiMap[category];
    if (!api) {
      navigate('/404');
      return;
    }
    
    api.getById(id)
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching details', err);
        navigate('/404');
      });
  }, [category, id, navigate]);

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handlePurchase = async () => {
    if (!currentUser) {
      alert('Пожалуйста, войдите в систему');
      navigate('/login');
      return;
    }

    if (isMovie && selectedSeats.length === 0) {
      alert('Пожалуйста, выберите хотя бы одно место.');
      return;
    }
    
    try {
      setPurchasing(true);
      const api = apiMap[category];
      
      const payload = isMovie ? { seats: selectedSeats } : undefined;
      const res = await api.purchase(id, item.price, payload); // ensure api.purchase handles payload
      
      if (res.ticket) addTicketLocally(res.ticket);
      setPurchasedTicket(res.ticket);
      setShowReceipt(true);
      setShowSeatSelection(false);
    } catch(err) {
      alert(err.message || 'Ошибка при покупке');
    } finally {
      setPurchasing(false);
    }
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    navigate('/my-tickets');
  };

  if (loading) return <div className={styles.container}><h3>Загрузка...</h3></div>;
  if (!item) return null;

  return (
    <div className={styles.page}>
      <div 
        className={styles.backdrop} 
        style={{ backgroundImage: `url(${item.backdrop || item.poster})` }}
      />
      
      {showReceipt && (
        <ReceiptModal item={item} ticket={purchasedTicket} onClose={closeReceipt} />
      )}

      <div className={styles.container}>
        <div className={styles.header}>
          <img src={item.poster} alt={item.title} className={styles.poster} />
          
          <div className={styles.mainInfo}>
            <div className={styles.badges}>
              <span className={styles.badgeCategory}>{category.toUpperCase()}</span>
              {item.age > 0 && <span className={styles.badgeAge}>{item.age}+</span>}
              <span className={styles.badgeRating}>★ {item.rating}</span>
            </div>
            
            <h1 className={styles.title}>{item.title}</h1>
            
            <div className={styles.dateTime}>
              <span className={styles.date}>{item.date}</span>
              <span className={styles.time}>{item.time}</span>
            </div>

            <div className={styles.location}>{item.location}</div>

            <div className={styles.uniqueFields} style={{marginTop: '1rem', color: '#666'}}>
              {item.director && <p>Режиссер: <b>{item.director}</b></p>}
              {item.cast && item.cast.length > 0 && <p>В ролях: <b>{item.cast.join(', ')}</b></p>}
              {item.duration && <p>Длительность: <b>{item.duration} мин</b></p>}
              {item.sportType && <p>Вид Спорта: <b>{item.sportType} ({item.league})</b></p>}
              {item.teams && item.teams.length > 0 && <p>Команды: <b>{item.teams.join(' VS ')}</b></p>}
              {item.artist && <p>Артист: <b>{item.artist} ({item.genre})</b></p>}
              {item.theme && <p>Тематика: <b>{item.theme}</b></p>}
            </div>
          </div>
          
          <div className={styles.buyCard}>
            <div className={styles.priceSection}>
              <span className={styles.priceLabel}>Стоимость:</span>
              <span className={styles.priceValue}>{item.price} ₸</span>
            </div>
            
            {isMovie && !showSeatSelection ? (
               <button 
                className={styles.buyBtn} 
                onClick={() => setShowSeatSelection(true)}
                disabled={item.ticketsAvailable <= 0}
               >
                 Выбрать места
               </button>
            ) : (
                <>
                  {isMovie && showSeatSelection && selectedSeats.length > 0 && (
                    <div style={{marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold'}}>
                      Итого: {item.price * selectedSeats.length} ₸
                    </div>
                  )}
                  <button 
                    className={styles.buyBtn} 
                    onClick={handlePurchase}
                    disabled={purchasing || item.ticketsAvailable <= 0 || (isMovie && selectedSeats.length === 0)}
                  >
                    {purchasing ? 'Покупка...' : (item.ticketsAvailable > 0 ? (isMovie ? 'Оплатить' : 'Купить билет') : 'Билетов нет')}
                  </button>
                  {isMovie && showSeatSelection && (
                     <button className={styles.buyBtn} style={{background: '#333', marginTop: '0.5rem'}} onClick={() => setShowSeatSelection(false)}>
                       Назад
                     </button>
                  )}
                </>
            )}
            <div className={styles.ticketsLeft}>Осталось билетов: {item.ticketsAvailable}</div>
          </div>
        </div>

        {isMovie && showSeatSelection && (
          <section className={styles.section} style={{background: '#111', padding: '2rem', borderRadius: '12px'}}>
            <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Выберите места</h2>
            <SeatSelection 
              bookedSeats={item.bookedSeats || []} 
              selectedSeats={selectedSeats}
              onToggleSeat={toggleSeat}
            />
          </section>
        )}

        <section className={styles.section}>
          <h2>Описание</h2>
          <p className={styles.description}>{item.description}</p>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
