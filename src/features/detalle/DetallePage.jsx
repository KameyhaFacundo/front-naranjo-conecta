import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CompartirButton from '../../shared/components/CompartirButton.jsx'
import Icon from '../../shared/components/Icon.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import MapaUbicacion from '../../shared/components/MapaUbicacion.jsx'
import WhatsappButton from '../../shared/components/WhatsappButton.jsx'
import { DETALLE } from '../../shared/config/detalle.js'
import { MODULOS } from '../../shared/config/modulos.js'
import { ETIQUETAS_ESTADO } from '../reclamos/api.js'
import { obtenerPublicacion } from './api.js'

export default function DetallePage({ moduloKey }) {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const modulo = MODULOS.find((m) => m.key === moduloKey)
  const config = DETALLE[moduloKey]

  useEffect(() => {
    setCargando(true)
    setError(null)
    obtenerPublicacion(moduloKey, id)
      .then(setItem)
      .catch(setError)
      .finally(() => setCargando(false))
  }, [moduloKey, id])

  const titulo = item ? (item[config.tituloKey] ?? item.titulo ?? item.nombre ?? item.categoria) : ''
  const imagen = config.imagen ? item?.[config.imagen] : null

  return (
    <section className="detalle">
      <Link to={`/${moduloKey}`} className="detalle-volver">
        ← Volver a {modulo.label}
      </Link>

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && !item}>
        {item && (
          <>
            {imagen && <img className="detalle-imagen" src={imagen} alt={titulo} />}

            <div className="detalle-cabecera">
              <span className="detalle-chip">
                <Icon name={modulo.icono} size={15} /> {modulo.label}
              </span>
              {config.estado && item.estado && (
                <span className={`detalle-estado reclamo-${item.estado}`}>{ETIQUETAS_ESTADO[item.estado]}</span>
              )}
            </div>

            <h1>{titulo}</h1>

            <div className="detalle-campos">
              {config.campos.map(([campo, label]) => {
                const valor = item[campo]
                if (valor === null || valor === undefined || valor === '') return null
                return (
                  <div key={campo} className="detalle-campo">
                    <span className="detalle-campo-label">{label}</span>
                    <p>{String(valor)}</p>
                  </div>
                )
              })}
            </div>

            {item.lat && item.lng && <MapaUbicacion lat={item.lat} lng={item.lng} moduloKey={moduloKey} />}

            <div className="detalle-acciones">
              <WhatsappButton numero={item.whatsapp} />
              <CompartirButton titulo={titulo} texto={item.descripcion} ruta={`/${moduloKey}/${id}`} />
            </div>
          </>
        )}
      </ListaEstado>
    </section>
  )
}
