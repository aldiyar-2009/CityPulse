import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.columns}>
          {/* Column 1: About */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>О CityPulse</h3>
            <p className={styles.description}>
              Ваш путеводитель по городским событиям. Находите концерты, спорт, 
              кино и выставки в одном месте.
            </p>
            <div className={styles.logo}>CityPulse</div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Навигация</h3>
            <ul className={styles.links}>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/catalog">События</Link></li>
              <li><Link to="/about">О нас</Link></li>
              <li><Link to="/profile">Профиль</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Категории</h3>
            <ul className={styles.links}>
              <li><Link to="/catalog?category=Концерты">Концерты</Link></li>
              <li><Link to="/catalog?category=Спорт">Спорт</Link></li>
              <li><Link to="/catalog?category=Кино">Кино</Link></li>
              <li><Link to="/catalog?category=Выставки">Выставки</Link></li>
              <li><Link to="/catalog?category=Фестивали">Фестивали</Link></li>
            </ul>
          </div>

          {/* Column 4: Contacts */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Контакты</h3>
            <ul className={styles.contacts}>
              <li>
                <span className={styles.icon}>📧</span>
                <a href="mailto:info@citypulse.ru">info@citypulse.ru</a>
              </li>
              <li>
                <span className={styles.icon}>📞</span>
                <a href="tel:+74951234567">+7 (495) 123-45-67</a>
              </li>
              <li>
                <span className={styles.icon}>📍</span>
                <span>Москва, Россия</span>
              </li>
            </ul>

            <div className={styles.socials}>
              <a href="https://vk.com" target="_blank" rel="noopener noreferrer" aria-label="VK">
                VK
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                TG
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                IG
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2025 CityPulse. Все права защищены.
          </p>
          <div className={styles.legal}>
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
