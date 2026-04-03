import React from 'react';
import styles from './ReceiptModal.module.css';

const ReceiptModal = ({ item, ticket, onClose }) => {
  if (!ticket || !item) return null;

  const dateStr = new Date(ticket.purchaseDate).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.receipt}>
        <div className={styles.header}>
          <h2>Электронный Билет</h2>
          <div className={styles.logo}>CityPulse Booking</div>
          <div className={styles.zigzag}></div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.row}>
            <span className={styles.label}>Событие</span>
            <span className={styles.value}>{item.title}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Локация</span>
            <span className={styles.value}>{item.location}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Дата и время</span>
            <span className={styles.value}>{item.date} {item.time}</span>
          </div>
          
          <div className={styles.divider}></div>

          <div className={styles.row}>
            <span className={styles.label}>ID Транзакции</span>
            <span className={styles.value} style={{fontSize: '0.8rem'}}>{ticket._id}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Дата покупки</span>
            <span className={styles.value}>{dateStr}</span>
          </div>
          {ticket.seats && ticket.seats.length > 0 && (
            <div className={styles.row}>
              <span className={styles.label}>Места (Ряд-Место)</span>
              <span className={styles.value}>{ticket.seats.join(', ')}</span>
            </div>
          )}
          <div className={styles.row}>
            <span className={styles.label}>Количество</span>
            <span className={styles.value}>{ticket.quantity || 1} шт</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalRow}>
            <span>Итог</span>
            <span>{ticket.price} ₸</span>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.btn} onClick={onClose}>Закрыть и перейти к билетам</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
