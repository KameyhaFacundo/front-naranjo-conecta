import 'leaflet/dist/leaflet.css'
import { useRef, useState } from 'react'
import { AttributionControl, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { CAPAS_BASE, CENTRO_EL_NARANJO } from '../../features/mapa/capasBase.js'
import Icon from './Icon.jsx'

const { url, attribution, maxZoom, maxNativeZoom } = CAPAS_BASE.satelite

// Redondeado a ~3 decimales (unos 100m) para que quede una ubicación
// aproximada, nunca el domicilio exacto (ver notas de privacidad del README).
function aproximar(valor) {
  return Math.round(valor * 1000) / 1000
}

function ClicksDelMapa({ onElegir }) {
  useMapEvents({
    click(e) {
      onElegir(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function EnlaceDelMapa({ mapRef }) {
  mapRef.current = useMap()
  return null
}

/**
 * Mapa donde el vecino toca (o arrastra el marcador) para indicar dónde
 * queda su comercio, oficio o el problema que reporta. Satélite por
 * defecto: en un pueblo chico, ver el techo de la casa ubica mejor que
 * ver el nombre de la calle.
 */
export default function SelectorUbicacion({ lat, lng, onChange }) {
  const [ubicando, setUbicando] = useState(false)
  const mapRef = useRef(null)
  const posicion = lat && lng ? [lat, lng] : null

  function elegir(la, ln) {
    onChange(aproximar(la), aproximar(ln))
  }

  function usarMiUbicacion() {
    if (!navigator.geolocation) return
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        elegir(pos.coords.latitude, pos.coords.longitude)
        mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 17)
        setUbicando(false)
      },
      () => setUbicando(false),
    )
  }

  return (
    <div className="selector-ubicacion">
      <div className="selector-ubicacion-cabecera">
        <span>Tocá el mapa para marcar dónde queda (aproximado, no hace falta que sea exacto)</span>
        <button type="button" onClick={usarMiUbicacion} disabled={ubicando} className="btn-secundario">
          <Icon name="pin" size={15} /> {ubicando ? 'Ubicando…' : 'Usar mi ubicación'}
        </button>
      </div>

      <MapContainer
        center={posicion ?? CENTRO_EL_NARANJO}
        zoom={posicion ? 17 : 14}
        maxZoom={maxZoom}
        scrollWheelZoom={false}
        className="selector-ubicacion-mapa"
        attributionControl={false}
      >
        <TileLayer attribution={attribution} url={url} maxZoom={maxZoom} maxNativeZoom={maxNativeZoom} />
        <AttributionControl position="bottomright" prefix={false} />
        <ClicksDelMapa onElegir={elegir} />
        <EnlaceDelMapa mapRef={mapRef} />
        {posicion && (
          <Marker
            position={posicion}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat: la, lng: ln } = e.target.getLatLng()
                elegir(la, ln)
              },
            }}
          />
        )}
      </MapContainer>

      <p className="selector-ubicacion-nota">
        {posicion
          ? 'Ubicación guardada ✓ — podés arrastrar el marcador para ajustarla.'
          : 'Todavía no marcaste la ubicación. Es opcional, pero ayuda a que te encuentren en el mapa.'}
      </p>
    </div>
  )
}
