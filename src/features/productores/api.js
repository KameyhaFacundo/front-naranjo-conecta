import { apiClient } from '../../shared/api/client.js'

export function listarProductores(params = {}) {
  return apiClient.get('/productores', { params }).then((res) => res.data)
}

export function crearProductor(data) {
  return apiClient.post('/productores', data).then((res) => res.data)
}
