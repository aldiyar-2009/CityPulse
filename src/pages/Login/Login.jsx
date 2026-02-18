// ============================================================
// Login.jsx — Страница входа
//
// Что делает:
//   1. Управляет формой через useState (контролируемые инпуты)
//   2. Валидирует поля перед отправкой
//   3. Вызывает login() из AuthContext
//   4. При успехе — редиректит на главную
//   5. При ошибке — показывает сообщение
//
// Демонстрирует:
//   ✅ Работа с формами (требование ТЗ)
//   ✅ useState для полей и ошибок
//   ✅ useAuth() из Context
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Стейт формы
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault() // предотвращаем перезагрузку страницы

    // Клиентская валидация
    if (!email || !password) {
      setError('Заполните все поля')
      return
    }

    setError('')
    setLoading(true)

    try {
      login(email, password)
      navigate('/') // успешный вход → на главную
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
          TimeLine<span className={styles.dot}></span>
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
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Сообщение об ошибке */}
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
