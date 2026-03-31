import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBalance } from '../../context/BalanceContext'
import styles from './Navbar.module.css'

function Navbar() {
  const { currentUser, logout } = useAuth()
  const { balance } = useBalance()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isAdmin = currentUser?.role === 'admin'

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        CityPulse
      </NavLink>

      <ul className={styles.links}>
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>
            Главная
          </NavLink>
        </li>
        <li>
          <NavLink to="/catalog" className={({ isActive }) => isActive ? styles.active : ''}>
            События
          </NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink to="/admin" className={({ isActive }) => isActive ? `${styles.active} ${styles.adminLink}` : styles.adminLink}>
              Админ панель
            </NavLink>
          </li>
        )}
      </ul>

      <div className={styles.right}>
        {currentUser ? (
          <>
            <NavLink to="/wallet" className={styles.balance}>
              💰 {balance.toLocaleString()} ₸
            </NavLink>
            <div className={styles.profileSection} ref={dropdownRef}>
              <button
                className={`${styles.profileBtn} ${isAdmin ? styles.adminProfileBtn : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className={styles.username}>{currentUser.name || currentUser.username || 'Пользователь'}</span>
                {isAdmin && <span className={styles.adminBadge}>Admin</span>}
              </button>

              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <div>{currentUser.name || currentUser.username}</div>
                    <div className={styles.dropdownEmail}>{currentUser.email}</div>
                    {isAdmin && <div className={styles.dropdownRole}>Администратор</div>}
                  </div>

                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      className={`${styles.dropdownItem} ${styles.adminDropdownItem}`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      ⚙️ Админ панель
                    </NavLink>
                  )}

                  <NavLink
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Профиль
                  </NavLink>

                  <NavLink
                    to="/my-tickets"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Мои билеты
                  </NavLink>

                  <NavLink
                    to="/favorites"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Избранное
                  </NavLink>

                  <NavLink
                    to="/wallet"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Кошелёк
                  </NavLink>

                  <NavLink
                    to="/account-settings"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Настройки
                  </NavLink>

                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    Выход
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" className={styles.btnLogin}>
              Войти
            </NavLink>
            <NavLink to="/register" className={styles.btnRegister}>
              Регистрация
            </NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
