import { apiClient } from '../../shared/api/client.js'
import { mockComercios, paginar, USE_MOCKS } from '../../mock.js'

export function listarComercios(params = {}) {
  if (USE_MOCKS) return Promise.resolve(paginar(mockComercios, params))
  return apiClient.get('/comercios', { params }).then((res) => res.data)
}

export function crearComercio(data) {
  return apiClient.post('/comercios', data).then((res) => res.data)
}
