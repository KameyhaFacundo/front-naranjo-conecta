import { apiClient } from '../../shared/api/client.js'
import { mockComercios, mockInstituciones, mockReclamos, mockServicios, USE_MOCKS } from '../../mock.js'

// Trae solo lo necesario para pintar el mapa (menos peso que las fichas completas).
export function puntosDelMapa() {
  if (USE_MOCKS) {
    return Promise.resolve({
      servicios: mockServicios,
      comercios: mockComercios,
      instituciones: mockInstituciones,
      reclamos: mockReclamos,
    })
  }

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
