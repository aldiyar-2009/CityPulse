/* ============================================================
   CityPulse — Auth.jsx
   Страница авторизации / регистрации
   Анимированные табы, оранжевая подсветка полей при фокусе
   ============================================================ */

import React, { useState, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import styles from '../styles/Auth.module.css';

/* ============================================================
   SVG-иконки
   ============================================================ */
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <ellipse cx="9" cy="9" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 2l14 14M7.5 7.7A2 2 0 0110.3 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4.5 4.7C3 6 2 7.5 2 9c0 1 1.5 4.5 7 4.5a8 8 0 003.5-.8M8 3.6A8 8 0 0116 9c0 1-.5 2.3-1.5 3.3"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 7l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="4" y="8" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="12" r="1" fill="currentColor"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7l3.5 4L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ============================================================
   Компонент поля ввода
   ============================================================ */
function FormField({
  id,
  label,
  type: initialType = 'text',
  placeholder,
  value,
  onChange,
  icon,
  required,
  autoComplete,
  error,
  hint,
}) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = initialType === 'password';
  const inputType  = isPassword ? (showPass ? 'text' : 'password') : initialType;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.fieldRequired} aria-hidden="true"> *</span>}
      </label>

      <div className={`${styles.fieldInputWrap} ${error ? styles.fieldInputWrapError : ''}`}>
        {icon && (
          <span className={styles.fieldIcon} aria-hidden="true">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          className={styles.fieldInput}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.fieldEyeBtn}
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
            tabIndex={0}
          >
            {showPass ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className={styles.fieldError} role="alert">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${id}-hint`} className={styles.fieldHint}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   Форма «Вход»
   ============================================================ */
function LoginForm({ onSuccess }) {
  const uid        = useId();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  function validate() {
    const e = {};
    if (!email.trim())            e.email    = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Некорректный email';
    if (!password)                e.password = 'Введите пароль';
    else if (password.length < 6) e.password = 'Минимум 6 символов';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    /* Имитируем асинхронный запрос */
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Форма входа"
    >
      <FormField
        id={`${uid}-email`}
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<MailIcon />}
        required
        autoComplete="email"
        error={errors.email}
      />

      <FormField
        id={`${uid}-password`}
        label="Пароль"
        type="password"
        placeholder="Введите пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<LockIcon />}
        required
        autoComplete="current-password"
        error={errors.password}
      />

      <div className={styles.formFooterRow}>
        <label className={styles.rememberLabel}>
          <input type="checkbox" className={styles.rememberCheck} />
          <span className={styles.rememberBox}><CheckIcon /></span>
          <span className={styles.rememberText}>Запомнить меня</span>
        </label>
        <a href="#" className={styles.forgotLink}>Забыли пароль?</a>
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <span className={styles.submitBtnLoader} aria-label="Загрузка" />
        ) : (
          'Войти в аккаунт'
        )}
      </button>
    </form>
  );
}

/* ============================================================
   Форма «Регистрация»
   ============================================================ */
function RegisterForm({ onSuccess }) {
  const uid          = useId();
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [agreed, setAgreed]       = useState(false);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);

  /* Расчёт надёжности пароля */
  function getPasswordStrength(p) {
    if (!p)           return { level: 0, label: '',        color: '#e5e7eb' };
    if (p.length < 6) return { level: 1, label: 'Слабый',  color: '#ef4444' };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/\d/.test(p))
                      return { level: 2, label: 'Средний', color: '#f59e0b' };
    return             { level: 3, label: 'Надёжный',      color: '#10b981' };
  }

  const strength = getPasswordStrength(password);

  function validate() {
    const e = {};
    if (!name.trim())                  e.name     = 'Введите имя';
    if (!email.trim())                 e.email    = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Некорректный email';
    if (!password)                     e.password = 'Введите пароль';
    else if (password.length < 6)      e.password = 'Минимум 6 символов';
    if (password !== confirm)          e.confirm  = 'Пароли не совпадают';
    if (!agreed)                       e.agreed   = 'Необходимо согласие';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1400);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Форма регистрации"
    >
      <FormField
        id={`${uid}-name`}
        label="Имя"
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={<UserIcon />}
        required
        autoComplete="name"
        error={errors.name}
      />

      <FormField
        id={`${uid}-email`}
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<MailIcon />}
        required
        autoComplete="email"
        error={errors.email}
      />

      <FormField
        id={`${uid}-password`}
        label="Пароль"
        type="password"
        placeholder="Придумайте пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<LockIcon />}
        required
        autoComplete="new-password"
        error={errors.password}
      />

      {/* Полоса надёжности пароля */}
      {password && (
        <div className={styles.strengthWrap} aria-label={`Надёжность пароля: ${strength.label}`}>
          <div className={styles.strengthBars}>
            {[1, 2, 3].map((lvl) => (
              <div
                key={lvl}
                className={styles.strengthBar}
                style={{
                  backgroundColor: lvl <= strength.level ? strength.color : '#e5e7eb',
                }}
              />
            ))}
          </div>
          <span className={styles.strengthLabel} style={{ color: strength.color }}>
            {strength.label}
          </span>
        </div>
      )}

      <FormField
        id={`${uid}-confirm`}
        label="Подтвердите пароль"
        type="password"
        placeholder="Повторите пароль"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        icon={<LockIcon />}
        required
        autoComplete="new-password"
        error={errors.confirm}
      />

      {/* Чекбокс согласия */}
      <div className={styles.agreeWrap}>
        <label className={`${styles.agreeLabel} ${errors.agreed ? styles.agreeLabelError : ''}`}>
          <input
            type="checkbox"
            className={styles.agreeCheck}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            aria-invalid={!!errors.agreed}
          />
          <span className={`${styles.agreeBox} ${agreed ? styles.agreeBoxChecked : ''}`}>
            {agreed && <CheckIcon />}
          </span>
          <span className={styles.agreeText}>
            Я согласен с{' '}
            <a href="#" className={styles.agreeLink}>условиями использования</a>
            {' '}и{' '}
            <a href="#" className={styles.agreeLink}>политикой конфиденциальности</a>
          </span>
        </label>
        {errors.agreed && (
          <p className={styles.fieldError} role="alert">{errors.agreed}</p>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <span className={styles.submitBtnLoader} aria-label="Загрузка" />
        ) : (
          'Создать аккаунт'
        )}
      </button>
    </form>
  );
}

/* ============================================================
   Auth (главный компонент страницы)
   ============================================================ */
function Auth() {
  const navigate = useNavigate();
  /* 'login' | 'register' */
  const [activeTab, setActiveTab] = useState('login');
  const [success, setSuccess]     = useState(false);

  function handleSuccess() {
    setSuccess(true);
    setTimeout(() => navigate('/'), 2000);
  }

  return (
    <div className={styles.page}>
      {/* Декоративные орбы на фоне */}
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />

      <div className={styles.container}>

        {/* Логотип */}
        <Link to="/" className={styles.logoLink} aria-label="CityPulse — на главную">
          <span className={styles.logoDark}>City</span>
          <span className={styles.logoOrange}>Pulse</span>
        </Link>

        {/* Карточка формы */}
        <div className={styles.card}>

          {/* ===== Успешное состояние ===== */}
          {success ? (
            <div className={styles.successState}>
              <div className={styles.successIcon} aria-hidden="true">🎉</div>
              <h2 className={styles.successTitle}>
                {activeTab === 'login' ? 'Добро пожаловать!' : 'Аккаунт создан!'}
              </h2>
              <p className={styles.successText}>
                Перенаправляем на главную страницу…
              </p>
              <div className={styles.successSpinner} aria-label="Загрузка" />
            </div>
          ) : (
            <>
              {/* ===== Шапка с табами ===== */}
              <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>
                  {activeTab === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
                </h1>
                <p className={styles.cardSubtitle}>
                  {activeTab === 'login'
                    ? 'Войдите, чтобы покупать билеты и сохранять события'
                    : 'Создайте аккаунт — это быстро и бесплатно'}
                </p>
              </div>

              {/* Анимированные табы */}
              <div className={styles.tabs} role="tablist" aria-label="Переключение режима">
                <div
                  className={styles.tabsSlider}
                  style={{
                    transform: activeTab === 'login'
                      ? 'translateX(0)'
                      : 'translateX(100%)',
                  }}
                  aria-hidden="true"
                />
                <button
                  className={`${styles.tabBtn} ${activeTab === 'login' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('login')}
                  role="tab"
                  aria-selected={activeTab === 'login'}
                  aria-controls="panel-login"
                  id="tab-login"
                  type="button"
                >
                  Вход
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'register' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('register')}
                  role="tab"
                  aria-selected={activeTab === 'register'}
                  aria-controls="panel-register"
                  id="tab-register"
                  type="button"
                >
                  Регистрация
                </button>
              </div>

              {/* Панели с формами */}
              <div
                id="panel-login"
                role="tabpanel"
                aria-labelledby="tab-login"
                hidden={activeTab !== 'login'}
              >
                {activeTab === 'login' && (
                  <LoginForm onSuccess={handleSuccess} />
                )}
              </div>

              <div
                id="panel-register"
                role="tabpanel"
                aria-labelledby="tab-register"
                hidden={activeTab !== 'register'}
              >
                {activeTab === 'register' && (
                  <RegisterForm onSuccess={handleSuccess} />
                )}
              </div>

              {/* Разделитель «или» */}
              <div className={styles.dividerOr}>
                <span className={styles.dividerOrLine} aria-hidden="true" />
                <span className={styles.dividerOrText}>или</span>
                <span className={styles.dividerOrLine} aria-hidden="true" />
              </div>

              {/* Кнопка Google (заглушка) */}
              <button
                type="button"
                className={styles.oauthBtn}
                aria-label="Войти через Google"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                <span>Продолжить с Google</span>
              </button>

              {/* Подсказка переключения */}
              <p className={styles.switchHint}>
                {activeTab === 'login' ? (
                  <>Нет аккаунта?{' '}
                    <button
                      type="button"
                      className={styles.switchBtn}
                      onClick={() => setActiveTab('register')}
                    >
                      Зарегистрироваться
                    </button>
                  </>
                ) : (
                  <>Уже есть аккаунт?{' '}
                    <button
                      type="button"
                      className={styles.switchBtn}
                      onClick={() => setActiveTab('login')}
                    >
                      Войти
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;