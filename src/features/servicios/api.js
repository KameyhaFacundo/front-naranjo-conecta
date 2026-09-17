import { apiClient } from '../../shared/api/client.js'

export function listarServicios(params = {}) {
  return apiClient.get('/servicios', { params }).then((res) => res.data)
}

export function crearServicio(data) {
  return apiClient.post('/servicios', data).then((res) => res.data)
}

export function actualizarServicio(id, data) {
  return apiClient.put(`/servicios/${id}`, data).then((res) => res.data)
}

export function borrarServicio(id) {
  return apiClient.delete(`/servicios/${id}`)
}
