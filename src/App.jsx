import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'

import Home from './pages/Home/Home'
import Catalog from './pages/Catalog/Catalog'
import Event from './pages/Event/Event'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Profile from './pages/Profile/Profile'
import About from './pages/About/About'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/catalog"    element={<Catalog />} />
          <Route path="/event/:id"  element={<Event />} />
          <Route path="/about"      element={<About />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
