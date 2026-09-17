import { apiClient } from '../../shared/api/client.js'
import { buscarPorId, MODULOS_MOCK, USE_MOCKS } from '../../mock.js'

export function obtenerPublicacion(modulo, id) {
  if (USE_MOCKS) {
    const item = buscarPorId(MODULOS_MOCK[modulo] ?? [], id)
    return item ? Promise.resolve(item) : Promise.reject(new Error('No encontrado'))
  }
  return apiClient.get(`/${modulo}/${id}`).then((res) => res.data.data ?? res.data)
}
