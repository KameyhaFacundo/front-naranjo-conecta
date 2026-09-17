import { apiClient } from '../../shared/api/client.js'

export function login(credentials) {
  return apiClient.post('/auth/login', credentials).then((res) => res.data)
}

export function register(data) {
  return apiClient.post('/auth/register', data).then((res) => res.data)
}

export function logout() {
  return apiClient.post('/auth/logout')
}

export function me() {
  return apiClient.get('/auth/me').then((res) => res.data)
}
