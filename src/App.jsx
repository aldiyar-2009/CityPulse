import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home     from './pages/Home';
import Catalog  from './pages/Catalog';
import EventPage from './pages/EventPage';
import Admin    from './pages/Admin';
import Auth     from './pages/Auth';

/* ---------- App ---------- */
function App() {
  return (
    <BrowserRouter>
      {/*
        Navbar фиксирован сверху (position: fixed в CSS-модуле).
        Он находится вне <Routes>, поэтому отображается на всех страницах.
      */}
      <Navbar />

      {/*
        Основной контент располагается ниже навбара.
        Отступ задан через padding-top в #root (index.css),
        но дополнительный <main> обеспечивает семантику и
        позволяет при необходимости добавить общий padding/фон.
      */}
      <main className="app-main">
        <Routes>
          {/* Главная страница */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Каталог мероприятий */}
          <Route
            path="/catalog"
            element={<Catalog />}
          />

          {/* Страница конкретного мероприятия */}
          <Route
            path="/event/:id"
            element={<EventPage />}
          />

          {/* Административная панель */}
          <Route
            path="/admin"
            element={<Admin />}
          />

          {/* Страница авторизации / регистрации */}
          <Route
            path="/auth"
            element={<Auth />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;