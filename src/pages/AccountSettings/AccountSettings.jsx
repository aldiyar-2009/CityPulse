import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import styles from './AccountSettings.module.css'

function AccountSettings() {
  const { currentUser, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    city: currentUser?.city || '',
    phone: currentUser?.phone || ''
  })
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('')

    try {
      updateProfile(formData)
      setMessage('✅ Данные успешно обновлены!')
      setTimeout(() => navigate('/profile'), 1500)
    } catch (error) {
      setMessage('❌ Ошибка: ' + error.message)
    }
  }

  return (
    <div className={styles.settings}>
      <div className={styles.container}>
        <ProfileTabs />

        <div className={styles.card}>
          <h1 className={styles.title}>Настройки аккаунта</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Имя</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Город</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className={styles.input}
                placeholder="Например: Астана"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Телефон</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={styles.input}
                placeholder="+7 777 123 4567"
              />
            </div>

            {message && <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>{message}</div>}

            <button type="submit" className={styles.submitBtn}>
              Сохранить изменения
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
