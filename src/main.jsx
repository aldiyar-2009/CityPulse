import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BalanceProvider } from './context/BalanceContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { MyTicketsProvider } from './context/MyTicketsContext'
import { CommentsProvider } from './context/CommentsContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BalanceProvider>
          <CommentsProvider>
            <FavoritesProvider>
              <MyTicketsProvider>
                <App />
              </MyTicketsProvider>
            </FavoritesProvider>
          </CommentsProvider>
        </BalanceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
