import { apiClient } from '../../shared/api/client.js'

export function obtenerPublicacion(modulo, id) {
  return apiClient.get(`/${modulo}/${id}`).then((res) => res.data.data ?? res.data)
}
