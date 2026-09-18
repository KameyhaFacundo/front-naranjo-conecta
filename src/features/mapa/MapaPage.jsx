import 'leaflet/dist/leaflet.css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AttributionControl, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import CompartirButton from '../../shared/components/CompartirButton.jsx'
import Icon from '../../shared/components/Icon.jsx'
import WhatsappButton from '../../shared/components/WhatsappButton.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import { ETIQUETAS_ESTADO } from '../reclamos/api.js'
import { puntosDelMapa } from './api.js'
import { CAPAS_BASE, CENTRO_EL_NARANJO, ZOOM_MAPA_DEFECTO } from './capasBase.js'
import { colorDeCapa, iconoDeCapa, iconoMiUbicacion } from './marcadores.js'

const TODAS_LAS_CAPAS = [
  { clave: 'servicios', etiqueta: 'Servicios', icono: 'herramienta' },
  { clave: 'comercios', etiqueta: 'Comercios', icono: 'tienda' },
  { clave: 'instituciones', etiqueta: 'Instituciones', icono: 'edificio' },
  { clave: 'reclamos', etiqueta: 'Reclamos', icono: 'alerta' },
]

const SIN_PUNTOS = { servicios: [], comercios: [], instituciones: [], reclamos: [] }

// Sin acentos ni mayúsculas, para que "gomeria" encuentre "Gomería".
function normalizar(texto) {
  return (texto ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

// Compara en ambos sentidos para tolerar singular/plural ("iglesia" busca
// y encuentra tipo "iglesia" aunque el usuario escriba "iglesias").
function coincideBusqueda(item, capa, query) {
  const campos = [item.titulo, item.nombre, item.categoria, item.subcategoria, item.tipo, item.zona, item.direccion, capa.etiqueta]
  return campos.some((campo) => {
    const c = normalizar(campo)
    return c && (c.includes(query) || query.includes(c))
  })
}

function EnlaceMapa({ mapRef }) {
  mapRef.current = useMap()
  return null
}

export default function MapaPage() {
  const { user } = useAuth()
  const esAdmin = user?.rol === 'admin'
  // Los reclamos son sensibles: solo el equipo comunal los ve en el mapa
  // (misma restricción que en /reclamos). Ni se piden si no es admin.
  const cargarPuntos = useCallback(() => puntosDelMapa(esAdmin), [esAdmin])
  const { items: datos, cargando, error } = useListado(cargarPuntos)
  const capas = useMemo(
    () => (esAdmin ? TODAS_LAS_CAPAS : TODAS_LAS_CAPAS.filter((c) => c.clave !== 'reclamos')),
    [esAdmin],
  )
  const [capasActivas, setCapasActivas] = useState(() => new Set(TODAS_LAS_CAPAS.map((c) => c.clave)))
  const [capaBase, setCapaBase] = useState('satelite')
  const [miUbicacion, setMiUbicacion] = useState(null)
  const [ubicando, setUbicando] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [busquedaAplicada, setBusquedaAplicada] = useState('')
  const mapRef = useRef(null)

  const puntos = useMemo(() => {
    if (!datos || Array.isArray(datos)) return SIN_PUNTOS
    return datos
  }, [datos])

  // Debounce corto: evita refiltrar/zoomear en cada tecla mientras se escribe.
  useEffect(() => {
    const id = setTimeout(() => setBusquedaAplicada(normalizar(busqueda)), 300)
    return () => clearTimeout(id)
  }, [busqueda])

  // Con 1 sola letra casi todo "coincide" — recién buscamos de verdad a partir de 2.
  const busquedaActiva = busquedaAplicada.length >= 2 ? busquedaAplicada : ''

  // Mientras se busca, la búsqueda manda en todas las categorías (no solo
  // en las que estén tildadas): así "gomería" aparece aunque el filtro de
  // Servicios esté destildado.
  const puntosFiltrados = useMemo(() => {
    const resultado = {}
    capas.forEach((capa) => {
      const conUbicacion = (puntos[capa.clave] ?? []).filter((item) => item.lat && item.lng)
      if (busquedaActiva) {
        resultado[capa.clave] = conUbicacion.filter((item) => coincideBusqueda(item, capa, busquedaActiva))
      } else {
        resultado[capa.clave] = capasActivas.has(capa.clave) ? conUbicacion : []
      }
    })
    return resultado
  }, [puntos, capas, capasActivas, busquedaActiva])

  const totalVisible = capas.reduce((acc, capa) => acc + (puntosFiltrados[capa.clave]?.length ?? 0), 0)

  // Encuadra el mapa en los resultados: si es uno solo, se acerca a ese
  // punto; si hay varios, ajusta el zoom para que entren todos.
  useEffect(() => {
    if (!busquedaActiva || !mapRef.current) return
    const coincidencias = capas.flatMap((capa) => puntosFiltrados[capa.clave] ?? [])
    if (coincidencias.length === 0) return
    if (coincidencias.length === 1) {
      mapRef.current.flyTo([coincidencias[0].lat, coincidencias[0].lng], 17)
    } else {
      mapRef.current.flyToBounds(
        coincidencias.map((item) => [item.lat, item.lng]),
        { padding: [60, 60], maxZoom: 17 },
      )
    }
  }, [busquedaActiva, puntosFiltrados, capas])

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
        <p>
          Comercios, servicios e instituciones{esAdmin ? ', y reclamos' : ''}, todo en un mismo mapa.
        </p>
      </header>

      <div className="barra-acciones">
        <input
          type="search"
          placeholder="Buscar en el mapa (ej: gomería, iglesia, comuna)…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button type="button" className="btn-secundario" onClick={() => setBusqueda('')}>
            Limpiar
          </button>
        )}
      </div>

      <div className="filtros-mapa">
        {capas.map((capa) => (
          <label key={capa.clave} style={{ '--color-capa': colorDeCapa(capa.clave) }}>
            <input
              type="checkbox"
              checked={capasActivas.has(capa.clave)}
              onChange={() => alternarCapa(capa.clave)}
              disabled={Boolean(busquedaActiva)}
            />
            <Icon name={capa.icono} size={16} className="filtro-icono" /> {capa.etiqueta}
          </label>
        ))}
        {busquedaActiva && (
          <span className="texto-suave">Buscando en todas las categorías, no solo en las tildadas.</span>
        )}
      </div>

      <div className="barra-acciones">
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

        <a
          className="btn btn-secundario enlace-zona-mapa"
          href={`https://www.google.com/maps/@${CENTRO_EL_NARANJO[0]},${CENTRO_EL_NARANJO[1]},16z`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="mapa" size={15} /> Ver la zona en Google Maps
        </a>
      </div>

      {error && <p className="estado-error">No se pudo cargar el mapa. Probá de nuevo en un rato.</p>}

      {cargando ? (
        <p className="estado-carga">Cargando el mapa…</p>
      ) : (
        <>
          <div className="mapa-contenedor">
            <MapContainer
              center={CENTRO_EL_NARANJO}
              zoom={ZOOM_MAPA_DEFECTO}
              maxZoom={19}
              className="mapa"
              attributionControl={false}
            >
              <TileLayer
                key={capaBase}
                attribution={CAPAS_BASE[capaBase].attribution}
                url={CAPAS_BASE[capaBase].url}
                maxZoom={CAPAS_BASE[capaBase].maxZoom}
                maxNativeZoom={CAPAS_BASE[capaBase].maxNativeZoom}
              />
              <AttributionControl position="bottomright" prefix={false} />

              <EnlaceMapa mapRef={mapRef} />

              {miUbicacion && <Marker position={miUbicacion} icon={iconoMiUbicacion()} />}

              {capas.flatMap((capa) =>
                (puntosFiltrados[capa.clave] ?? []).map((item) => (
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
                          <div className="popup-mapa-acciones">
                            <WhatsappButton numero={item.whatsapp} />
                            <a
                              className="btn-como-llegar"
                              href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Icon name="mapa" size={15} /> Cómo llegar
                            </a>
                          </div>
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
            <p className="estado-vacio">
              {busquedaActiva
                ? `No se encontró nada para "${busqueda.trim()}".`
                : 'No hay nada para mostrar con los filtros elegidos.'}
            </p>
          )}
        </>
      )}
    </section>
  )
}
