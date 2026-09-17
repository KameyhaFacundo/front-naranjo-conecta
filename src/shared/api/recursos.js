import { apiClient } from './client.js'

// CRUD genérico sobre un recurso (usado por el panel admin y "Mis publicaciones").
export function crearRecurso(ruta, data) {
  return apiClient.post(ruta, data).then((res) => res.data)
}

export function actualizarRecurso(ruta, id, data) {
  return apiClient.put(`${ruta}/${id}`, data).then((res) => res.data)
}

export function eliminarRecurso(ruta, id) {
  return apiClient.delete(`${ruta}/${id}`)
}
