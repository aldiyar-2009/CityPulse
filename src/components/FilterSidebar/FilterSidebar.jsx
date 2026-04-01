import styles from './FilterSidebar.module.css'

const CATEGORIES = [
  'Все', 'Концерты', 'Спорт', 'Кино', 'Выставки', 'Театр', 'Фестивали', 'Ярмарки'
]

function FilterSidebar({ filters, onFiltersChange }) {
  const handleCategoryChange = (category) => {
    onFiltersChange({ ...filters, category })
  }

  const handlePriceChange = (field, value) => {
    onFiltersChange({
      ...filters,
      price: { ...filters.price, [field]: value }
    })
  }

  const handleReset = () => {
    onFiltersChange({
      category: 'Все',
      price: { min: '', max: '' }
    })
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Фильтры</h3>
        <button className={styles.resetBtn} onClick={handleReset}>
          Сбросить
        </button>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Категория</h4>
        <div className={styles.categoryList}>
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${
                filters.category === category ? styles.active : ''
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Цена</h4>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="От"
            value={filters.price.min}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className={styles.input}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="До"
            value={filters.price.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>
    </aside>
  )
}

export default FilterSidebar
