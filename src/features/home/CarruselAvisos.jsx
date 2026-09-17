import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../shared/components/Icon.jsx'
import SelloCitrico from '../../shared/components/SelloCitrico.jsx'
import { listarAvisos } from '../avisos/api.js'

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
 * Portada rotativa: muestra las fotos de los últimos avisos con imagen.
 * Si todavía no hay ninguno, cae a una foto del pueblo (ver
 * public/images/pueblo.jpg) y, si esa tampoco está, a un panel de marca.
 */
export default function CarruselAvisos() {
  const [avisosConFoto, setAvisosConFoto] = useState(null)
  const [indice, setIndice] = useState(0)
  const [fotoPuebloRota, setFotoPuebloRota] = useState(false)

  useEffect(() => {
    listarAvisos()
      .then((data) => setAvisosConFoto((data.data ?? []).filter((a) => a.foto_url)))
      .catch(() => setAvisosConFoto([]))
  }, [])

  const total = avisosConFoto?.length ?? 0

  useEffect(() => {
    if (total < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const id = setInterval(() => setIndice((i) => (i + 1) % total), INTERVALO_MS)
    return () => clearInterval(id)
  }, [total])

  if (avisosConFoto === null) return null

  if (total === 0) {
    return (
      <div className={`carrusel-avisos ${fotoPuebloRota ? 'carrusel-avisos-sin-foto' : ''}`}>
        {!fotoPuebloRota ? (
          <img
            key="pueblo"
            className="carrusel-avisos-img"
            src="/images/pueblo.jpg"
            alt="El Naranjo, Burruyacú"
            onError={() => setFotoPuebloRota(true)}
          />
        ) : (
          <div className="carrusel-avisos-placeholder">
            <SelloCitrico size={100} />
          </div>
        )}
        <div className="carrusel-avisos-degrade" />
        <div className="carrusel-avisos-texto">
          <span className="carrusel-avisos-tag">
            <Icon name="pin" size={14} /> El Naranjo
          </span>
          <h2>Burruyacú, Tucumán</h2>
        </div>
      </div>
    )
  }

  const actual = avisosConFoto[indice]

  return (
    <div className="carrusel-avisos">
      <Link to="/avisos" className="carrusel-avisos-slide">
        <img key={actual.id} className="carrusel-avisos-img" src={actual.foto_url} alt={actual.titulo} />
        <div className="carrusel-avisos-degrade" />
        <div className="carrusel-avisos-texto">
          <span className="carrusel-avisos-tag">
            <Icon name="megafono" size={14} /> {ETIQUETAS_TIPO[actual.tipo] ?? 'Aviso'}
          </span>
          <h2>{actual.titulo}</h2>
        </div>
      </Link>

      {total > 1 && (
        <div className="carrusel-avisos-puntos">
          {avisosConFoto.map((aviso, i) => (
            <button
              key={aviso.id}
              type="button"
              className={i === indice ? 'activo' : ''}
              aria-label={`Ver aviso ${i + 1} de ${total}`}
              onClick={() => setIndice(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
