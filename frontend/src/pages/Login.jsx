import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { createApiClient } from '../lib/api.js'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState(null)
  const navigate = useNavigate()
  const { setToken, setUser } = useAuth()
  const api = createApiClient()

  async function onSubmit(e) {
    e.preventDefault()
    setMsg(null)
    try {
      const { data } = await api.post('/auth/login', form)
      setToken(data.data.token)
      setUser(data.data.user)
      navigate('/dashboard')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="grid" style={{ maxWidth: 480 }}>
      <div className="card">
        <h2 className="title">Login</h2>
        {msg && <div className="msg error">{msg}</div>}
        <form onSubmit={onSubmit} className="grid">
          <div className="field">
            <label className="muted">Email</label>
            <input placeholder="you@example.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label className="muted">Password</label>
            <input placeholder="••••••••" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}


