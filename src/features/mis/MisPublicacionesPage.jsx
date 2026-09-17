import { useEffect, useState } from 'react'
import { actualizarRecurso, eliminarRecurso } from '../../shared/api/recursos.js'
import Estrellas from '../../shared/components/Estrellas.jsx'
import FormularioModulo from '../../shared/components/FormularioModulo.jsx'
import Icon from '../../shared/components/Icon.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import { MODULOS } from '../../shared/config/modulos.js'
import { ETIQUETAS_ESTADO } from '../reclamos/api.js'
import { listarMisPublicaciones } from './api.js'

const CLAVES = ['servicios', 'comercios', 'productores', 'empleos', 'reclamos']

export default function MisPublicacionesPage() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [editando, setEditando] = useState(null)
  const [ocupado, setOcupado] = useState(null)

  function cargar() {
    setCargando(true)
    setError(null)
    listarMisPublicaciones()
      .then(setDatos)
      .catch(setError)
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargar()
  }, [])

  const modulos = MODULOS.filter((m) => CLAVES.includes(m.key))
  const total = datos ? modulos.reduce((acc, m) => acc + (datos[m.key]?.length ?? 0), 0) : 0

  async function guardar(data) {
    await actualizarRecurso(editando.modulo.rutaItem, editando.item.id, data)
    setEditando(null)
    cargar()
  }

  async function eliminar(modulo, item) {
    if (!window.confirm('¿Seguro que querés eliminar esta publicación?')) return
    setOcupado(item.id)
    try {
      await eliminarRecurso(modulo.rutaItem, item.id)
      cargar()
    } finally {
      setOcupado(null)
    }
  }

  function tituloDe(item) {
    return item.titulo ?? item.nombre ?? item.categoria
  }

  return (
    <section>
      <header className="seccion-header">
        <h1>Mis publicaciones</h1>
        <p>Todo lo que publicaste. Podés editarlo o borrarlo cuando quieras.</p>
      </header>

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && total === 0}>
        {modulos.map((modulo) => {
          const items = datos?.[modulo.key] ?? []
          if (items.length === 0) return null

          return (
            <div key={modulo.key} className="mis-grupo">
              <h2 className="mis-grupo-titulo">
                <Icon name={modulo.icono} size={18} /> {modulo.label}
                <span className="mis-contador">{items.length}</span>
              </h2>

              <ul className="mis-lista">
                {items.map((item) => (
                  <li key={item.id} className="mis-item">
                    <div>
                      <strong>{tituloDe(item)}</strong>
                      {item.descripcion && <p>{item.descripcion}</p>}
                      <div className="mis-meta">
                        {item.calificacion?.total > 0 && (
                          <span className="mis-calificacion">
                            <Estrellas valor={item.calificacion.promedio} size={14} />
                            {item.calificacion.promedio} · {item.calificacion.total}{' '}
                            {item.calificacion.total === 1 ? 'opinión' : 'opiniones'}
                          </span>
                        )}
                        {item.zona && (
                          <span>
                            <Icon name="pin" size={14} /> {item.zona}
                          </span>
                        )}
                        {item.estado && <span className="etiqueta-estado">{ETIQUETAS_ESTADO[item.estado]}</span>}
                        {modulo.conActivo && (
                          <span className={item.activo ? 'etiqueta-activo' : 'etiqueta-oculto'}>
                            {item.activo ? 'Visible' : 'Oculto'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="acciones-fila">
                      {modulo.campos && (
                        <button
                          type="button"
                          className="btn-secundario"
                          disabled={ocupado === item.id}
                          onClick={() => setEditando({ modulo, item })}
                        >
                          Editar
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-peligro"
                        disabled={ocupado === item.id}
                        onClick={() => eliminar(modulo, item)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </ListaEstado>

      {editando && (
        <Modal titulo={`Editar ${editando.modulo.label}`} onCerrar={() => setEditando(null)}>
          <FormularioModulo
            modulo={editando.modulo}
            item={editando.item}
            onGuardar={guardar}
            onCancelar={() => setEditando(null)}
          />
        </Modal>
      )}
    </section>
  )
}
