import { useEffect } from 'react'
import Icon from './Icon.jsx'

/** Modal reutilizable: fondo oscuro, cierre con Escape o clic afuera. */
export default function Modal({ titulo, onCerrar, children }) {
  useEffect(() => {
    function alPresionarTecla(e) {
      if (e.key === 'Escape') onCerrar()
    }

    document.addEventListener('keydown', alPresionarTecla)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', alPresionarTecla)
      document.body.style.overflow = ''
    }
  }, [onCerrar])

  return (
    <div className="modal-fondo" role="presentation" onClick={onCerrar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
          <Icon name="cerrar" size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}
