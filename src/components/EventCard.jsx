/* ============================================================
   CityPulse — EventCard.jsx
   Вертикальная карточка мероприятия
   ============================================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Eventcard.module.css'; // маленькая 'c'

/* ---------- Иконка-стрелка ---------- */
function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Иконка календаря ---------- */
function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 1v3M11 1v3M1.5 6.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ---------- Иконка локации ---------- */
function LocationIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5C12.5 3.515 10.485 1.5 8 1.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

/* ---------- Иконка звезды ---------- */
function StarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 1l1.854 3.756L14 5.528l-3 2.924.708 4.127L8 10.5l-3.708 2.079L5 8.452 2 5.528l4.146-.772L8 1z"/>
    </svg>
  );
}

/* ============================================================
   EventCard
   Props:
     id            — string | number (для ссылки)
     title         — string
     category      — string
     categoryColor — string (hex-цвет бейджа)
     date          — string
     time          — string
     location      — string
     price         — string
     image         — string (URL)
     rating        — number
     seats         — number (0 = нет данных)
     featured      — boolean (показывает особую ленту)
   ============================================================ */
function EventCard({
  id,
  title,
  category,
  categoryColor,
  date,
  time,
  location,
  price,
  image,
  rating,
  seats,
  featured,
}) {
  /* Вычисляем фоновый цвет бейджа с прозрачностью */
  const badgeBg = `${categoryColor}22`;   /* 13% opacity */
  const badgeBorder = `${categoryColor}55`; /* 33% opacity */

  return (
    <article className={styles.card} aria-label={`Мероприятие: ${title}`}>
      {/* ===== Верхняя часть: изображение + бейдж ===== */}
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={title}
          className={styles.image}
          loading="lazy"
          decoding="async"
        />

        {/* Затемняющий градиент снизу изображения */}
        <div className={styles.imageOverlay} aria-hidden="true" />

        {/* Бейдж категории */}
        <span
          className={styles.badge}
          style={{
            color: categoryColor,
            backgroundColor: badgeBg,
            borderColor: badgeBorder,
          }}
        >
          {category}
        </span>

        {/* Лента «Популярное» для featured-карточек */}
        {featured && (
          <div className={styles.featuredRibbon} aria-label="Популярное">
            <span>★ Топ</span>
          </div>
        )}

        {/* Рейтинг поверх изображения */}
        <div className={styles.ratingBadge}>
          <span className={styles.ratingIcon}><StarIcon /></span>
          <span className={styles.ratingValue}>{rating}</span>
        </div>
      </div>

      {/* ===== Нижняя часть: текстовый контент ===== */}
      <div className={styles.body}>
        {/* Заголовок */}
        <h3 className={styles.title} title={title}>
          {title}
        </h3>

        {/* Мета-информация */}
        <ul className={styles.metaList} aria-label="Детали мероприятия">
          <li className={styles.metaItem}>
            <span className={styles.metaIcon}><CalendarIcon /></span>
            <span className={styles.metaText}>{date} · {time}</span>
          </li>
          <li className={styles.metaItem}>
            <span className={styles.metaIcon}><LocationIcon /></span>
            <span className={styles.metaText}>{location}</span>
          </li>
        </ul>

        {/* Разделитель */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Нижняя строка: цена + кнопка */}
        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>Цена</span>
            <span className={styles.priceValue}>{price}</span>
          </div>

          <Link
            to={`/event/${id}`}
            className={styles.detailsBtn}
            aria-label={`Подробнее о мероприятии "${title}"`}
          >
            <span>Подробнее</span>
            <span className={styles.detailsBtnArrow}><ArrowIcon /></span>
          </Link>
        </div>

        {/* Индикатор мест */}
        {seats > 0 && seats < 200 && (
          <p className={styles.seatsWarning}>
            Осталось мест: <strong>{seats}</strong>
          </p>
        )}
      </div>
    </article>
  );
}

export default EventCard;