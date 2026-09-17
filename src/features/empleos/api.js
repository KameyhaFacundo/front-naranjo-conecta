import { apiClient } from '../../shared/api/client.js'
import { mockEmpleos, paginar, USE_MOCKS } from '../../mock.js'

export function listarEmpleos(params = {}) {
  if (USE_MOCKS) return Promise.resolve(paginar(mockEmpleos, params))
  return apiClient.get('/empleos', { params }).then((res) => res.data)
}

export function crearEmpleo(data) {
  return apiClient.post('/empleos', data).then((res) => res.data)
}
