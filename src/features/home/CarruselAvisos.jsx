import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../shared/components/Icon.jsx'
import SelloCitrico from '../../shared/components/SelloCitrico.jsx'
import { listarAvisos } from '../avisos/api.js'
import { FOTOS_LOCALIDAD } from './fotosLocalidad.js'

const ETIQUETAS_TIPO = {
  comunicado: 'Comunicado',
  reunion: 'Reunión',
  evento: 'Evento',
  obra: 'Obra',
  corte_servicio: 'Corte de servicio',
  actividad: 'Actividad',
  otro: 'Aviso',
}

const INTERVALO_MS = 6000

/**
 * Portada rotativa: mezcla fotos de El Naranjo (FOTOS_LOCALIDAD) con las
 * de los últimos avisos que tengan imagen. Si no hay ninguna de las dos
 * todavía, cae a un panel de marca (sello cítrico).
 */
export default function CarruselAvisos() {
  const [avisosConFoto, setAvisosConFoto] = useState([])
  const [cargando, setCargando] = useState(true)
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    listarAvisos()
      .then((data) => setAvisosConFoto((data.data ?? []).filter((a) => a.foto_url)))
      .catch(() => setAvisosConFoto([]))
      .finally(() => setCargando(false))
  }, [])

  const slides = useMemo(() => {
    const dePueblo = FOTOS_LOCALIDAD.map((src, i) => ({
      id: `pueblo-${i}`,
      tipo: 'pueblo',
      src,
    }))
    const deAvisos = avisosConFoto.map((a) => ({
      id: `aviso-${a.id}`,
      tipo: 'aviso',
      src: a.foto_url,
      titulo: a.titulo,
      etiqueta: ETIQUETAS_TIPO[a.tipo] ?? 'Aviso',
    }))
    return [...dePueblo, ...deAvisos]
  }, [avisosConFoto])

  const total = slides.length

  useEffect(() => {
    if (total < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const id = setInterval(() => setIndice((i) => (i + 1) % total), INTERVALO_MS)
    return () => clearInterval(id)
  }, [total])

  if (cargando) return null

  if (total === 0) {
    return (
      <div className="carrusel-avisos carrusel-avisos-sin-foto">
        <div className="carrusel-avisos-placeholder">
          <SelloCitrico size={100} />
        </div>
        <div className="carrusel-avisos-texto">
          <span className="carrusel-avisos-tag">
            <Icon name="pin" size={14} /> El Naranjo
          </span>
          <h2>Burruyacú, Tucumán</h2>
        </div>
      </div>
    )
  }

  const actual = slides[indice % total]
  const esAviso = actual.tipo === 'aviso'
  const contenido = (
    <>
      <img key={actual.id} className="carrusel-avisos-img" src={actual.src} alt={actual.titulo ?? 'El Naranjo'} />
      <div className="carrusel-avisos-degrade" />
      <div className="carrusel-avisos-texto">
        <span className="carrusel-avisos-tag">
          <Icon name={esAviso ? 'megafono' : 'pin'} size={14} /> {esAviso ? actual.etiqueta : 'El Naranjo'}
        </span>
        {actual.titulo && <h2>{actual.titulo}</h2>}
      </div>
    </>
  )

  return (
    <div className="carrusel-avisos">
      {esAviso ? (
        <Link to="/avisos" className="carrusel-avisos-slide">
          {contenido}
        </Link>
      ) : (
        <div className="carrusel-avisos-slide">{contenido}</div>
      )}

      {total > 1 && (
        <div className="carrusel-avisos-puntos">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={i === indice ? 'activo' : ''}
              aria-label={`Ver foto ${i + 1} de ${total}`}
              onClick={() => setIndice(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
