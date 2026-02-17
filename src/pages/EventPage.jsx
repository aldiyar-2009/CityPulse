/* ============================================================
   CityPulse — EventPage.jsx
   Детальная страница мероприятия
   Структура: Hero (афиша + инфо-панель) → Описание → Трейлер → Погода
   ============================================================ */

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { mockEvents } from '../data/mockEvents';
import styles from '../styles/EventPage.module.css';

/* ============================================================
   SVG-иконки
   ============================================================ */
function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="14" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M6 1.5v3M12 1.5v3M2 7.5h14" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M9 5.5V9l2.5 2.5" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 1.5C6.515 1.5 4.5 3.515 4.5 6c0 3.75 4.5 10.5 4.5 10.5S13.5 9.75 13.5 6C13.5 3.515 11.485 1.5 9 1.5z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="9" cy="6" r="1.75" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 7.5C2 6.672 2.672 6 3.5 6h13c.828 0 1.5.672 1.5 1.5v1a2 2 0 000 4v1c0 .828-.672 1.5-1.5 1.5h-13A1.5 1.5 0 012 13.5v-1a2 2 0 000-4v-1z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M7.5 6v8M7.5 9.25h.01M7.5 10.75h.01" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1l1.854 3.756L14 5.528l-3 2.924.708 4.127L8 10.5l-3.708 2.079L5 8.452 2 5.528l4.146-.772L8 1z"/>
    </svg>
  );
}

function AgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.6"/>
      <text x="9" y="13" textAnchor="middle"
        fontSize="7" fontWeight="700" fill="currentColor">18+</text>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="14" cy="3" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="14" cy="15" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="4"  cy="9" r="2"  stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 8l6-4M6 10l6 4" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 15.5S2 11 2 6.5a4 4 0 017-2.65A4 4 0 0116 6.5C16 11 9 15.5 9 15.5z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
        fill={filled ? 'currentColor' : 'none'}/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="5" stroke="#f59e0b" strokeWidth="2"/>
      <path d="M14 3v3M14 22v3M3 14h3M22 14h3M6.22 6.22l2.12 2.12M19.66 19.66l2.12 2.12M6.22 21.78l2.12-2.12M19.66 8.34l2.12-2.12"
        stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M7 19a5 5 0 010-10 5.5 5.5 0 0110.5-1.5A4 4 0 1121 19H7z"
        stroke="#6b7280" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="1.5"/>
      <path d="M11 9l9 5-9 5V9z" fill="white"/>
    </svg>
  );
}

/* ============================================================
   Мок-данные погоды (заглушка)
   ============================================================ */
const MOCK_WEATHER = [
  { time: 'Утро',   icon: 'sun',   temp: '+18°C', desc: 'Солнечно'   },
  { time: 'День',   icon: 'sun',   temp: '+24°C', desc: 'Ясно'        },
  { time: 'Вечер',  icon: 'cloud', temp: '+19°C', desc: 'Облачно'     },
  { time: 'Ночь',   icon: 'cloud', temp: '+14°C', desc: 'Пасмурно'   },
];

/* ============================================================
   EventPage
   ============================================================ */
function EventPage() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  /* Находим событие по id из URL */
  const event = mockEvents.find((e) => String(e.id) === String(id));

  /* Если событие не найдено — экран 404 */
  if (!event) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>🎭</div>
        <h1 className={styles.notFoundTitle}>Событие не найдено</h1>
        <p className={styles.notFoundText}>
          Мероприятие с ID «{id}» не существует или было удалено.
        </p>
        <button
          className={styles.notFoundBtn}
          onClick={() => navigate('/catalog')}
          type="button"
        >
          ← Вернуться в каталог
        </button>
      </div>
    );
  }

  /* Похожие события (та же категория, не сам себя) */

  /* Поделиться (копируем URL) */
  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  /* Цвет бейджа с прозрачностью */
  const badgeBg     = `${event.categoryColor}1a`;
  const badgeBorder = `${event.categoryColor}44`;

  /* ============================================================
     Рендер
     ============================================================ */
  return (
    <div className={styles.page}>

      {/* ===== ХЛЕБНЫЕ КРОШКИ ===== */}
      <nav className={styles.breadcrumbs} aria-label="Навигационная цепочка">
        <div className={styles.breadcrumbsInner}>
          <Link to="/" className={styles.breadcrumbLink}>Главная</Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <Link to="/catalog" className={styles.breadcrumbLink}>Каталог</Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent} aria-current="page">
            {event.title}
          </span>
        </div>
      </nav>

      {/* ===== HERO-БЛОК: Афиша слева + Инфо-панель справа ===== */}
      <section className={styles.hero} aria-labelledby="event-title">
        <div className={styles.heroInner}>

          {/* --- Левая колонка: афиша --- */}
          <div className={styles.posterWrapper}>
            <img
              src={event.image}
              alt={`Афиша мероприятия «${event.title}»`}
              className={styles.posterImage}
              loading="eager"
              decoding="async"
            />

            {/* Категория-бейдж поверх афиши */}
            <span
              className={styles.posterBadge}
              style={{
                color:           event.categoryColor,
                backgroundColor: badgeBg,
                borderColor:     badgeBorder,
              }}
            >
              {event.category}
            </span>

            {/* Рейтинг поверх афиши */}
            <div className={styles.posterRating}>
              <span className={styles.posterRatingIcon}><StarIcon /></span>
              <span className={styles.posterRatingValue}>{event.rating}</span>
            </div>
          </div>

          {/* --- Правая колонка: инфо-панель --- */}
          <div className={styles.infoPanel}>

            {/* Кнопка «Назад» */}
            <button
              className={styles.backBtn}
              onClick={() => navigate(-1)}
              type="button"
              aria-label="Вернуться назад"
            >
              <ArrowLeftIcon />
              <span>Назад</span>
            </button>

            {/* Заголовок */}
            <h1 id="event-title" className={styles.eventTitle}>
              {event.title}
            </h1>

            {/* Короткое описание */}
            <p className={styles.eventLead}>{event.description}</p>

            {/* Мета-блок */}
            <ul className={styles.metaGrid} aria-label="Детали мероприятия">
              <li className={styles.metaItem}>
                <span className={styles.metaIcon}><CalendarIcon /></span>
                <div className={styles.metaContent}>
                  <span className={styles.metaLabel}>Дата</span>
                  <span className={styles.metaValue}>{event.date}</span>
                </div>
              </li>

              <li className={styles.metaItem}>
                <span className={styles.metaIcon}><ClockIcon /></span>
                <div className={styles.metaContent}>
                  <span className={styles.metaLabel}>Время</span>
                  <span className={styles.metaValue}>{event.time}</span>
                </div>
              </li>

              <li className={styles.metaItem}>
                <span className={styles.metaIcon}><LocationIcon /></span>
                <div className={styles.metaContent}>
                  <span className={styles.metaLabel}>Место</span>
                  <span className={styles.metaValue}>{event.location}</span>
                </div>
              </li>

              <li className={styles.metaItem}>
                <span className={styles.metaIcon}><AgeIcon /></span>
                <div className={styles.metaContent}>
                  <span className={styles.metaLabel}>Возраст</span>
                  <span className={styles.metaValue}>18+</span>
                </div>
              </li>
            </ul>

            {/* Разделитель */}
            <div className={styles.infoDivider} aria-hidden="true" />

            {/* Блок цены */}
            <div className={styles.priceBlock}>
              <div className={styles.priceLabelGroup}>
                <span className={styles.priceSuperLabel}>Стоимость билета</span>
                <span className={styles.priceValue}>{event.price}</span>
              </div>

              {event.seats > 0 && event.seats < 200 && (
                <span className={styles.seatsLeft}>
                  Осталось: <strong>{event.seats}</strong> мест
                </span>
              )}
            </div>

            {/* Кнопка «Купить билет» */}
            <a
              href="https://ticketsale.ru"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buyBtn}
              aria-label={`Купить билет на событие «${event.title}»`}
            >
              <span className={styles.buyBtnIcon}><TicketIcon /></span>
              <span>Купить билет</span>
            </a>

            {/* Дополнительные действия */}
            <div className={styles.actionRow}>
              <button
                className={`${styles.actionBtn} ${liked ? styles.actionBtnLiked : ''}`}
                onClick={() => setLiked((v) => !v)}
                type="button"
                aria-label={liked ? 'Убрать из избранного' : 'Добавить в избранное'}
                aria-pressed={liked}
              >
                <HeartIcon filled={liked} />
                <span>{liked ? 'В избранном' : 'В избранное'}</span>
              </button>

              <button
                className={styles.actionBtn}
                onClick={handleShare}
                type="button"
                aria-label="Поделиться ссылкой"
              >
                <ShareIcon />
                <span>{copied ? 'Скопировано!' : 'Поделиться'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== НИЖНЯЯ ЧАСТЬ: три блока подряд ===== */}
      <div className={styles.lower}>
        <div className={styles.lowerInner}>

          {/* Левая + центральная колонка */}
          <div className={styles.lowerMain}>

            {/* --- ПОДРОБНОЕ ОПИСАНИЕ --- */}
            <section className={styles.descSection} aria-labelledby="desc-heading">
              <h2 id="desc-heading" className={styles.sectionTitle}>
                О мероприятии
              </h2>

              <div className={styles.descBody}>
                <p>
                  {event.description} Мероприятие проводится в рамках летнего
                  сезона 2025 года и обещает стать одним из главных культурных
                  событий города. Организаторы подготовили обширную программу,
                  которая удовлетворит самого взыскательного зрителя.
                </p>
                <p>
                  Площадка оснащена современной звуковой системой и
                  профессиональным световым оборудованием. Для гостей предусмотрены
                  удобные парковочные места и зоны питания. Вход осуществляется
                  строго по именным билетам — рекомендуем приобрести заранее,
                  так как количество мест ограничено.
                </p>
                <p>
                  По окончании основной программы состоится автограф-сессия
                  и фотозона для всех желающих. Не упустите возможность
                  прикоснуться к настоящему искусству — билеты расходятся
                  стремительно!
                </p>
              </div>

              {/* Теги */}
              <div className={styles.descTags} aria-label="Теги события">
                <span className={styles.descTag}>{event.category}</span>
                <span className={styles.descTag}>Москва</span>
                <span className={styles.descTag}>Лето 2025</span>
                <span className={styles.descTag}>Live</span>
              </div>
            </section>

            {/* --- ТРЕЙЛЕР (YouTube-заглушка) --- */}
            <section className={styles.trailerSection} aria-labelledby="trailer-heading">
              <h2 id="trailer-heading" className={styles.sectionTitle}>
                Официальный трейлер
              </h2>

              <div className={styles.trailerWrapper}>
                {/*
                  Заглушка iframe: в боевом проекте src будет заменён
                  на реальный YouTube embed-URL.
                  Пример: https://www.youtube.com/embed/VIDEO_ID
                */}
                <div className={styles.trailerPlaceholder} aria-label="Заглушка видео-трейлера">
                  <img
                    src={event.image}
                    alt="Превью трейлера"
                    className={styles.trailerPreview}
                  />
                  <div className={styles.trailerOverlay} aria-hidden="true" />
                  <div className={styles.trailerPlayBtn} aria-hidden="true">
                    <PlayIcon />
                  </div>
                  <p className={styles.trailerCaption}>
                    Трейлер будет доступен после публикации
                  </p>
                </div>

                {/*
                  Раскомментируй для реального YouTube embed:
                  <iframe
                    className={styles.trailerIframe}
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title={`Трейлер: ${event.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                */}
              </div>
            </section>
          </div>

          {/* --- Правая колонка: ПОГОДА --- */}
          <aside className={styles.weatherAside} aria-labelledby="weather-heading">
            <div className={styles.weatherCard}>
              <h2 id="weather-heading" className={styles.weatherTitle}>
                Погода в этот день
              </h2>
              <p className={styles.weatherDate}>{event.date} · {event.location.split(',')[1] || 'Москва'}</p>

              <div className={styles.weatherGrid}>
                {MOCK_WEATHER.map(({ time, icon, temp, desc }) => (
                  <div key={time} className={styles.weatherItem}>
                    <span className={styles.weatherTime}>{time}</span>
                    <span className={styles.weatherIcon}>
                      {icon === 'sun' ? <SunIcon /> : <CloudIcon />}
                    </span>
                    <span className={styles.weatherTemp}>{temp}</span>
                    <span className={styles.weatherDesc}>{desc}</span>
                  </div>
                ))}
              </div>

              <div className={styles.weatherFooter}>
                <span className={styles.weatherSource}>
                  Данные: Mock Weather API
                </span>
              </div>
            </div>

            {/* Карточка «Как добраться» */}
            <div className={styles.howToCard}>
              <h3 className={styles.howToTitle}>Как добраться</h3>
              <ul className={styles.howToList}>
                <li className={styles.howToItem}>
                  <span className={styles.howToEmoji}>🚇</span>
                  <span>Метро — 5 минут пешком</span>
                </li>
                <li className={styles.howToItem}>
                  <span className={styles.howToEmoji}>🚗</span>
                  <span>Паркинг на месте, {event.price === 'Бесплатно' ? 'бесплатно' : 'платно'}</span>
                </li>
                <li className={styles.howToItem}>
                  <span className={styles.howToEmoji}>🚌</span>
                  <span>Автобусные маршруты №7, 12, 45</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}

export default EventPage;