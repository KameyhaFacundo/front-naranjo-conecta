import { apiClient } from '../../shared/api/client.js'

// Trae solo lo necesario para pintar el mapa (menos peso que las fichas completas).
export function puntosDelMapa() {
  return Promise.all([
    apiClient.get('/servicios', { params: { per_page: 100 } }),
    apiClient.get('/comercios', { params: { per_page: 100 } }),
    apiClient.get('/instituciones', { params: { per_page: 100 } }),
    apiClient.get('/reclamos', { params: { per_page: 100 } }),
  ]).then(([servicios, comercios, instituciones, reclamos]) => ({
    servicios: servicios.data.data ?? [],
    comercios: comercios.data.data ?? [],
    instituciones: instituciones.data.data ?? [],
    reclamos: reclamos.data.data ?? [],
  }))
}
