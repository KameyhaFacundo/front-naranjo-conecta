import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../shared/components/Icon.jsx'
import { listarAvisos } from '../avisos/api.js'
import { ETIQUETAS_TIPO_AVISO } from '../avisos/tipos.js'

const LIMITE = 4

function formatearFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
}

/**
 * Últimos avisos en el inicio, como publicaciones (foto + texto + fecha),
 * no mezclados con las fotos de portada. Cada uno es un post real, no una
 * imagen suelta.
 */
export default function AvisosInicio() {
  const [avisos, setAvisos] = useState(null)

  useEffect(() => {
    listarAvisos()
      .then((data) => setAvisos((data.data ?? []).slice(0, LIMITE)))
      .catch(() => setAvisos([]))
  }, [])

  if (!avisos || avisos.length === 0) return null

  return (
    <section className="avisos-inicio">
      <div className="avisos-inicio-header">
        <h2>Avisos de la comunidad</h2>
        <Link to="/avisos">Ver todos</Link>
      </div>

      <div className="avisos-inicio-lista">
        {avisos.map((aviso, i) => (
          <article key={aviso.id} className="aviso-post">
            {aviso.foto_url && (
              <img
                className="aviso-post-foto"
                src={aviso.foto_url}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            )}
            <div className="aviso-post-cuerpo">
              <div className="aviso-post-cabecera">
                <span className="aviso-post-tag">
                  <Icon name="megafono" size={13} /> {ETIQUETAS_TIPO_AVISO[aviso.tipo] ?? 'Aviso'}
                </span>
                {aviso.publicado && <span className="aviso-post-fecha">{formatearFecha(aviso.publicado)}</span>}
              </div>
              <h3>{aviso.titulo}</h3>
              <p>{aviso.cuerpo}</p>
              {aviso.fecha_evento && (
                <p className="aviso-post-evento">
                  <Icon name="pin" size={13} /> {formatearFecha(aviso.fecha_evento)}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
