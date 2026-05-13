import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export const feedbackApi = {
  getAll: (params = {}) =>
    client.get('/feedback', { params }).then((r) => r.data),

  getById: (id) =>
    client.get(`/feedback/${id}`).then((r) => r.data),

  create: (payload) =>
    client.post('/feedback', payload).then((r) => r.data),

  update: (id, payload) =>
    client.put(`/feedback/${id}`, payload).then((r) => r.data),

  remove: (id) =>
    client.delete(`/feedback/${id}`),

  search: (params = {}) =>
    client.get('/feedback/search/query', { params }).then((r) => r.data),

  getStats: () =>
    client.get('/feedback/stats').then((r) => r.data),

  getAnalytics: () =>
    client.get('/feedback/analytics').then((r) => r.data),
}
