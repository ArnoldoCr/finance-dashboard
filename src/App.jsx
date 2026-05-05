import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import PrivateRoute from './components/PrivateRoute'
import Sidebar from './components/Sidebar'

import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
//import Budget from './pages/Budget'
//import Goals from './pages/Goals'
import ImportExcel from './pages/ImportExcel'
//import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const { currentUser } = useAuth()

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={currentUser ? <Navigate to="/" replace /> : <Register />}
      />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Sidebar />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics" element={<Analytics/>} />
        {/* <Route path="budget" element={<Budget />} /> */}
        {/* <Route path="goals" element={<Goals />} /> */}
        <Route path="import" element={<ImportExcel />} />
        {/* <Route path="settings" element={<Settings />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}