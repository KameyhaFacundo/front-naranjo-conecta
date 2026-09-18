import { apiClient } from '../../shared/api/client.js'
import { mockComercios, mockInstituciones, mockServicios, USE_MOCKS } from '../../mock.js'

// Trae solo lo necesario para pintar el mapa (menos peso que las fichas
// completas). Los reclamos no se muestran en el mapa (son sensibles:
// nombre de zona y descripción del vecino) — el equipo comunal los
// revisa desde /reclamos, no hace falta pedirlos acá.
export function puntosDelMapa() {
  if (USE_MOCKS) {
    return Promise.resolve({
      servicios: mockServicios,
      comercios: mockComercios,
      instituciones: mockInstituciones,
    })
  }

  return Promise.all([
    apiClient.get('/servicios', { params: { per_page: 100 } }),
    apiClient.get('/comercios', { params: { per_page: 100 } }),
    apiClient.get('/instituciones', { params: { per_page: 100 } }),
  ]).then(([servicios, comercios, instituciones]) => ({
    servicios: servicios.data.data ?? [],
    comercios: comercios.data.data ?? [],
    instituciones: instituciones.data.data ?? [],
  }))
}
