import { apiClient } from '../../shared/api/client.js'

export function listarInstituciones(params = {}) {
  return apiClient.get('/instituciones', { params }).then((res) => res.data)
}

export function crearInstitucion(data) {
  return apiClient.post('/instituciones', data).then((res) => res.data)
}
