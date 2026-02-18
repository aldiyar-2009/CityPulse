import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Register.module.css'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [errors, setErrors]     = useState({}) // объект ошибок по полям
  const [loading, setLoading]   = useState(false)

  // Валидация — возвращает объект с ошибками по каждому полю
  const validate = () => {
    const errs = {}
    if (!username.trim()) errs.username = 'Введите имя пользователя'
    if (!email.includes('@')) errs.email = 'Введите корректный email'
    if (password.length < 6) errs.password = 'Пароль минимум 6 символов'
    if (password !== confirm) errs.confirm = 'Пароли не совпадают'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      register(username, email, password)
      navigate('/')
    } catch (err) {
      setErrors({ email: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <div className={styles.logo}>TimeLine<span className={styles.dot}></span></div>
        <p className={styles.subtitle}>Создайте аккаунт бесплатно</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label className={styles.label}>Имя пользователя</label>
            <input
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              type="text"
              placeholder="coolmovielover"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Email</label>
            <input
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Пароль</label>
            <input
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Подтвердите пароль</label>
            <input
              className={`${styles.input} ${errors.confirm ? styles.inputError : ''}`}
              type="password"
              placeholder="Повторите пароль"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {errors.confirm && <span className={styles.fieldError}>{errors.confirm}</span>}
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className={styles.switch}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
