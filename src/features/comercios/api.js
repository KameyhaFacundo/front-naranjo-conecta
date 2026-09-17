import { apiClient } from '../../shared/api/client.js'

export function listarComercios(params = {}) {
  return apiClient.get('/comercios', { params }).then((res) => res.data)
}

export function crearComercio(data) {
  return apiClient.post('/comercios', data).then((res) => res.data)
}
