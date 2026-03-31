import { useAuth } from '../../context/AuthContext'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import styles from './Profile.module.css'

function Profile() {
  const { currentUser } = useAuth()

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <ProfileTabs />

        <div className={styles.card}>
          <div className={styles.avatar}>
            {currentUser?.username?.[0]?.toUpperCase() || 'П'}
          </div>

          <div className={styles.info}>
            <h2 className={styles.name}>{currentUser?.username || 'Пользователь'}</h2>
            
            <div className={styles.row}>
              <span className={styles.label}>📧 Email:</span>
              <span className={styles.value}>{currentUser?.email}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>📍 Город:</span>
              <span className={styles.value}>{currentUser?.city || 'Не указан'}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>📱 Телефон:</span>
              <span className={styles.value}>{currentUser?.phone || 'Не указан'}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>👤 Статус:</span>
              <span className={styles.badge}>{currentUser?.status || 'Пользователь'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
