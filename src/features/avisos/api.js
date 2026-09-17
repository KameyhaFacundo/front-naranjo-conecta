import { apiClient } from '../../shared/api/client.js'

export function listarAvisos(params = {}) {
  return apiClient.get('/avisos', { params }).then((res) => res.data)
}

export function crearAviso(data) {
  return apiClient.post('/avisos', data).then((res) => res.data)
}
