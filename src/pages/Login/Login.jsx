import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [adminSecretKey, setAdminSecret] = useState('')
  const [showAdminKey, setShowAdminKey] = useState(false)
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)

  // Show admin key field if email matches admin pattern
  const handleEmailChange = (val) => {
    setEmail(val)
    setShowAdminKey(/^Admin([1-9]|10)@gmail\.com$/i.test(val))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Заполните все поля')
      return
    }

    setError('')
    setLoading(true)

    try {
      await login(email, password, adminSecretKey)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <div className={styles.card}>
        <div className={styles.logo}>
          CityPulse<span className={styles.dot}></span>
        </div>
        <p className={styles.subtitle}>Войдите в свой аккаунт</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Пароль</label>
            <input
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {showAdminKey && (
            <div className={styles.group}>
              <label className={styles.label}>Секретный ключ администратора</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Введите ключ"
                value={adminSecretKey}
                onChange={(e) => setAdminSecret(e.target.value)}
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={loading}
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className={styles.switch}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
