import { apiClient } from '../../shared/api/client.js'

// El panel admin lista a través de /admin/<recurso> para ver también lo oculto.
export function listarAdmin(ruta, params = {}) {
  return apiClient.get(ruta, { params }).then((res) => res.data)
}
