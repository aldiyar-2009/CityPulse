# 🎉 CityPulse — Городская Афиша

**CityPulse** — это веб-приложение городской афиши, где пользователи могут просматривать события (концерты, выставки, спорт и т.д.), покупать билеты, добавлять события в избранное и управлять своим профилем.

## 👤 Автор

Проект разработан в рамках курсового проекта по дисциплине **ПМ04 — Проектирование и обеспечение бесперебойной работы web-сайта**.

---

## 🛠 Стек технологий

| Слой | Технологии |
|------|-----------|
| Frontend | React 19, React Router v7, CSS Modules, Vite |
| Backend | Node.js, Express.js |
| База данных | MongoDB (Mongoose ODM) |
| Аутентификация | JWT (jsonwebtoken), bcryptjs |
| Инструменты | ESLint, Git |

---

## ⚡ Функциональность

- 🔐 Регистрация и вход (JWT-аутентификация)
- 🎫 Просмотр и покупка билетов на события
- ❤️ Избранное
- 👤 Профиль пользователя и настройки аккаунта
- 💳 Кошелёк (пополнение баланса)
- 🗓️ Мои билеты
- 🔒 Панель администратора (CRUD событий)
- 🔍 Поиск и фильтрация каталога
- 📱 Адаптивный дизайн (mobile-first)
- 🚨 Обработка ошибок и 404-страница

---

## 🚀 Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/<username>/city_pulse.git
cd city_pulse
```

### 2. Установка зависимостей (Frontend)

```bash
npm install
```

### 3. Установка зависимостей (Backend)

```bash
cd server
npm install
```

### 4. Настройка переменных окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp server/.env.example server/.env
```

Пример `.env`:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/citypulse
JWT_SECRET=supersecretkey123
ADMIN_SECRET_KEY=adminkey456
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### 5. Запуск сервера (Backend)

```bash
cd server
npm run dev
```

Сервер запустится на `http://localhost:5000`.

### 6. Запуск клиента (Frontend)

В корне проекта:

```bash
npm run dev
```

Приложение откроется на `http://localhost:5173`.

---

## 📡 API Документация

### Аутентификация (`/api/auth`)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/register` | Регистрация нового пользователя |
| POST | `/api/auth/login` | Вход в систему |

**Пример запроса — Регистрация:**
```json
POST /api/auth/register
{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "password": "password123",
  "city": "Astana"
}
```

**Пример ответа:**
```json
{
  "_id": "65abc...",
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "role": "user",
  "token": "eyJhbGci..."
}
```

---

### Пользователи (`/api/users`) 🔐 требуется Bearer токен

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/users/profile` | Получить профиль текущего пользователя |
| PATCH | `/api/users/profile` | Обновить профиль |
| POST | `/api/users/balance` | Пополнить баланс |

---

### События (`/api/events`)

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/events` | Список всех событий | Публичный |
| GET | `/api/events/:id` | Одно событие по ID | Публичный |
| POST | `/api/events/purchase` | Купить билет | 🔐 Пользователь |
| POST | `/api/events/favorite` | Добавить/убрать из избранного | 🔐 Пользователь |
| POST | `/api/events` | Создать событие | 🔐 Администратор |
| PUT | `/api/events/:id` | Обновить событие | 🔐 Администратор |
| DELETE | `/api/events/:id` | Удалить событие | 🔐 Администратор |

**Query-параметры GET `/api/events`:**
- `category` — фильтр по категории (Концерты, Спорт, …)
- `featured=true` — только избранные события
- `limit` — ограничить количество результатов

---

## 📁 Структура проекта

```
city_pulse/
├── src/                        # Frontend (React)
│   ├── components/             # Переиспользуемые компоненты
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── EventCard/
│   │   ├── LoadingSpinner/     # Индикатор загрузки
│   │   ├── Toast/              # Уведомления
│   │   └── ...
│   ├── context/                # React Context (состояние)
│   │   ├── AuthContext.jsx
│   │   ├── BalanceContext.jsx
│   │   └── ...
│   ├── hooks/                  # Кастомные хуки
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   ├── pages/                  # Страницы приложения
│   │   ├── Home/
│   │   ├── Catalog/
│   │   ├── Event/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Profile/
│   │   ├── Admin/
│   │   ├── NotFound/           # 404-страница
│   │   └── ...
│   └── services/
│       └── api.js              # HTTP-клиент
│
└── server/                     # Backend (Node.js)
    ├── config/
    │   └── database.js         # Подключение к MongoDB
    ├── controllers/            # Бизнес-логика
    │   ├── authController.js
    │   ├── eventController.js
    │   └── userController.js
    ├── middleware/
    │   └── auth.js             # JWT-middleware
    ├── models/                 # Mongoose-модели
    │   ├── Event.js
    │   └── User.js
    ├── routes/                 # Express-роуты
    └── server.js               # Точка входа
```

---

## 🧪 Тестирование

### Ручное тестирование (Postman)

Импортируйте коллекцию или выполните запросы вручную:

1. **Регистрация:** `POST http://localhost:5000/api/auth/register`
2. **Вход:** `POST http://localhost:5000/api/auth/login` → скопируйте `token`
3. **Авторизованный запрос:** добавьте заголовок `Authorization: Bearer <token>`
4. **Получить события:** `GET http://localhost:5000/api/events`

### Браузерное тестирование

Проверено в браузерах: **Chrome**, **Firefox**, **Edge**.

---

## 🌐 Деплой

Проект готов к деплою:
- **Frontend:** [Vercel](https://vercel.com) / [Netlify](https://netlify.com)
- **Backend:** [Render](https://render.com) / [Railway](https://railway.app)
- **База данных:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

При деплое укажите переменную `FRONTEND_URL` в `.env` сервера для корректной настройки CORS.

---

## 📸 Скриншоты

> Главная страница с баннером избранных событий, каталог с фильтрами, страница события, профиль пользователя, панель администратора.
