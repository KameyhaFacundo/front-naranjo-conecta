import 'leaflet/dist/leaflet.css'
import { useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import CompartirButton from '../../shared/components/CompartirButton.jsx'
import Icon from '../../shared/components/Icon.jsx'
import WhatsappButton from '../../shared/components/WhatsappButton.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import { ETIQUETAS_ESTADO } from '../reclamos/api.js'
import { puntosDelMapa } from './api.js'
import { CAPAS_BASE, CENTRO_EL_NARANJO, ZOOM_MAPA_DEFECTO } from './capasBase.js'
import { colorDeCapa, iconoDeCapa, iconoMiUbicacion } from './marcadores.js'

const CAPAS = [
  { clave: 'servicios', etiqueta: 'Servicios', icono: 'herramienta' },
  { clave: 'comercios', etiqueta: 'Comercios', icono: 'tienda' },
  { clave: 'instituciones', etiqueta: 'Instituciones', icono: 'edificio' },
  { clave: 'reclamos', etiqueta: 'Reclamos', icono: 'alerta' },
]

const SIN_PUNTOS = { servicios: [], comercios: [], instituciones: [], reclamos: [] }

function EnlaceMapa({ mapRef }) {
  mapRef.current = useMap()
  return null
}

export default function MapaPage() {
  const { items: datos, cargando, error } = useListado(puntosDelMapa)
  const [capasActivas, setCapasActivas] = useState(() => new Set(CAPAS.map((c) => c.clave)))
  const [capaBase, setCapaBase] = useState('satelite')
  const [miUbicacion, setMiUbicacion] = useState(null)
  const [ubicando, setUbicando] = useState(false)
  const mapRef = useRef(null)

  const puntos = useMemo(() => {
    if (!datos || Array.isArray(datos)) return SIN_PUNTOS
    return datos
  }, [datos])

  const capasVisibles = CAPAS.filter((capa) => capasActivas.has(capa.clave))
  const totalVisible = capasVisibles.reduce((acc, capa) => acc + (puntos[capa.clave]?.length ?? 0), 0)

  function alternarCapa(clave) {
    setCapasActivas((prev) => {
      const nuevo = new Set(prev)
      nuevo.has(clave) ? nuevo.delete(clave) : nuevo.add(clave)
      return nuevo
    })
  }

  function verMiUbicacion() {
    if (!navigator.geolocation) return
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const punto = [pos.coords.latitude, pos.coords.longitude]
        setMiUbicacion(punto)
        mapRef.current?.flyTo(punto, 16)
        setUbicando(false)
      },
      () => setUbicando(false),
    )
  }

  return (
    <section>
      <header className="seccion-header">
        <h1>Mapa de El Naranjo</h1>
        <p>Comercios, servicios, instituciones y reclamos, todo en un mismo mapa.</p>
      </header>

      <div className="filtros-mapa">
        {CAPAS.map((capa) => (
          <label key={capa.clave} style={{ '--color-capa': colorDeCapa(capa.clave) }}>
            <input
              type="checkbox"
              checked={capasActivas.has(capa.clave)}
              onChange={() => alternarCapa(capa.clave)}
            />
            <Icon name={capa.icono} size={16} className="filtro-icono" /> {capa.etiqueta}
          </label>
        ))}
      </div>

      <div className="pestañas">
        {Object.entries(CAPAS_BASE).map(([clave, capa]) => (
          <button
            key={clave}
            type="button"
            className={capaBase === clave ? 'activa' : ''}
            onClick={() => setCapaBase(clave)}
          >
            {capa.etiqueta}
          </button>
        ))}
      </div>

      {error && <p className="estado-error">No se pudo cargar el mapa. Probá de nuevo en un rato.</p>}

      {cargando ? (
        <p className="estado-carga">Cargando el mapa…</p>
      ) : (
        <>
          <div className="mapa-contenedor">
            <MapContainer center={CENTRO_EL_NARANJO} zoom={ZOOM_MAPA_DEFECTO} maxZoom={19} className="mapa">
              <TileLayer
                key={capaBase}
                attribution={CAPAS_BASE[capaBase].attribution}
                url={CAPAS_BASE[capaBase].url}
                maxZoom={CAPAS_BASE[capaBase].maxZoom}
                maxNativeZoom={CAPAS_BASE[capaBase].maxNativeZoom}
              />

              <EnlaceMapa mapRef={mapRef} />

              {miUbicacion && <Marker position={miUbicacion} icon={iconoMiUbicacion()} />}

              {capasVisibles.flatMap((capa) =>
                (puntos[capa.clave] ?? [])
                  .filter((item) => item.lat && item.lng)
                  .map((item) => (
                    <Marker
                      key={`${capa.clave}-${item.id}`}
                      position={[item.lat, item.lng]}
                      icon={iconoDeCapa(capa.clave)}
                    >
                      <Popup>
                        <div className="popup-mapa">
                          {(item.foto_url ?? item.logo_url) && (
                            <img className="popup-mapa-foto" src={item.foto_url ?? item.logo_url} alt="" />
                          )}
                          <div className="popup-mapa-cabecera">
                            <span className="popup-mapa-capa" style={{ color: colorDeCapa(capa.clave) }}>
                              <Icon name={capa.icono} size={14} /> {capa.etiqueta}
                            </span>
                            <CompartirButton
                              titulo={item.titulo ?? item.nombre ?? item.categoria}
                              texto={item.descripcion}
                              ruta={`/${capa.clave}/${item.id}`}
                            />
                          </div>
                          <Link to={`/${capa.clave}/${item.id}`} className="popup-mapa-titulo">
                            {item.titulo ?? item.nombre ?? item.categoria}
                          </Link>
                          {item.estado && <span className="etiqueta-estado">{ETIQUETAS_ESTADO[item.estado]}</span>}
                          {item.descripcion && <p className="popup-mapa-descripcion">{item.descripcion}</p>}
                          {(item.zona ?? item.direccion) && (
                            <span className="popup-mapa-zona">
                              <Icon name="pin" size={14} /> {item.zona ?? item.direccion}
                            </span>
                          )}
                          <WhatsappButton numero={item.whatsapp} />
                        </div>
                      </Popup>
                    </Marker>
                  )),
              )}
            </MapContainer>

            <button
              type="button"
              className="btn-ubicarme"
              onClick={verMiUbicacion}
              disabled={ubicando}
              title="Ver dónde estoy"
            >
              <Icon name="objetivo" size={20} />
            </button>
          </div>

          {!error && totalVisible === 0 && (
            <p className="estado-vacio">No hay nada para mostrar con los filtros elegidos.</p>
          )}
        </>
      )}
    </section>
  )
}
