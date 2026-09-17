import { apiClient } from '../../shared/api/client.js'

export function listarMisPublicaciones() {
  return apiClient.get('/mis-publicaciones').then((res) => res.data)
}
