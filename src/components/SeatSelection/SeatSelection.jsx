import React from 'react';
import styles from './SeatSelection.module.css';

const SeatSelection = ({ bookedSeats = [], selectedSeats = [], onToggleSeat }) => {
  const rows = 8;
  const cols = 14;

  const renderSeats = () => {
    const seatRows = [];
    for (let r = 1; r <= rows; r++) {
      const rowSeats = [];
      for (let c = 1; c <= cols; c++) {
        const seatId = `${r}-${c}`;
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);

        let seatClass = styles.seat;
        if (isBooked) seatClass += ` ${styles.booked}`;
        else if (isSelected) seatClass += ` ${styles.selected}`;

        rowSeats.push(
          <div
            key={seatId}
            className={seatClass}
            onClick={() => !isBooked && onToggleSeat(seatId)}
            title={`Ряд ${r}, Место ${c}`}
          >
            {isSelected ? c : ''}
          </div>
        );

        // Add aisle
        if (c === cols / 2) {
          rowSeats.push(<div key={`aisle-${r}`} className={styles.aisle} />);
        }
      }
      
      seatRows.push(
        <div key={`row-${r}`} className={styles.row}>
          <span className={styles.rowLabel}>Ряд {r}</span>
          {rowSeats}
          <span className={styles.rowLabel} style={{textAlign: 'left', marginLeft: '1rem', marginRight: 0}}>{r}</span>
        </div>
      );
    }
    return seatRows;
  };

  return (
    <div className={styles.container}>
      <div className={styles.screen}>
        <div className={styles.screenText}>ЭКРАН</div>
      </div>
      
      <div className={styles.seatsGrid}>
        {renderSeats()}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.available}`}></div>
          Вільне
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.selected}`}></div>
          Ваш вибір
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.booked}`}></div>
          Зайняте
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
