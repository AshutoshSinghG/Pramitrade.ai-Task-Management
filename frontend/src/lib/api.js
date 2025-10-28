import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export function createApiClient(getToken) {
  const client = axios.create({ baseURL })
  client.interceptors.request.use((config) => {
    const token = getToken?.()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  return client
}


