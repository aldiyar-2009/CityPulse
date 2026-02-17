/* ============================================================
   CityPulse — Catalog.jsx
   Страница каталога: сайдбар фильтров + сетка карточек
   ============================================================ */

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import EventCard from '../components/EventCard'; // БЕЗ фигурных скобок
import { mockEvents, CATEGORIES } from '../data/Mockevents';

import styles from '../styles/Catalog.module.css';

/* ---------- Иконки ---------- */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M11 11l2.8 2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 1.5C6.515 1.5 4.5 3.515 4.5 6c0 3.75 4.5 10.5 4.5 10.5S13.5 9.75 13.5 6C13.5 3.515 11.485 1.5 9 1.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="9" cy="6" r="1.75" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

/* ---------- Варианты сортировки ---------- */
const SORT_OPTIONS = [
  { value: 'default',  label: 'По умолчанию' },
  { value: 'date',     label: 'По дате'      },
  { value: 'rating',   label: 'По рейтингу'  },
  { value: 'price',    label: 'По цене'      },
];

/* ============================================================
   Catalog
   ============================================================ */
function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ---------- Состояния фильтров ---------- */
  const [searchQuery, setSearchQuery]         = useState(
    searchParams.get('q') || ''
  );
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get('category');
    return cat ? [cat] : [];
  });
  const [sortOrder, setSortOrder]             = useState('default');
  const [viewMode, setViewMode]               = useState('grid'); /* 'grid' | 'list' */
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* ---------- Синхронизируем query-параметры → стейт ---------- */
  useEffect(() => {
    const q   = searchParams.get('q') || '';
    const cat = searchParams.get('category');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(q);
    if (cat) setSelectedCategories([cat]);
  }, [searchParams]);

  /* ---------- Обработчики фильтров ---------- */
  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleCategoryToggle(category) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  function handleResetFilters() {
    setSearchQuery('');
    setSelectedCategories([]);
    setSortOrder('default');
    setSearchParams({});
  }

  /* ---------- Фильтрация + сортировка ---------- */
  const filteredEvents = useMemo(() => {
    let result = [...mockEvents];

    /* Фильтр по поиску */
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    /* Фильтр по категориям */
    if (selectedCategories.length > 0) {
      result = result.filter((e) => selectedCategories.includes(e.category));
    }

    /* Сортировка */
    if (sortOrder === 'rating') {
      result = result.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'date') {
      result = result.sort((a, b) => a.id - b.id);
    } else if (sortOrder === 'price') {
      result = result.sort((a, b) => {
        /* «Бесплатно» идёт первым */
        if (a.price === 'Бесплатно') return -1;
        if (b.price === 'Бесплатно') return 1;
        const priceA = parseInt(a.price.replace(/\D/g, ''), 10) || 0;
        const priceB = parseInt(b.price.replace(/\D/g, ''), 10) || 0;
        return priceA - priceB;
      });
    }

    return result;
  }, [searchQuery, selectedCategories, sortOrder]);

  /* ---------- Есть ли активные фильтры ---------- */
  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedCategories.length > 0;

  /* ---------- Рендер ---------- */
  return (
    <div className={styles.page}>

      {/* ===== Шапка страницы ===== */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div className={styles.pageHeaderText}>
            <span className={styles.pageEyebrow}>Каталог</span>
            <h1 className={styles.pageTitle}>Все события</h1>
            <p className={styles.pageSubtitle}>
              {filteredEvents.length > 0
                ? `Найдено ${filteredEvents.length} ${plural(filteredEvents.length, 'событие', 'события', 'событий')}`
                : 'Нет результатов по заданным фильтрам'}
            </p>
          </div>

          {/* Кнопки вида (сетка / список) */}
          <div className={styles.viewToggle} role="group" aria-label="Вид отображения">
            <button
              className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Сетка"
              aria-pressed={viewMode === 'grid'}
              type="button"
            >
              <GridIcon />
            </button>
            <button
              className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="Список"
              aria-pressed={viewMode === 'list'}
              type="button"
            >
              <ListIcon />
            </button>
          </div>

          {/* Кнопка «Фильтры» на мобильных */}
          <button
            className={styles.mobileFilterBtn}
            onClick={() => setMobileSidebarOpen((prev) => !prev)}
            type="button"
            aria-label="Открыть фильтры"
            aria-expanded={mobileSidebarOpen}
          >
            <FilterIcon />
            <span>Фильтры</span>
            {hasActiveFilters && (
              <span className={styles.mobileFilterDot} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ===== Основной макет: сайдбар + контент ===== */}
      <div className={styles.layout}>

        {/* =====================================================
            САЙДБАР ФИЛЬТРОВ
            ===================================================== */}
        <aside
          className={`${styles.sidebar} ${mobileSidebarOpen ? styles.sidebarOpen : ''}`}
          aria-label="Фильтры"
        >
          {/* Закрыть (только мобильный) */}
          <button
            className={styles.sidebarClose}
            onClick={() => setMobileSidebarOpen(false)}
            type="button"
            aria-label="Закрыть фильтры"
          >
            <XIcon />
          </button>

          {/* --- Поиск --- */}
          <div className={styles.filterBlock}>
            <h2 className={styles.filterBlockTitle}>Поиск</h2>
            <div className={styles.filterSearchWrapper}>
              <span className={styles.filterSearchIcon}><SearchIcon /></span>
              <input
                type="text"
                className={styles.filterSearch}
                placeholder="Название, место…"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Поиск по названию или месту"
              />
              {searchQuery && (
                <button
                  className={styles.filterSearchClear}
                  onClick={() => setSearchQuery('')}
                  type="button"
                  aria-label="Очистить поиск"
                >
                  <XIcon />
                </button>
              )}
            </div>
          </div>

          <div className={styles.filterDivider} role="separator" />

          {/* --- Категории --- */}
          <div className={styles.filterBlock}>
            <h2 className={styles.filterBlockTitle}>Категории</h2>
            <div className={styles.filterCategories} role="group" aria-label="Фильтр по категориям">
              {CATEGORIES.map((cat) => {
                const isChecked = selectedCategories.includes(cat);
                return (
                  <label
                    key={cat}
                    className={`${styles.filterCheckLabel} ${isChecked ? styles.filterCheckLabelActive : ''}`}
                  >
                    <input
                      type="checkbox"
                      className={styles.filterCheckInput}
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(cat)}
                      aria-label={`Категория ${cat}`}
                    />
                    <span className={styles.filterCheckBox} aria-hidden="true">
                      {isChecked && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5l2.5 3L8.5 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className={styles.filterCheckText}>{cat}</span>
                    <span className={styles.filterCheckCount}>
                      {mockEvents.filter((e) => e.category === cat).length}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className={styles.filterDivider} role="separator" />

          {/* --- Сортировка --- */}
          <div className={styles.filterBlock}>
            <h2 className={styles.filterBlockTitle}>Сортировка</h2>
            <div className={styles.filterSort} role="radiogroup" aria-label="Порядок сортировки">
              {SORT_OPTIONS.map(({ value, label }) => (
                <label
                  key={value}
                  className={`${styles.filterRadioLabel} ${sortOrder === value ? styles.filterRadioLabelActive : ''}`}
                >
                  <input
                    type="radio"
                    name="sort"
                    className={styles.filterRadioInput}
                    checked={sortOrder === value}
                    onChange={() => setSortOrder(value)}
                    aria-label={label}
                  />
                  <span className={styles.filterRadioDot} aria-hidden="true" />
                  <span className={styles.filterRadioText}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterDivider} role="separator" />

          {/* --- Сброс фильтров --- */}
          <div className={styles.filterBlock}>
            <button
              className={styles.filterResetBtn}
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              type="button"
              aria-label="Сбросить все фильтры"
            >
              Сбросить фильтры
            </button>
          </div>

          {/* --- Заглушка «Посмотреть на карте» --- */}
          <div className={styles.mapStub} role="complementary" aria-label="Карта мероприятий">
            <div className={styles.mapStubIcon}>
              <MapPinIcon />
            </div>
            <div className={styles.mapStubContent}>
              <span className={styles.mapStubTitle}>Посмотреть на карте</span>
              <span className={styles.mapStubSub}>
                Найди события рядом с тобой
              </span>
            </div>
            <button
              className={styles.mapStubBtn}
              type="button"
              aria-label="Открыть карту"
              onClick={() => alert('Карта появится в следующем обновлении!')}
            >
              →
            </button>
          </div>
        </aside>

        {/* Оверлей для мобильного сайдбара */}
        {mobileSidebarOpen && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* =====================================================
            ОСНОВНОЙ КОНТЕНТ: тулбар + сетка
            ===================================================== */}
        <main className={styles.content} aria-live="polite" aria-atomic="true">

          {/* Тулбар: кол-во результатов + сортировка */}
          <div className={styles.contentToolbar}>
            <span className={styles.resultsCount}>
              {filteredEvents.length === 0
                ? 'Ничего не найдено'
                : `${filteredEvents.length} ${plural(filteredEvents.length, 'событие', 'события', 'событий')}`}
            </span>

            {/* Активные теги-фильтры */}
            {hasActiveFilters && (
              <div className={styles.activeTags} aria-label="Активные фильтры">
                {searchQuery.trim() && (
                  <span className={styles.activeTag}>
                    «{searchQuery.trim()}»
                    <button
                      onClick={() => setSearchQuery('')}
                      className={styles.activeTagRemove}
                      type="button"
                      aria-label={`Убрать фильтр по запросу ${searchQuery}`}
                    >
                      <XIcon />
                    </button>
                  </span>
                )}
                {selectedCategories.map((cat) => (
                  <span key={cat} className={styles.activeTag}>
                    {cat}
                    <button
                      onClick={() => handleCategoryToggle(cat)}
                      className={styles.activeTagRemove}
                      type="button"
                      aria-label={`Убрать фильтр ${cat}`}
                    >
                      <XIcon />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Сетка или список карточек */}
          {filteredEvents.length > 0 ? (
            <div
              className={viewMode === 'grid' ? styles.grid : styles.listView}
              role="list"
              aria-label="Список мероприятий"
            >
              {filteredEvents.map((event) => (
                <div key={event.id} role="listitem">
                  <EventCard {...event} />
                </div>
              ))}
            </div>
          ) : (
            /* Пустое состояние */
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>Ничего не найдено</h3>
              <p className={styles.emptyText}>
                Попробуй изменить параметры поиска или сбросить фильтры.
              </p>
              <button
                className={styles.emptyResetBtn}
                onClick={handleResetFilters}
                type="button"
              >
                Сбросить все фильтры
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------- Хелпер: склонение ---------- */
function plural(n, one, few, many) {
  const abs = Math.abs(n) % 100;
  const n1  = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (n1 > 1 && n1 < 5)    return few;
  if (n1 === 1)             return one;
  return many;
}

export default Catalog;