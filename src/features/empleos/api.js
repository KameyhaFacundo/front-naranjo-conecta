import { apiClient } from '../../shared/api/client.js'

export function listarEmpleos(params = {}) {
  return apiClient.get('/empleos', { params }).then((res) => res.data)
}

export function crearEmpleo(data) {
  return apiClient.post('/empleos', data).then((res) => res.data)
}
