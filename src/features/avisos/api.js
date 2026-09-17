import { apiClient } from '../../shared/api/client.js'
import { mockAvisos, paginar, USE_MOCKS } from '../../mock.js'

export function listarAvisos(params = {}) {
  if (USE_MOCKS) return Promise.resolve(paginar(mockAvisos, params))
  return apiClient.get('/avisos', { params }).then((res) => res.data)
}

export function crearAviso(data) {
  return apiClient.post('/avisos', data).then((res) => res.data)
}
