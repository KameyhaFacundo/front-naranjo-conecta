import { apiClient } from '../../shared/api/client.js'
import { mockComercios, mockInstituciones, mockReclamos, mockServicios, USE_MOCKS } from '../../mock.js'

// Trae solo lo necesario para pintar el mapa (menos peso que las fichas
// completas). Los reclamos solo los ve el equipo comunal: si `esAdmin` es
// false ni se piden, para no traer al navegador algo que no se va a
// mostrar (el backend real también tiene que exigir el rol, esto solo
// evita el viaje de más del lado del cliente).
export function puntosDelMapa(esAdmin = false) {
  if (USE_MOCKS) {
    return Promise.resolve({
      servicios: mockServicios,
      comercios: mockComercios,
      instituciones: mockInstituciones,
      reclamos: esAdmin ? mockReclamos : [],
    })
  }

  return Promise.all([
    apiClient.get('/servicios', { params: { per_page: 100 } }),
    apiClient.get('/comercios', { params: { per_page: 100 } }),
    apiClient.get('/instituciones', { params: { per_page: 100 } }),
    esAdmin ? apiClient.get('/reclamos', { params: { per_page: 100 } }) : Promise.resolve({ data: { data: [] } }),
  ]).then(([servicios, comercios, instituciones, reclamos]) => ({
    servicios: servicios.data.data ?? [],
    comercios: comercios.data.data ?? [],
    instituciones: instituciones.data.data ?? [],
    reclamos: reclamos.data.data ?? [],
  }))
}
