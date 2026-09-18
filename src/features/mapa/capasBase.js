// `??` no alcanza acá: si la variable de entorno queda cargada pero vacía
// (pasó con VITE_MAPA_LAT en Vercel), el valor es "" — ni null ni
// undefined, así que "" ?? default no cae al default y Number("") da 0.
// Con eso el mapa termina centrado en [0, 0] y con zoom 0 (el mundo
// entero). `||` sí lo cubre, porque "" también es falsy.
function numEnv(valor, porDefecto) {
  return Number(valor || porDefecto)
}

export const CENTRO_EL_NARANJO = [
  numEnv(import.meta.env.VITE_MAPA_LAT, -26.6619),
  numEnv(import.meta.env.VITE_MAPA_LNG, -65.0478),
]
export const ZOOM_MAPA_DEFECTO = numEnv(import.meta.env.VITE_MAPA_ZOOM, 14)

/**
 * Capas base del mapa. "Satélite" (fotografía aérea) es la que mejor
 * muestra las casas en un pueblo chico, donde OpenStreetMap muchas veces
 * no tiene los edificios trazados. "Calles" sirve para ubicarse por
 * nombre de calle cuando el barrio sí está mapeado.
 */
export const CAPAS_BASE = {
  satelite: {
    etiqueta: 'Satélite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    maxZoom: 19,
    // Esri no tiene resolución real más allá de esto en zonas rurales como
    // El Naranjo: pasado este nivel devuelve tiles de "Map data not yet
    // available". Con maxNativeZoom, Leaflet sigue dejando acercar hasta
    // maxZoom pero reusa (agrandada) la última tile real en vez de pedir
    // una que no existe.
    maxNativeZoom: 17,
  },
  calles: {
    etiqueta: 'Calles',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
}
