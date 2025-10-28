import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { createApiClient } from '../lib/api.js'

export default function Dashboard() {
  const { user, token, setToken, setUser } = useAuth()
  const api = useMemo(() => createApiClient(() => token), [token])
  const [tasks, setTasks] = useState([])
  const [msg, setMsg] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'pending' })

  async function loadTasks() {
    try {
      const { data } = await api.get('/tasks')
      setTasks(data.data)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to fetch tasks')
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function createTask(e) {
    e.preventDefault()
    setMsg(null)
    try {
      await api.post('/tasks', form)
      setForm({ title: '', description: '', status: 'pending' })
      loadTasks()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to create')
    }
  }

  async function updateTask(id, update) {
    setMsg(null)
    try {
      await api.put(`/tasks/${id}`, update)
      loadTasks()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update')
    }
  }

  async function deleteTask(id) {
    setMsg(null)
    try {
      await api.delete(`/tasks/${id}`)
      loadTasks()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to delete')
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <div className="grid">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 className="title">Dashboard</h2>
        <button className="btn ghost" onClick={logout}>Logout</button>
      </div>
      <div className="muted">Logged in as {user?.name} ({user?.role})</div>
      {msg && <div className="msg error">{msg}</div>}

      <div className="card">
        <h3 className="title">Create Task</h3>
        <form onSubmit={createTask} className="grid" style={{ maxWidth: 520 }}>
          <div className="field">
            <label className="muted">Title</label>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="field">
            <label className="muted">Description</label>
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="row">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
            </select>
            <button className="btn" type="submit">Add</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="title">Tasks</h3>
        <ul className="list grid">
          {tasks.map((t) => (
            <li key={t._id} className="item">
              <div className="itemHead">
                {editingId === t._id ? (
                  <input value={editForm.title} onChange={(e)=>setEditForm({ ...editForm, title: e.target.value })} />
                ) : (
                  <strong>{t.title}</strong>
                )}
                <span className="chip">{editingId === t._id ? (
                  <select value={editForm.status} onChange={(e)=>setEditForm({ ...editForm, status: e.target.value })}>
                    <option value="pending">pending</option>
                    <option value="in_progress">in_progress</option>
                    <option value="completed">completed</option>
                  </select>
                ) : (
                  t.status
                )}</span>
              </div>
              <div className="muted">
                {editingId === t._id ? (
                  <input value={editForm.description} onChange={(e)=>setEditForm({ ...editForm, description: e.target.value })} />
                ) : (
                  t.description
                )}
              </div>
              <div className="row" style={{ marginTop: 8 }}>
                {editingId === t._id ? (
                  <>
                    <button className="btn success" onClick={async()=>{ await updateTask(t._id, editForm); setEditingId(null) }}>Save</button>
                    <button className="btn ghost" onClick={()=>setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn" onClick={()=>{ setEditingId(t._id); setEditForm({ title: t.title, description: t.description || '', status: t.status }) }}>Edit</button>
                    <button className="btn" onClick={() => updateTask(t._id, { status: 'completed' })}>Mark completed</button>
                    <button className="btn danger" onClick={() => deleteTask(t._id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


