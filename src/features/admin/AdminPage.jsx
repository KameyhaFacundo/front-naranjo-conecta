import { useCallback, useMemo, useState } from 'react'
import { actualizarRecurso, crearRecurso, eliminarRecurso } from '../../shared/api/recursos.js'
import CargarMas from '../../shared/components/CargarMas.jsx'
import FormularioModulo from '../../shared/components/FormularioModulo.jsx'
import Icon from '../../shared/components/Icon.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import { MODULOS } from '../../shared/config/modulos.js'
import { useListado } from '../../shared/hooks/useListado.js'
import { cambiarEstadoReclamo, ETIQUETAS_ESTADO } from '../reclamos/api.js'
import { listarAdmin } from './api.js'

const ESTADOS = ['pendiente', 'en_revision', 'en_proceso', 'resuelto']

export default function AdminPage() {
  const [claveModulo, setClaveModulo] = useState(MODULOS[0].key)
  const [editando, setEditando] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [q, setQ] = useState('')
  const [ocupado, setOcupado] = useState(null)

  const modulo = useMemo(() => MODULOS.find((m) => m.key === claveModulo), [claveModulo])
  const cargar = useCallback((params) => listarAdmin(modulo.rutaLista, params), [modulo.rutaLista])
  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(cargar)

  const visibles = useMemo(() => {
    const texto = q.trim().toLowerCase()
    if (!texto) return items
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(texto))
  }, [items, q])

  function cambiarModulo(key) {
    setClaveModulo(key)
    setEditando(null)
    setMostrarForm(false)
    setQ('')
  }

  function abrirCrear() {
    setEditando(null)
    setMostrarForm(true)
  }

  function abrirEditar(item) {
    setEditando(item)
    setMostrarForm(true)
  }

  function cerrarForm() {
    setEditando(null)
    setMostrarForm(false)
  }

  function guardado() {
    cerrarForm()
    recargar()
  }

  async function guardar(data) {
    if (editando) {
      await actualizarRecurso(modulo.rutaItem, editando.id, data)
    } else {
      await crearRecurso(modulo.rutaItem, data)
    }
    guardado()
  }

  async function alternarActivo(item) {
    setOcupado(item.id)
    try {
      await actualizarRecurso(modulo.rutaItem, item.id, { activo: !item.activo })
      recargar()
    } finally {
      setOcupado(null)
    }
  }

  async function eliminar(item) {
    if (!window.confirm('¿Seguro que querés eliminar esta publicación?')) return
    setOcupado(item.id)
    try {
      await eliminarRecurso(modulo.rutaItem, item.id)
      recargar()
    } finally {
      setOcupado(null)
    }
  }

  async function cambiarEstado(item, estado) {
    setOcupado(item.id)
    try {
      await cambiarEstadoReclamo(item.id, estado)
      recargar()
    } finally {
      setOcupado(null)
    }
  }

  function valorCelda(item, columna) {
    if (columna.campo === 'fecha_evento') {
      return item.fecha_evento ? new Date(item.fecha_evento).toLocaleString('es-AR') : '—'
    }
    const valor = item[columna.campo]
    return valor === null || valor === undefined || valor === '' ? '—' : String(valor)
  }

  return (
    <section className="panel-admin">
      <header className="seccion-header">
        <h1>Panel administrativo</h1>
        <p>Moderá las publicaciones de todos los módulos desde un solo lugar.</p>
      </header>

      <div className="pestañas">
        {MODULOS.map((m) => (
          <button
            key={m.key}
            type="button"
            className={m.key === claveModulo ? 'activa' : ''}
            onClick={() => cambiarModulo(m.key)}
          >
            <Icon name={m.icono} size={16} /> {m.label}
          </button>
        ))}
      </div>

      <div className="barra-acciones">
        <input
          type="search"
          placeholder={`Buscar en ${modulo.label.toLowerCase()}`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {modulo.crear && (
          <button type="button" onClick={abrirCrear}>
            Nuevo en {modulo.label}
          </button>
        )}
      </div>

      {mostrarForm && modulo.campos && (
        <Modal
          titulo={editando ? `Editar ${modulo.label}` : `Nuevo en ${modulo.label}`}
          onCerrar={cerrarForm}
        >
          <FormularioModulo modulo={modulo} item={editando} onGuardar={guardar} onCancelar={cerrarForm} />
        </Modal>
      )}

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && visibles.length === 0}>
        <div className="tabla-admin-scroll">
          <table className="tabla-admin">
            <thead>
              <tr>
                {modulo.imagen && <th>Foto</th>}
                {modulo.columnas.map((columna) => (
                  <th key={columna.campo}>{columna.label}</th>
                ))}
                {modulo.conActivo && <th>Visibilidad</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((item) => (
                <tr key={item.id} className={modulo.conActivo && !item.activo ? 'fila-oculta' : ''}>
                  {modulo.imagen && (
                    <td>
                      {item[modulo.imagen] ? (
                        <img className="miniatura-admin" src={item[modulo.imagen]} alt="" loading="lazy" />
                      ) : (
                        <span className="miniatura-admin miniatura-vacia" aria-hidden="true" />
                      )}
                    </td>
                  )}
                  {modulo.columnas.map((columna) => (
                    <td key={columna.campo}>
                      {columna.campo === 'estado' && modulo.tipo === 'reclamos' ? (
                        <select
                          value={item.estado}
                          disabled={ocupado === item.id}
                          onChange={(e) => cambiarEstado(item, e.target.value)}
                        >
                          {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>
                              {ETIQUETAS_ESTADO[estado]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        valorCelda(item, columna)
                      )}
                    </td>
                  ))}

                  {modulo.conActivo && (
                    <td>
                      <span className={item.activo ? 'etiqueta-activo' : 'etiqueta-oculto'}>
                        {item.activo ? 'Visible' : 'Oculto'}
                      </span>
                    </td>
                  )}

                  <td>
                    <div className="acciones-fila">
                      {modulo.campos && (
                        <button
                          type="button"
                          className="btn-secundario"
                          disabled={ocupado === item.id}
                          onClick={() => abrirEditar(item)}
                        >
                          Editar
                        </button>
                      )}
                      {modulo.conActivo && (
                        <button
                          type="button"
                          className="btn-secundario"
                          disabled={ocupado === item.id}
                          onClick={() => alternarActivo(item)}
                        >
                          {item.activo ? 'Ocultar' : 'Mostrar'}
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-peligro"
                        disabled={ocupado === item.id}
                        onClick={() => eliminar(item)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CargarMas hayMas={hayMas} cargando={cargandoMas} onClick={cargarMas} />
      </ListaEstado>
    </section>
  )
}
