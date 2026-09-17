import { apiClient } from '../../shared/api/client.js'
import { mockInstituciones, paginar, USE_MOCKS } from '../../mock.js'

export function listarInstituciones(params = {}) {
  if (USE_MOCKS) return Promise.resolve(paginar(mockInstituciones, params))
  return apiClient.get('/instituciones', { params }).then((res) => res.data)
}

export function crearInstitucion(data) {
  return apiClient.post('/instituciones', data).then((res) => res.data)
}
