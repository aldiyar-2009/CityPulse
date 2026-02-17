/* ============================================================
   CityPulse — Admin.jsx
   Административная панель: статистика, таблица, CRUD-форма
   ============================================================ */

import React, { useState, useId } from 'react';

import { mockEvents, CATEGORIES } from '../data/Mockevents';
import styles from '../styles/Admin.module.css';

/* ============================================================
   SVG-иконки
   ============================================================ */
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M10.5 1.5l3 3-9 9H1.5v-3l9-9z" stroke="currentColor"
        strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M8.5 3.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M2 4h11M5 4V2.5a1.5 1.5 0 013 0V4M6 7v4M9 7v4"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="4" width="9" height="9" rx="1.5"
        stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2L2 17h16L10 2z" stroke="#ef4444" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M10 8v4" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r="0.75" fill="#ef4444"/>
    </svg>
  );
}

/* ============================================================
   Вычисляем статистику для дашборда
   ============================================================ */
function buildStats(events) {
  const total      = events.length;
  const byCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = events.filter((e) => e.category === cat).length;
    return acc;
  }, {});
  const freeCount  = events.filter((e) => e.price === 'Бесплатно').length;
  return { total, byCategory, freeCount };
}

/* Пустая форма нового события */
const EMPTY_FORM = {
  title:    '',
  category: CATEGORIES[0],
  date:     '',
  time:     '',
  location: '',
  price:    '',
  image:    '',
  rating:   '',
  description: '',
};

/* ============================================================
   Модальное окно добавления / редактирования
   ============================================================ */
function EventModal({ initial, onSave, onClose }) {
  const uid        = useId();
  const isEdit     = Boolean(initial?.id);
  const [form, setForm]   = useState(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function setField(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  }

  function validate() {
    const e = {};
    if (!form.title.trim())    e.title    = 'Введите название';
    if (!form.date.trim())     e.date     = 'Укажите дату';
    if (!form.location.trim()) e.location = 'Укажите место';
    if (!form.price.trim())    e.price    = 'Укажите цену';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  }

  return (
    /* Оверлей */
    <div
      className={styles.modalOverlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        {/* Шапка */}
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {isEdit ? 'Редактировать событие' : 'Новое событие'}
          </h2>
          <button
            className={styles.modalClose}
            onClick={onClose}
            type="button"
            aria-label="Закрыть"
          >
            <XIcon />
          </button>
        </div>

        {/* Форма */}
        <form className={styles.modalForm} onSubmit={handleSubmit} noValidate>
          {/* Строка 1: Название */}
          <div className={styles.modalField}>
            <label htmlFor={`${uid}-title`} className={styles.modalLabel}>
              Название <span className={styles.modalRequired}>*</span>
            </label>
            <input
              id={`${uid}-title`}
              type="text"
              className={`${styles.modalInput} ${errors.title ? styles.modalInputError : ''}`}
              placeholder="Например: Jazz в парке"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              required
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className={styles.modalError}>{errors.title}</p>}
          </div>

          {/* Строка 2: Категория + Дата */}
          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <label htmlFor={`${uid}-category`} className={styles.modalLabel}>
                Категория
              </label>
              <div className={styles.modalSelectWrap}>
                <select
                  id={`${uid}-category`}
                  className={styles.modalSelect}
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className={styles.modalSelectArrow}><ChevronDownIcon /></span>
              </div>
            </div>

            <div className={styles.modalField}>
              <label htmlFor={`${uid}-date`} className={styles.modalLabel}>
                Дата <span className={styles.modalRequired}>*</span>
              </label>
              <input
                id={`${uid}-date`}
                type="date"
                className={`${styles.modalInput} ${errors.date ? styles.modalInputError : ''}`}
                value={form.date}
                onChange={(e) => setField('date', e.target.value)}
                required
                aria-invalid={!!errors.date}
              />
              {errors.date && <p className={styles.modalError}>{errors.date}</p>}
            </div>
          </div>

          {/* Строка 3: Время + Место */}
          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <label htmlFor={`${uid}-time`} className={styles.modalLabel}>
                Время
              </label>
              <input
                id={`${uid}-time`}
                type="time"
                className={styles.modalInput}
                value={form.time}
                onChange={(e) => setField('time', e.target.value)}
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor={`${uid}-location`} className={styles.modalLabel}>
                Место <span className={styles.modalRequired}>*</span>
              </label>
              <input
                id={`${uid}-location`}
                type="text"
                className={`${styles.modalInput} ${errors.location ? styles.modalInputError : ''}`}
                placeholder="Адрес или название площадки"
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
                required
                aria-invalid={!!errors.location}
              />
              {errors.location && <p className={styles.modalError}>{errors.location}</p>}
            </div>
          </div>

          {/* Строка 4: Цена + Рейтинг */}
          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <label htmlFor={`${uid}-price`} className={styles.modalLabel}>
                Цена <span className={styles.modalRequired}>*</span>
              </label>
              <input
                id={`${uid}-price`}
                type="text"
                className={`${styles.modalInput} ${errors.price ? styles.modalInputError : ''}`}
                placeholder="от 500 ₽ или Бесплатно"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                required
                aria-invalid={!!errors.price}
              />
              {errors.price && <p className={styles.modalError}>{errors.price}</p>}
            </div>

            <div className={styles.modalField}>
              <label htmlFor={`${uid}-rating`} className={styles.modalLabel}>
                Рейтинг
              </label>
              <input
                id={`${uid}-rating`}
                type="number"
                min="1"
                max="5"
                step="0.1"
                className={styles.modalInput}
                placeholder="4.5"
                value={form.rating}
                onChange={(e) => setField('rating', e.target.value)}
              />
            </div>
          </div>

          {/* URL изображения */}
          <div className={styles.modalField}>
            <label htmlFor={`${uid}-image`} className={styles.modalLabel}>
              URL изображения
            </label>
            <input
              id={`${uid}-image`}
              type="url"
              className={styles.modalInput}
              placeholder="https://images.unsplash.com/…"
              value={form.image}
              onChange={(e) => setField('image', e.target.value)}
            />
          </div>

          {/* Описание */}
          <div className={styles.modalField}>
            <label htmlFor={`${uid}-desc`} className={styles.modalLabel}>
              Краткое описание
            </label>
            <textarea
              id={`${uid}-desc`}
              className={styles.modalTextarea}
              placeholder="Несколько предложений о мероприятии…"
              rows={3}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>

          {/* Кнопки формы */}
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.modalCancelBtn}
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className={styles.modalSaveBtn}>
              {isEdit ? 'Сохранить изменения' : 'Создать событие'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   Диалог подтверждения удаления
   ============================================================ */
function DeleteDialog({ eventTitle, onConfirm, onCancel }) {
  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      aria-describedby="delete-desc"
    >
      <div className={styles.deleteDialog}>
        <div className={styles.deleteDialogIcon}><AlertIcon /></div>
        <h2 id="delete-title" className={styles.deleteDialogTitle}>
          Удалить событие?
        </h2>
        <p id="delete-desc" className={styles.deleteDialogText}>
          Вы собираетесь удалить{' '}
          <strong>«{eventTitle}»</strong>. Это действие нельзя отменить.
        </p>
        <div className={styles.deleteDialogActions}>
          <button
            type="button"
            className={styles.modalCancelBtn}
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            type="button"
            className={styles.deleteConfirmBtn}
            onClick={onConfirm}
          >
            Да, удалить
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Admin (главный компонент)
   ============================================================ */
function Admin() {
  /* Локальная копия событий (CRUD только в памяти) */
  const [events, setEvents]       = useState(mockEvents);
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('Все');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]         = useState(null);  /* { text, type } */

  /* ---------- Уведомление (toast) ---------- */
  function showToast(text, type = 'success') {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* ---------- Открыть форму нового события ---------- */
  function handleAddNew() {
    setEditTarget(null);
    setModalOpen(true);
  }

  /* ---------- Открыть форму редактирования ---------- */
  function handleEdit(event) {
    setEditTarget(event);
    setModalOpen(true);
  }

  /* ---------- Запросить подтверждение удаления ---------- */
  function handleDeleteRequest(event) {
    setDeleteTarget(event);
  }

  /* ---------- Подтвердить удаление ---------- */
  function handleDeleteConfirm() {
    setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    showToast(`«${deleteTarget.title}» удалено`, 'error');
    setDeleteTarget(null);
  }

  /* ---------- Сохранить событие (создать или обновить) ---------- */
  function handleSave(formData) {
    if (editTarget) {
      /* Редактирование */
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editTarget.id
            ? { ...e, ...formData, rating: parseFloat(formData.rating) || e.rating }
            : e
        )
      );
      showToast('Изменения сохранены');
    } else {
      /* Создание нового */
      const newId = Math.max(...events.map((e) => e.id)) + 1;
      setEvents((prev) => [
        ...prev,
        {
          ...formData,
          id:            newId,
          rating:        parseFloat(formData.rating) || 4.0,
          seats:         0,
          featured:      false,
          categoryColor: '#ff8c00',
          image:         formData.image ||
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
        },
      ]);
      showToast('Событие добавлено');
    }
    setModalOpen(false);
    setEditTarget(null);
  }

  /* ---------- Фильтрация событий ---------- */
  const FILTER_TABS = ['Все', ...CATEGORIES];

  const filtered = events.filter((e) => {
    const matchSearch = !search.trim() ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'Все' || e.category === catFilter;
    return matchSearch && matchCat;
  });

  /* ---------- Статистика ---------- */
  const stats = buildStats(events);

  /* ============================================================
     Рендер
     ============================================================ */
  return (
    <div className={styles.page}>

      {/* ===== ШАПКА ДАШБОРДА ===== */}
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div className={styles.pageHeaderText}>
            <span className={styles.pageEyebrow}>CityPulse Admin</span>
            <h1 className={styles.pageTitle}>Панель управления</h1>
          </div>

          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAddNew}
            aria-label="Добавить новое событие"
          >
            <PlusIcon />
            <span>Добавить событие</span>
          </button>
        </div>
      </header>

      <div className={styles.body}>

        {/* ===== КАРТОЧКИ СТАТИСТИКИ ===== */}
        <section className={styles.statsGrid} aria-label="Сводная статистика">
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Всего событий</span>
          </div>

          {CATEGORIES.map((cat) => (
            <div key={cat} className={styles.statCard}>
              <span className={styles.statValue}>{stats.byCategory[cat]}</span>
              <span className={styles.statLabel}>{cat}</span>
            </div>
          ))}

          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.freeCount}</span>
            <span className={styles.statLabel}>Бесплатных</span>
          </div>
        </section>

        {/* ===== ТУЛБАР: ПОИСК + ФИЛЬТР ===== */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarSearch}>
            <span className={styles.toolbarSearchIcon}><SearchIcon /></span>
            <input
              type="text"
              className={styles.toolbarSearchInput}
              placeholder="Поиск по названию или месту…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Поиск по событиям"
            />
            {search && (
              <button
                type="button"
                className={styles.toolbarSearchClear}
                onClick={() => setSearch('')}
                aria-label="Очистить поиск"
              >
                <XIcon />
              </button>
            )}
          </div>

          {/* Табы-фильтры по категории */}
          <div className={styles.filterTabs} role="tablist" aria-label="Фильтр по категории">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`${styles.filterTab} ${catFilter === tab ? styles.filterTabActive : ''}`}
                onClick={() => setCatFilter(tab)}
                role="tab"
                aria-selected={catFilter === tab}
              >
                {tab}
                <span className={styles.filterTabCount}>
                  {tab === 'Все'
                    ? events.length
                    : events.filter((e) => e.category === tab).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ===== ТАБЛИЦА СОБЫТИЙ ===== */}
        <div className={styles.tableWrapper}>
          <table className={styles.table} aria-label="Список мероприятий">
            <thead>
              <tr>
                <th className={styles.th} scope="col">#</th>
                <th className={styles.th} scope="col">Название</th>
                <th className={styles.th} scope="col">Категория</th>
                <th className={styles.th} scope="col">Дата</th>
                <th className={styles.th} scope="col">Место</th>
                <th className={styles.th} scope="col">Цена</th>
                <th className={styles.th} scope="col">Рейтинг</th>
                <th className={`${styles.th} ${styles.thActions}`} scope="col">Действия</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((event, index) => (
                  <tr
                    key={event.id}
                    className={`${styles.tr} ${index % 2 === 0 ? styles.trEven : ''}`}
                  >
                    {/* Номер */}
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      {event.id}
                    </td>

                    {/* Название + мини-превью */}
                    <td className={styles.td}>
                      <div className={styles.tdTitleCell}>
                        <img
                          src={event.image}
                          alt=""
                          className={styles.tdThumb}
                          aria-hidden="true"
                          loading="lazy"
                        />
                        <div>
                          <p className={styles.tdTitle}>{event.title}</p>
                          {event.featured && (
                            <span className={styles.tdFeaturedBadge}>★ Топ</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Категория */}
                    <td className={styles.td}>
                      <span
                        className={styles.tdCatBadge}
                        style={{
                          color:           event.categoryColor,
                          backgroundColor: `${event.categoryColor}1a`,
                          borderColor:     `${event.categoryColor}44`,
                        }}
                      >
                        {event.category}
                      </span>
                    </td>

                    {/* Дата */}
                    <td className={`${styles.td} ${styles.tdMuted}`}>
                      {event.date}
                    </td>

                    {/* Место */}
                    <td className={`${styles.td} ${styles.tdMuted} ${styles.tdLocation}`}>
                      {event.location}
                    </td>

                    {/* Цена */}
                    <td className={`${styles.td} ${styles.tdPrice}`}>
                      {event.price}
                    </td>

                    {/* Рейтинг */}
                    <td className={`${styles.td} ${styles.tdRating}`}>
                      ★ {event.rating}
                    </td>

                    {/* Действия: редактировать + удалить */}
                    <td className={`${styles.td} ${styles.tdActionsCell}`}>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => handleEdit(event)}
                        aria-label={`Редактировать «${event.title}»`}
                      >
                        <PencilIcon />
                        <span>Изменить</span>
                      </button>

                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteRequest(event)}
                        aria-label={`Удалить «${event.title}»`}
                      >
                        <TrashIcon />
                        <span>Удалить</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    <div className={styles.emptyState}>
                      <span className={styles.emptyIcon}>🔍</span>
                      <p className={styles.emptyText}>Ничего не найдено</p>
                      <button
                        type="button"
                        className={styles.emptyResetBtn}
                        onClick={() => { setSearch(''); setCatFilter('Все'); }}
                      >
                        Сбросить фильтры
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Футер таблицы */}
          {filtered.length > 0 && (
            <div className={styles.tableFooter}>
              Показано {filtered.length} из {events.length} событий
            </div>
          )}
        </div>
      </div>

      {/* ===== МОДАЛКА ФОРМЫ ===== */}
      {modalOpen && (
        <EventModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
        />
      )}

      {/* ===== ДИАЛОГ УДАЛЕНИЯ ===== */}
      {deleteTarget && (
        <DeleteDialog
          eventTitle={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ===== TOAST-УВЕДОМЛЕНИЕ ===== */}
      {toast && (
        <div
          className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

export default Admin;