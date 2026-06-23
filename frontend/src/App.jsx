import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Monitor from './pages/Monitor.jsx'
import DeviceLink from './pages/DeviceLink.jsx'
import Registers from './pages/Registers.jsx'
import Alarms from './pages/Alarms.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/monitor" replace />} />

        <Route
          path="/monitor"
          element={
            <ProtectedRoute>
              <Monitor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/device-link"
          element={
            <ProtectedRoute>
              <DeviceLink />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registers"
          element={
            <ProtectedRoute>
              <Registers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alarms"
          element={
            <ProtectedRoute>
              <Alarms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
