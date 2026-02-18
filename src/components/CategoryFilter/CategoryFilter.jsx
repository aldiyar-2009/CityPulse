// ============================================================
// categoryFilter.jsx — фильтр по жанрам
//
// Props:
//   categorys        — массив доступных жанров (строки)
//   activecategory   — текущий выбранный жанр
//   onSelect      — callback при выборе жанра
//
// Подъём состояния (lifting state up):
//   Состояние activecategory хранится в родительском компоненте (Catalog).
//   categoryFilter только отображает и вызывает onSelect.
//   Это демонстрирует требование ТЗ по lifting state up.
// ============================================================

import styles from './CategoryFilter.module.css'

function CategoryFilter({ categories = [], selected, onSelect }) {
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className={styles.wrap}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.chip} ${selected === category ? styles.active : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
