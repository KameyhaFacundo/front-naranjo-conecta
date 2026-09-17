import { apiClient } from '../../shared/api/client.js'
import { resenasDe, USE_MOCKS } from '../../mock.js'

export function listarResenas(modulo, id) {
  if (USE_MOCKS) return Promise.resolve(resenasDe(modulo, id))
  return apiClient.get(`/${modulo}/${id}/resenas`).then((res) => res.data)
}

export function guardarResena(modulo, id, data) {
  return apiClient.post(`/${modulo}/${id}/resenas`, data).then((res) => res.data)
}

export function eliminarResena(id) {
  return apiClient.delete(`/resenas/${id}`)
}
