/* ============================================================
   CityPulse — Home.jsx
   Главная страница: Hero + Поиск + Популярные события
   ============================================================ */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { mockEvents } from '../data/mockEvents';

import styles from '../styles/Home.module.css';

/* ---------- Иконки ---------- */
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M14 14l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 2v3M11 17v3M2 11h3M17 11h3M4.93 4.93l2.12 2.12M14.95 14.95l2.12 2.12M4.93 17.07l2.12-2.12M14.95 7.05l2.12-2.12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

/* ---------- Данные для Hero-статистики ---------- */
const heroStats = [
  { value: '2 400+', label: 'Событий в месяц' },
  { value: '48',     label: 'Городов России'  },
  { value: '180к+',  label: 'Активных пользователей' },
];

/* ---------- Карточки быстрых категорий ---------- */
const quickCategories = [
  { label: 'Концерты', emoji: '🎵', color: '#ff8c00' },
  { label: 'Спорт',    emoji: '⚽', color: '#10b981' },
  { label: 'Кино',     emoji: '🎬', color: '#8b5cf6' },
  { label: 'Выставки', emoji: '🖼',  color: '#f59e0b' },
];

/* ============================================================
   Home
   ============================================================ */
function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  /* Только featured-события для секции «Популярное» */
  const featuredEvents = mockEvents.filter((event) => event.featured);

  /* «Скоро» — следующие 4 события (не featured) */
  const upcomingEvents = mockEvents.filter((event) => !event.featured).slice(0, 4);

  /* ---------- Обработчик поиска ---------- */
  function handleSearch(e) {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/catalog?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/catalog');
    }
  }

  /* ---------- Быстрая фильтрация по категории ---------- */
  function handleCategoryClick(label) {
    navigate(`/catalog?category=${encodeURIComponent(label)}`);
  }

  /* ---------- Рендер ---------- */
  return (
    <div className={styles.page}>

      {/* =====================================================
          СЕКЦИЯ HERO
          ===================================================== */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        {/* Декоративные фоновые элементы */}
        <div className={styles.heroOrb1} aria-hidden="true" />
        <div className={styles.heroOrb2} aria-hidden="true" />
        <div className={styles.heroOrb3} aria-hidden="true" />

        <div className={styles.heroContent}>
          {/* Плашка-тег над заголовком */}
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowIcon}><SparkleIcon /></span>
            <span>Агрегатор городских событий</span>
          </div>

          {/* Главный заголовок с градиентом */}
          <h1 id="hero-heading" className={styles.heroTitle}>
            Найди своё<br />
            <span className={styles.heroTitleGradient}>событие</span>
            {' '}в<br />
            CityPulse
          </h1>

          {/* Подзаголовок */}
          <p className={styles.heroSubtitle}>
            Концерты, спорт, кино и выставки — все городские мероприятия
            в одном месте. Покупай билеты, не пропускай главное.
          </p>

          {/* ===== Строка поиска ===== */}
          <form
            className={styles.searchForm}
            onSubmit={handleSearch}
            role="search"
            aria-label="Поиск мероприятий"
          >
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchInputIcon}><SearchIcon /></span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Концерт, матч, выставка…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Введите название мероприятия"
              />
            </div>
            <button
              type="submit"
              className={styles.searchBtn}
              aria-label="Найти мероприятия"
            >
              <span>Найти</span>
              <span className={styles.searchBtnArrow}><ChevronRightIcon /></span>
            </button>
          </form>

          {/* ===== Быстрые категории ===== */}
          <div
            className={styles.quickCategories}
            role="list"
            aria-label="Быстрый переход по категориям"
          >
            {quickCategories.map(({ label, emoji, color }) => (
              <button
                key={label}
                className={styles.quickCategory}
                onClick={() => handleCategoryClick(label)}
                style={{ '--cat-color': color }}
                role="listitem"
                type="button"
                aria-label={`Перейти в категорию ${label}`}
              >
                <span className={styles.quickCategoryEmoji}>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ===== Статистика ===== */}
        <div className={styles.heroStats} role="list" aria-label="Статистика платформы">
          {heroStats.map(({ value, label }) => (
            <div key={label} className={styles.heroStat} role="listitem">
              <span className={styles.heroStatValue}>{value}</span>
              <span className={styles.heroStatLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          СЕКЦИЯ «ПОПУЛЯРНОЕ»
          ===================================================== */}
      <section
        className={styles.section}
        aria-labelledby="featured-heading"
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <span className={styles.sectionEyebrow}>Хиты недели</span>
            <h2 id="featured-heading" className={styles.sectionTitle}>
              Популярное
            </h2>
          </div>
          <a href="/catalog" className={styles.sectionLink}>
            Смотреть все <ChevronRightIcon />
          </a>
        </div>

        <div className={styles.grid}>
          {featuredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      {/* =====================================================
          СЕКЦИЯ «СКОРО»
          ===================================================== */}
      <section
        className={`${styles.section} ${styles.sectionAlt}`}
        aria-labelledby="upcoming-heading"
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <span className={styles.sectionEyebrow}>Не пропусти</span>
            <h2 id="upcoming-heading" className={styles.sectionTitle}>
              Ближайшие события
            </h2>
          </div>
          <a href="/catalog" className={styles.sectionLink}>
            Весь каталог <ChevronRightIcon />
          </a>
        </div>

        <div className={styles.grid}>
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

      {/* =====================================================
          СЕКЦИЯ CTA (призыв к действию)
          ===================================================== */}
      <section className={styles.cta} aria-labelledby="cta-heading">
        <div className={styles.ctaContent}>
          <h2 id="cta-heading" className={styles.ctaTitle}>
            Готов открыть свой город?
          </h2>
          <p className={styles.ctaSubtitle}>
            Зарегистрируйся и получай персональные рекомендации событий
            по твоим интересам каждую неделю.
          </p>
          <div className={styles.ctaActions}>
            <a href="/auth" className={styles.ctaBtnPrimary}>
              Начать бесплатно
            </a>
            <a href="/catalog" className={styles.ctaBtnSecondary}>
              Смотреть события
            </a>
          </div>
        </div>

        {/* Декоративные элементы фона CTA */}
        <div className={styles.ctaOrb1} aria-hidden="true" />
        <div className={styles.ctaOrb2} aria-hidden="true" />
      </section>

    </div>
  );
}

export default Home;