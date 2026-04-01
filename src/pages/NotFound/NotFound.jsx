import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Страница не найдена</h2>
        <p className={styles.desc}>
          Запрашиваемая страница не существует или была удалена.
        </p>
        <Link to="/" className={styles.btn}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}

export default NotFound
