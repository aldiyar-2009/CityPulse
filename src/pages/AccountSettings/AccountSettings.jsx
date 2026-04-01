import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import Toast from '../../components/Toast/Toast'
import styles from './AccountSettings.module.css'

function AccountSettings() {
  const { currentUser, updateProfile } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    city: currentUser?.city || '',
    phone: currentUser?.phone || '',
  })
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [saving, setSaving] = useState(false)

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const validate = () => {
    if (!formData.name.trim()) return 'Введите имя'
    if (!formData.email.includes('@')) return 'Введите корректный email'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setToast({ message: validationError, type: 'error' })
      return
    }

    try {
      setSaving(true)
      await updateProfile(formData)
      setToast({ message: 'Данные успешно обновлены!', type: 'success' })
      setTimeout(() => navigate('/profile'), 1800)
    } catch (error) {
      setToast({ message: 'Ошибка: ' + error.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.settings}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
      <div className={styles.container}>
        <ProfileTabs />

        <div className={styles.card}>
          <h1 className={styles.title}>Настройки аккаунта</h1>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="name">Имя</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                className={styles.input}
                required
                placeholder="Ваше имя"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className={styles.input}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="city">Город</label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={handleChange('city')}
                className={styles.input}
                placeholder="Например: Астана"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="phone">Телефон</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                className={styles.input}
                placeholder="+7 777 123 4567"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={saving}>
              {saving ? 'Сохраняем...' : 'Сохранить изменения'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
