import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function UnauthRoute({ children }) {
  const { token } = useAuth()
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Site />
    </AuthProvider>
  )
}

function Site(){
  const { token } = useAuth()
  return (
    <>
      <div className="navbar">
        <div className="brand">Pramitrade</div>
        <div className="navlinks">
          <Link className="link" to="/">Home</Link>
          {!token && <Link className="link" to="/login">Login</Link>}
          {!token && <Link className="link" to="/register">Register</Link>}
          {token && <Link className="link" to="/dashboard">Dashboard</Link>}
        </div>
      </div>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UnauthRoute><Login /></UnauthRoute>} />
          <Route path="/register" element={<UnauthRoute><Register /></UnauthRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

function Home(){
  const { token } = useAuth()
  if (token) return <Navigate to="/dashboard" replace />
  return <div className="card"><h2 className="title">Welcome</h2><p className="muted">A colorful Advance Task Management System</p></div>
}


