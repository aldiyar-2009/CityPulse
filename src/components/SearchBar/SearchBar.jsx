// SearchBar.jsx — строка поиска
//
// Props:
//   value     — текущее значение (управляется родителем)
//   onChange  — callback при изменении
//
// В Catalog.jsx это значение прогоняется через useDebounce()
// перед фильтрацией — чтобы не фильтровать при каждом символе.

import styles from './SearchBar.module.css'

function SearchBar({ value, onChange }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        type="text"
        placeholder="Поиск фильмов..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {/* Кнопка очистки — появляется только если есть текст */}
      {value && (
        <button className={styles.clear} onClick={() => onChange('')}>✕</button>
      )}
    </div>
  )
}

export default SearchBar
