// ============================================================
// PrivateRoute.jsx — защищённый маршрут
//
// Как работает:
//   1. Берём currentUser из AuthContext
//   2. Если пользователь НЕ авторизован → редиректим на /login
//   3. Если авторизован → рендерим дочерний компонент (children)
//
// Использование в App.jsx:
//   <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
// ============================================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function PrivateRoute({ children }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    // replace — чтобы нельзя было вернуться назад через кнопку браузера
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
