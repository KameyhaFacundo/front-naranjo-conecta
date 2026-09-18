import 'leaflet/dist/leaflet.css'
import { AttributionControl, MapContainer, Marker, TileLayer } from 'react-leaflet'
import { CAPAS_BASE } from '../../features/mapa/capasBase.js'
import { iconoDeCapa } from '../../features/mapa/marcadores.js'
import Icon from './Icon.jsx'

const { url, attribution, maxZoom, maxNativeZoom } = CAPAS_BASE.satelite

/** Mini-mapa de la ficha de detalle: dónde queda y un botón para ir con Google Maps. */
export default function MapaUbicacion({ lat, lng, moduloKey }) {
  const destino = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div className="detalle-mapa">
      <MapContainer
        center={[lat, lng]}
        zoom={17}
        maxZoom={maxZoom}
        scrollWheelZoom={false}
        className="detalle-mapa-lienzo"
        attributionControl={false}
      >
        <TileLayer attribution={attribution} url={url} maxZoom={maxZoom} maxNativeZoom={maxNativeZoom} />
        <AttributionControl position="bottomright" prefix={false} />
        <Marker position={[lat, lng]} icon={iconoDeCapa(moduloKey)} />
      </MapContainer>
      <a className="btn detalle-mapa-llegar" href={destino} target="_blank" rel="noopener noreferrer">
        <Icon name="mapa" size={17} /> Cómo llegar
      </a>
    </div>
  )
}
