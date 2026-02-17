/* ============================================================
   CityPulse — Navbar.jsx
   Фиксированная навигационная панель
   Структура: Лого | Навигация | Кнопки действий
   ============================================================ */

import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

import styles from '../styles/Navbar.module.css';

/* ---------- Navbar ---------- */
function Navbar() {
  /*
    scrolled — флаг, указывающий, что пользователь прокрутил
    страницу вниз. Используется для усиления тени и легкого
    backdrop-filter, что даёт эффект «поднятой» панели.
  */
  const [scrolled, setScrolled] = useState(false);

  /*
    menuOpen — флаг открытия мобильного меню (бургер-меню).
    Активируется на узких экранах (≤ 768px).
  */
  const [menuOpen, setMenuOpen] = useState(false);

  /* ---------- Слушатель прокрутки ---------- */
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* Вызываем сразу, чтобы установить корректное начальное состояние */
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* ---------- Закрываем меню при изменении размера окна ---------- */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    }

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* ---------- Блокируем прокрутку body при открытом мобильном меню ---------- */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /* ---------- Хелпер для NavLink className ---------- */
  function getNavLinkClass({ isActive }) {
    return isActive
      ? `${styles.navLink} ${styles.navLinkActive}`
      : styles.navLink;
  }

  /* ---------- Закрыть меню при клике по ссылке ---------- */
  function handleLinkClick() {
    setMenuOpen(false);
  }

  /* ---------- Переключатель мобильного меню ---------- */
  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  /* ---------- Разметка ---------- */
  return (
    <header
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}
      role="banner"
    >
      <div className={styles.navbarInner}>

        {/* ===== Левая часть — Логотип ===== */}
        <Link
          to="/"
          className={styles.logo}
          aria-label="CityPulse — на главную"
          onClick={handleLinkClick}
        >
          {/*
            Логотип разбит на два span:
            «City» — тёмный, «Pulse» — оранжевый,
            с лёгким декоративным «пульсом» через псевдоэлемент.
          */}
          <span className={styles.logoPrimary}>City</span>
          <span className={styles.logoAccent}>Pulse</span>
        </Link>

        {/* ===== Центральная часть — Навигационные ссылки ===== */}
        <nav
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}
          aria-label="Основная навигация"
        >
          <NavLink
            to="/catalog"
            className={getNavLinkClass}
            onClick={handleLinkClick}
          >
            События
          </NavLink>

          <NavLink
            to="/about"
            className={getNavLinkClass}
            onClick={handleLinkClick}
          >
            О проекте
          </NavLink>

          <NavLink
            to="/admin"
            className={getNavLinkClass}
            onClick={handleLinkClick}
          >
            Админка
          </NavLink>
        </nav>

        {/* ===== Правая часть — Кнопки действий ===== */}
        <div className={styles.navActions}>
          {/* Кнопка «Войти» — белая с оранжевой рамкой */}
          <Link
            to="/auth"
            className={styles.btnLogin}
            onClick={handleLinkClick}
          >
            Войти
          </Link>

          {/* Кнопка «Регистрация» — оранжево-красный градиент */}
          <Link
            to="/auth"
            className={styles.btnRegister}
            onClick={handleLinkClick}
          >
            Регистрация
          </Link>
        </div>

        {/* ===== Кнопка мобильного меню (бургер) ===== */}
        <button
          className={`${styles.burgerBtn} ${menuOpen ? styles.burgerBtnOpen : ''}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          type="button"
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>

      </div>

      {/*
        Затемняющий оверлей под мобильным меню.
        Клик по нему закрывает меню.
      */}
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={handleLinkClick}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

export default Navbar;