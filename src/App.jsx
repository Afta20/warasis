import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { initializeData } from './data/store'
import Landing from './pages/Landing'
import Login from './pages/Login'
import War from './pages/War'
import Admin from './pages/Admin'

// Initialize data on first load
initializeData()

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/war" element={<War />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
