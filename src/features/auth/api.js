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
  // AuthController::me() devuelve el UserResource directo, así que Laravel
  // lo envuelve en {data: ...} (a diferencia de login/register, que arman
  // la respuesta a mano). Mismo desenvuelto que se usa en detalle/api.js.
  return apiClient.get('/auth/me').then((res) => res.data.data ?? res.data)
}

export function actualizarPerfil(data) {
  return apiClient.put('/auth/perfil', data).then((res) => res.data.data ?? res.data)
}
