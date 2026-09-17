import { apiClient } from '../../shared/api/client.js'

// El panel admin lista a través de /admin/<recurso> para ver también lo oculto.
export function listarAdmin(ruta, params = {}) {
  return apiClient.get(ruta, { params }).then((res) => res.data)
}

export function obtenerResumen() {
  return apiClient.get('/admin/resumen').then((res) => res.data)
}

export function listarUsuarios(params = {}) {
  return apiClient.get('/admin/usuarios', { params }).then((res) => res.data)
}

export function verUsuario(id) {
  return apiClient.get(`/admin/usuarios/${id}`).then((res) => res.data.data ?? res.data)
}

export function actualizarUsuario(id, data) {
  return apiClient.patch(`/admin/usuarios/${id}`, data).then((res) => res.data)
}

export function resetearPassword(id, password) {
  return apiClient.post(`/admin/usuarios/${id}/password`, { password }).then((res) => res.data)
}

export function eliminarUsuario(id) {
  return apiClient.delete(`/admin/usuarios/${id}`)
}
