import { useEffect, useMemo, useState } from 'react'
import Icon from '../../shared/components/Icon.jsx'
import SelloCitrico from '../../shared/components/SelloCitrico.jsx'
import { FOTOS_LOCALIDAD } from './fotosLocalidad.js'

const INTERVALO_MS = 3000

/**
 * Portada rotativa con fotos de El Naranjo (FOTOS_LOCALIDAD). Los avisos
 * NO van acá — tienen su propia sección más abajo, tipo publicación, con
 * foto, texto y fecha (ver AvisosInicio). Esto es solo la "foto de tapa".
 * Si todavía no hay ninguna foto cargada, cae a un panel de marca.
 */
export default function CarruselAvisos() {
  const [indice, setIndice] = useState(0)

  const slides = useMemo(() => {
    const dePueblo = FOTOS_LOCALIDAD.map((src, i) => ({ id: `pueblo-${i}`, tipo: 'pueblo', src }))
    // El panel de marca siempre entra en la rotación (no solo cuando no hay
    // fotos) hasta que haya suficientes fotos reales dando vueltas.
    return [...dePueblo, { id: 'marca', tipo: 'marca' }]
  }, [])

  const total = slides.length

  useEffect(() => {
    if (total < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const id = setInterval(() => setIndice((i) => (i + 1) % total), INTERVALO_MS)
    return () => clearInterval(id)
  }, [total])

  const actual = slides[indice % total]
  const esMarca = actual.tipo === 'marca'

  return (
    <div className={`carrusel-avisos ${esMarca ? 'carrusel-avisos-sin-foto' : ''}`}>
      <div className="carrusel-avisos-slide">
        {esMarca ? (
          <div className="carrusel-avisos-placeholder">
            <SelloCitrico size={100} />
          </div>
        ) : (
          <>
            <img key={actual.id} className="carrusel-avisos-img" src={actual.src} alt="El Naranjo" />
            <div className="carrusel-avisos-degrade" />
          </>
        )}
        <div className="carrusel-avisos-texto">
          <span className="carrusel-avisos-tag">
            <Icon name="pin" size={14} /> El Naranjo
          </span>
          <h2>Burruyacú, Tucumán</h2>
        </div>
      </div>

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
