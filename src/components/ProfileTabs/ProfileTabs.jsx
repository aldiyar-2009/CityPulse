import { NavLink } from 'react-router-dom'
import styles from './ProfileTabs.module.css'

function ProfileTabs() {
  return (
    <nav className={styles.tabs}>
      <NavLink to="/profile" end className={({isActive}) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}>
        Профиль
      </NavLink>
      <NavLink to="/account-settings" className={({isActive}) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}>
        Настройки
      </NavLink>
      <NavLink to="/my-tickets" className={({isActive}) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}>
        Мои билеты
      </NavLink>
      <NavLink to="/favorites" className={({isActive}) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}>
        Избранное
      </NavLink>
      <NavLink to="/wallet" className={({isActive}) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}>
        Кошелёк
      </NavLink>
    </nav>
  )
}

export default ProfileTabs
