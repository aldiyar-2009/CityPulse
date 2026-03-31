# 🚀 CityPulse - Полная установка

## 📦 Структура проекта:

```
city_pulse/
├── src/                    # Frontend (React + Vite)
│   ├── components/
│   ├── context/           # API-интегрированные контексты
│   ├── pages/
│   ├── services/          # API сервис
│   │   └── api.js        # Все запросы к бэкенду
│   ├── App.jsx
│   └── main.jsx
│
└── server/                 # Backend (Node.js + Express + MongoDB)
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── .env              # Настройки MongoDB
    └── server.js
```

---

## 🔧 Установка и запуск:

### Шаг 1: Установка зависимостей

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

---

### Шаг 2: Запуск проекта

Откройте **ДВА терминала**:

**Терминал 1 - Backend:**
```bash
cd server
npm run dev
```
Сервер запустится на `http://localhost:5000`

**Терминал 2 - Frontend:**
```bash
npm run dev
```
Фронтенд запустится на `http://localhost:5173`

---

## ✅ Что уже настроено:

### Backend:
- ✅ MongoDB Atlas подключена
- ✅ JWT аутентификация
- ✅ Регистрация/Вход
- ✅ Управление профилем
- ✅ Пополнение баланса
- ✅ Покупка билетов
- ✅ Избранное
- ✅ Админ-панель (создание/редактирование/удаление событий)

### Frontend:
- ✅ Интеграция с API бэкенда
- ✅ AuthContext - работает с JWT токенами
- ✅ BalanceContext - синхронизация баланса с БД
- ✅ FavoritesContext - избранное через API
- ✅ MyTicketsContext - покупки через API
- ✅ Все импорты исправлены

---

## 🧪 Тестирование:

### 1. Регистрация
- Откройте `http://localhost:5173/register`
- Заполните форму
- Данные сохранятся в MongoDB

### 2. Вход
- Откройте `http://localhost:5173/login`
- Введите email и пароль
- Получите JWT токен

### 3. Просмотр событий
- События загружаются из MongoDB
- Можно добавить в избранное (API)

### 4. Покупка билета
- Пополните баланс через `/wallet`
- Купите билет на событие
- Баланс обновится в БД

---

## 🔑 API Endpoints (используются фронтендом):

### Авторизация:
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход

### Пользователь:
- `GET /api/users/profile` - Профиль
- `PATCH /api/users/profile` - Обновить профиль
- `POST /api/users/balance` - Пополнить баланс

### События:
- `GET /api/events` - Все события
- `GET /api/events/:id` - Одно событие
- `POST /api/events/purchase` - Купить билет
- `POST /api/events/favorite` - Избранное

### Админ (только для админов):
- `POST /api/events` - Создать событие
- `PUT /api/events/:id` - Обновить
- `DELETE /api/events/:id` - Удалить

---

## 📝 Как работает интеграция:

### Регистрация (пример):
```javascript
// Frontend (Register.jsx)
const handleSubmit = async (e) => {
  e.preventDefault();
  await register(username, email, password, city, phone);
  // ↓
  // AuthContext.jsx
  const data = await authAPI.register({ name, email, password, city, phone });
  // ↓
  // services/api.js
  fetch('http://localhost:5000/api/auth/register', { method: 'POST', ... })
  // ↓
  // Backend (server/controllers/authController.js)
  // Сохранение пользователя в MongoDB
};
```

---

## 🐛 Troubleshooting:

### Backend не запускается:
```bash
cd server
npm install
npm run dev
```

### Frontend не находит API:
Убедитесь что backend запущен на порту 5000.

### CORS ошибки:
Backend уже настроен для работы с `localhost:5173`

---

## 🎉 ГОТОВО!

Проект полностью интегрирован! 

**Запустите:**
```bash
# Терминал 1
cd server
npm run dev

# Терминал 2 (новое окно)
npm run dev
```

Откройте `http://localhost:5173` и пользуйтесь! 🚀
