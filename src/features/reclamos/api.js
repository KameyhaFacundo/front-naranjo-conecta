import { apiClient } from '../../shared/api/client.js'

export const ETIQUETAS_ESTADO = {
  pendiente: 'Pendiente',
  en_revision: 'En revisión',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
}

export function listarReclamos(params = {}) {
  return apiClient.get('/reclamos', { params }).then((res) => res.data)
}

export function crearReclamo(data) {
  return apiClient.post('/reclamos', data).then((res) => res.data)
}

export function cambiarEstadoReclamo(id, estado) {
  return apiClient.patch(`/reclamos/${id}/estado`, { estado }).then((res) => res.data)
}
