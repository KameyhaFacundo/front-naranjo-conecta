import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Estrellas from '../../shared/components/Estrellas.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { eliminarResena, guardarResena, listarResenas } from './api.js'

function formatearFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Resenas({ moduloKey, itemId }) {
  const { user } = useAuth()
  const [resenas, setResenas] = useState([])
  const [promedio, setPromedio] = useState(null)
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [puntuacion, setPuntuacion] = useState(0)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cargar = useCallback(() => {
    setCargando(true)
    setError(null)
    listarResenas(moduloKey, itemId)
      .then((data) => {
        setResenas(data.data)
        setPromedio(data.promedio)
        setTotal(data.total)
        const mia = data.data.find((r) => r.es_mia)
        if (mia) {
          setPuntuacion(mia.puntuacion)
          setComentario(mia.comentario ?? '')
        }
      })
      .catch(setError)
      .finally(() => setCargando(false))
  }, [moduloKey, itemId])

  useEffect(cargar, [cargar])

  const mia = resenas.find((r) => r.es_mia)

  async function enviar(e) {
    e.preventDefault()
    if (!puntuacion) return
    setEnviando(true)
    try {
      await guardarResena(moduloKey, itemId, {
        puntuacion,
        comentario: comentario.trim() || null,
      })
      cargar()
    } finally {
      setEnviando(false)
    }
  }

  async function borrar(id) {
    await eliminarResena(id)
    setPuntuacion(0)
    setComentario('')
    cargar()
  }

  return (
    <section className="resenas">
      <header className="resenas-header">
        <h2>Opiniones</h2>
        {promedio != null ? (
          <span className="resenas-resumen">
            <Estrellas valor={promedio} size={18} />
            <strong>{Number(promedio).toFixed(1)}</strong>
            <span>
              ({total} {total === 1 ? 'opinión' : 'opiniones'})
            </span>
          </span>
        ) : (
          <span className="resenas-resumen">Todavía sin opiniones</span>
        )}
      </header>

      {user ? (
        <form className="resena-form" onSubmit={enviar}>
          <p className="resena-form-titulo">{mia ? 'Tu opinión' : 'Dejá tu opinión'}</p>
          <Estrellas valor={puntuacion} onChange={setPuntuacion} size={30} />
          <textarea
            placeholder="Contá tu experiencia (opcional)"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={1000}
            rows={3}
          />
          <button type="submit" disabled={!puntuacion || enviando}>
            {enviando ? 'Guardando…' : mia ? 'Actualizar opinión' : 'Publicar opinión'}
          </button>
        </form>
      ) : (
        <p className="resena-login">
          <Link to="/ingresar">Ingresá</Link> para dejar tu opinión.
        </p>
      )}

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && resenas.length === 0} variante="resenas" cantidad={2}>
        <ul className="resenas-lista">
          {resenas.map((r) => (
            <li key={r.id} className="resena">
              <div className="resena-cabecera">
                <strong>{r.autor?.nombre ?? 'Vecino'}</strong>
                <Estrellas valor={r.puntuacion} size={15} />
                <span className="resena-fecha">{formatearFecha(r.created_at)}</span>
              </div>
              {r.comentario && <p>{r.comentario}</p>}
              {(r.es_mia || user?.rol === 'admin') && (
                <button type="button" className="resena-borrar" onClick={() => borrar(r.id)}>
                  Eliminar
                </button>
              )}
            </li>
          ))}
        </ul>
      </ListaEstado>
    </section>
  )
}
