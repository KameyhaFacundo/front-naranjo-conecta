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
