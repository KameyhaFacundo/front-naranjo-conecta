import L from 'leaflet'

const COLOR_POR_CAPA = {
  comercios: 'var(--naranja)',
  servicios: 'var(--verde-hoja)',
  instituciones: 'var(--naranja-quemado)',
  reclamos: 'var(--rojo-alerta)',
}

function pinSvg(color) {
  return `<svg width="30" height="30" viewBox="0 0 24 24">
    <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12Z" fill="${color}" />
    <circle cx="12" cy="9" r="3.1" fill="var(--papel)" />
  </svg>`
}

/** Ícono de mapa color-codeado por capa (comercios, servicios, instituciones, reclamos). */
export function iconoDeCapa(clave) {
  return L.divIcon({
    html: pinSvg(COLOR_POR_CAPA[clave] ?? 'var(--tierra-suave)'),
    className: 'marcador-mapa',
    iconSize: [30, 30],
    iconAnchor: [15, 29],
    popupAnchor: [0, -26],
  })
}

export function colorDeCapa(clave) {
  return COLOR_POR_CAPA[clave] ?? 'var(--tierra-suave)'
}
