import styles from './LoadingSpinner.module.css'

function LoadingSpinner({ text = 'Загрузка...' }) {
  return (
    <div className={styles.wrapper} role="status" aria-label={text}>
      <div className={styles.spinner} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  )
}

export default LoadingSpinner
