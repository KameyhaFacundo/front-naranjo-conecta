import { useState } from 'react'

const ESTRELLA =
  'M12 3.4l2.5 5.1 5.6.8-4 4 1 5.6L12 16.3l-5.1 2.7 1-5.6-4-4 5.6-.8L12 3.4Z'

function Estrella({ llena, size }) {
  return (
    <svg
      className={llena ? 'estrella llena' : 'estrella'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={ESTRELLA}
        fill={llena ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Estrellas de calificación. Si recibe `onChange` se vuelve interactiva
 * (selector); si no, es solo lectura para mostrar un promedio.
 */
export default function Estrellas({ valor = 0, onChange, size = 18, mostrarValor = false }) {
  const interactivo = typeof onChange === 'function'
  const [hover, setHover] = useState(0)
  const resaltado = hover || Math.round(valor)

  if (!interactivo) {
    return (
      <span className="estrellas" role="img" aria-label={`${valor} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Estrella key={n} llena={n <= Math.round(valor)} size={size} />
        ))}
        {mostrarValor && valor > 0 && (
          <span className="estrellas-valor">{Number(valor).toFixed(1)}</span>
        )}
      </span>
    )
  }

  return (
    <span className="estrellas estrellas-input" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= resaltado ? 'estrella-boton llena' : 'estrella-boton'}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
        >
          <Estrella llena={n <= resaltado} size={size} />
        </button>
      ))}
    </span>
  )
}
