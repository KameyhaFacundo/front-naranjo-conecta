import { apiClient } from '../../shared/api/client.js'
import { mockProductores, paginar, USE_MOCKS } from '../../mock.js'

export function listarProductores(params = {}) {
  if (USE_MOCKS) return Promise.resolve(paginar(mockProductores, params))
  return apiClient.get('/productores', { params }).then((res) => res.data)
}

export function crearProductor(data) {
  return apiClient.post('/productores', data).then((res) => res.data)
}
