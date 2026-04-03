import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/PremiumCategoryParams.module.css';
import { moviesAPI } from '../../services/api';

const MoviesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moviesAPI.getAll()
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Киноафиша</h1>
        {loading ? <p>Загрузка...</p> : (
          <div className={styles.grid}>
            {items.map(item => (
              <div key={item._id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={item.poster} alt={item.title} />
                  <div className={styles.overlay}></div>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.infoRow}>
                    <span>{item.date} • {item.time}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>{item.location}</span>
                    <span className={styles.price}>{item.price} ₸</span>
                  </div>
                  <Link to={`/movies/${item._id}`} className={styles.actionBtn}>
                    Выбрать сеанс
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
