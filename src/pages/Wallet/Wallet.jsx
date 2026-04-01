import { useState } from 'react'
import { useBalance } from '../../context/BalanceContext'
import { useAuth } from '../../context/AuthContext'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import styles from './Wallet.module.css'

function Wallet() {
  const { balance, addBalance } = useBalance()
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    amount: ''
  })
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState(null)

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const amount = parseFloat(formData.amount)
    
    if (amount <= 0 || amount > 200000) {
      alert('Сумма должна быть от 1 до 200 000 ₸')
      return
    }

    if (formData.cardNumber.length < 16 || formData.expiry.length < 5 || formData.cvv.length < 3) {
      alert('Заполните все данные карты')
      return
    }

    addBalance(amount)
    
    const receipt = {
      amount: amount,
      date: new Date().toLocaleString('ru-RU'),
      cardLast4: formData.cardNumber.slice(-4),
      transactionId: 'TX' + Date.now()
    }
    
    setReceiptData(receipt)
    setShowReceipt(true)
    
    setFormData({
      cardNumber: '',
      expiry: '',
      cvv: '',
      amount: ''
    })
  }

  const closeReceipt = () => {
    setShowReceipt(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ProfileTabs />

        <div className={styles.layout}>
          <div className={styles.left}>
            <h2 className={styles.title}>Пополнение баланса</h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Номер карты</label>
                <input
                  type="text"
                  value={formatCardNumber(formData.cardNumber)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '')
                    if (value.length <= 16) {
                      setFormData({...formData, cardNumber: value})
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Срок</label>
                  <input
                    type="text"
                    value={formData.expiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '')
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4)
                      }
                      if (value.length <= 5) {
                        setFormData({...formData, expiry: value})
                      }
                    }}
                    placeholder="MM/YY"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>CVV</label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 3) {
                        setFormData({...formData, cvv: value})
                      }
                    }}
                    placeholder="123"
                    className={styles.input}
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Сумма пополнения (макс. 200 000 ₸)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Введите сумму"
                  className={styles.input}
                  max="200000"
                  required
                />
              </div>

              <button type="submit" className={styles.btn}>
                Пополнить
              </button>
            </form>
          </div>

          <div className={styles.right}>
            <div className={styles.balanceCard}>
              <div className={styles.balanceLabel}>Баланс</div>
              <div className={styles.balanceAmount}>{balance.toLocaleString()} ₸</div>
            </div>

            <div className={styles.userInfo}>
              <h3>Данные пользователя</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Имя:</span>
                <span className={styles.infoValue}>{currentUser?.username}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{currentUser?.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Телефон:</span>
                <span className={styles.infoValue}>{currentUser?.phone || 'Не указан'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReceipt && receiptData && (
        <div className={styles.receiptOverlay} onClick={closeReceipt}>
          <div className={styles.receipt} onClick={(e) => e.stopPropagation()}>
            <div className={styles.receiptHeader}>
              <h2>Чек пополнения</h2>
              <button onClick={closeReceipt} className={styles.closeBtn}>✕</button>
            </div>
            
            <div className={styles.receiptBody}>
              <div className={styles.receiptLogo}>CityPulse</div>
              
              <div className={styles.receiptRow}>
                <span>Сумма пополнения:</span>
                <strong>{receiptData.amount.toLocaleString()} ₸</strong>
              </div>
              
              <div className={styles.receiptRow}>
                <span>Карта:</span>
                <span>**** {receiptData.cardLast4}</span>
              </div>
              
              <div className={styles.receiptRow}>
                <span>Дата и время:</span>
                <span>{receiptData.date}</span>
              </div>
              
              <div className={styles.receiptRow}>
                <span>ID транзакции:</span>
                <span>{receiptData.transactionId}</span>
              </div>

              <div className={styles.receiptSuccess}>
                ✅ Операция успешно выполнена
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wallet
