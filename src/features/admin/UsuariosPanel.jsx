import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CargarMas from '../../shared/components/CargarMas.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import {
  actualizarUsuario,
  eliminarUsuario,
  listarUsuarios,
  resetearPassword,
  verUsuario,
} from './api.js'

const ROLES = ['vecino', 'prestador', 'comerciante', 'productor', 'empleador', 'admin']
const NOMBRE_ROL = {
  vecino: 'Vecino',
  prestador: 'Prestador',
  comerciante: 'Comerciante',
  productor: 'Productor',
  empleador: 'Empleador',
  admin: 'Admin',
}

const DETALLE_MODULOS = [
  { clave: 'servicios', label: 'Servicios', ruta: '/servicios', titulo: (x) => x.titulo },
  { clave: 'comercios', label: 'Comercios', ruta: '/comercios', titulo: (x) => x.nombre },
  { clave: 'productores', label: 'Productores', ruta: '/productores', titulo: (x) => x.nombre },
  { clave: 'empleos', label: 'Empleo', ruta: '/empleos', titulo: (x) => x.titulo },
  { clave: 'reclamos', label: 'Reclamos', ruta: '/reclamos', titulo: (x) => x.descripcion },
  {
    clave: 'resenas',
    label: 'Reseñas',
    titulo: (x) => `${x.puntuacion}★ ${x.comentario ?? ''}`.trim(),
  },
]

function fecha(iso) {
  return iso ? new Date(iso).toLocaleDateString('es-AR') : '—'
}

function fechaHora(iso) {
  return iso ? new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '—'
}

function totalPublicaciones(publicaciones) {
  return Object.values(publicaciones ?? {}).reduce((total, n) => total + n, 0)
}

export default function UsuariosPanel() {
  const [q, setQ] = useState('')
  const [rol, setRol] = useState('')
  const [estado, setEstado] = useState('')
  const [detalle, setDetalle] = useState(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [ocupado, setOcupado] = useState(null)

  const params = useMemo(
    () => ({ q, rol, activo: estado === '' ? '' : estado === 'activo' }),
    [q, rol, estado],
  )
  const cargar = useCallback((p) => listarUsuarios(p), [])
  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(cargar, params)

  async function abrirDetalle(usuario) {
    setDetalle({ usuario })
    setCargandoDetalle(true)
    try {
      const completo = await verUsuario(usuario.id)
      setDetalle({ usuario: completo })
    } finally {
      setCargandoDetalle(false)
    }
  }

  async function alternarActivo(usuario) {
    setOcupado(usuario.id)
    try {
      await actualizarUsuario(usuario.id, { activo: !usuario.activo })
      if (detalle?.usuario.id === usuario.id) {
        setDetalle({ usuario: { ...detalle.usuario, activo: !usuario.activo } })
      }
      recargar()
    } finally {
      setOcupado(null)
    }
  }

  async function resetear(usuario) {
    const nueva = window.prompt(`Nueva contraseña para ${usuario.nombre} (mínimo 8 caracteres):`)
    if (nueva === null) return
    if (nueva.length < 8) {
      window.alert('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setOcupado(usuario.id)
    try {
      await resetearPassword(usuario.id, nueva)
      window.alert('Contraseña actualizada. Se cerraron sus sesiones.')
    } catch {
      window.alert('No se pudo actualizar la contraseña.')
    } finally {
      setOcupado(null)
    }
  }

  async function eliminar(usuario) {
    const ok = window.confirm(
      `¿Eliminar la cuenta de ${usuario.nombre}? Se borran todas sus publicaciones y no se puede deshacer.`,
    )
    if (!ok) return
    setOcupado(usuario.id)
    try {
      await eliminarUsuario(usuario.id)
      setDetalle(null)
      recargar()
    } finally {
      setOcupado(null)
    }
  }

  return (
    <div className="panel-usuarios">
      <div className="barra-acciones">
        <input
          type="search"
          placeholder="Buscar por nombre o email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)} aria-label="Filtrar por rol">
          <option value="">Todos los roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {NOMBRE_ROL[r]}
            </option>
          ))}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Filtrar por estado">
          <option value="">Todas las cuentas</option>
          <option value="activo">Solo activas</option>
          <option value="suspendido">Solo suspendidas</option>
        </select>
      </div>

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && items.length === 0}>
        <div className="tabla-admin-scroll">
          <table className="tabla-admin tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th className="col-opcional">Publicaciones</th>
                <th className="col-opcional">Último acceso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className={u.activo ? '' : 'fila-oculta'}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{NOMBRE_ROL[u.rol] ?? u.rol}</td>
                  <td className="col-opcional">{totalPublicaciones(u.publicaciones)}</td>
                  <td className="col-opcional">{fechaHora(u.ultimo_acceso_at)}</td>
                  <td>
                    <span className={u.activo ? 'etiqueta-activo' : 'etiqueta-oculto'}>
                      {u.activo ? 'Activa' : 'Suspendida'}
                    </span>
                  </td>
                  <td>
                    <div className="acciones-fila">
                      <button type="button" className="btn-secundario" onClick={() => abrirDetalle(u)}>
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn-secundario"
                        disabled={ocupado === u.id}
                        onClick={() => alternarActivo(u)}
                      >
                        {u.activo ? 'Suspender' : 'Reactivar'}
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

      {detalle && (
        <Modal titulo={`Cuenta de ${detalle.usuario.nombre}`} onCerrar={() => setDetalle(null)}>
          <UsuarioDetalle
            usuario={detalle.usuario}
            cargando={cargandoDetalle}
            ocupado={ocupado === detalle.usuario.id}
            onAlternarActivo={() => alternarActivo(detalle.usuario)}
            onResetear={() => resetear(detalle.usuario)}
            onEliminar={() => eliminar(detalle.usuario)}
          />
        </Modal>
      )}
    </div>
  )
}

function UsuarioDetalle({ usuario, cargando, ocupado, onAlternarActivo, onResetear, onEliminar }) {
  return (
    <div className="usuario-detalle">
      <h3>{usuario.nombre}</h3>
      <dl className="usuario-datos">
        <div>
          <dt>Email</dt>
          <dd>{usuario.email}</dd>
        </div>
        <div>
          <dt>Rol</dt>
          <dd>{NOMBRE_ROL[usuario.rol] ?? usuario.rol}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>{usuario.activo ? 'Activa' : 'Suspendida'}</dd>
        </div>
        <div>
          <dt>WhatsApp</dt>
          <dd>{usuario.whatsapp ?? '—'}</dd>
        </div>
        <div>
          <dt>Teléfono</dt>
          <dd>{usuario.telefono ?? '—'}</dd>
        </div>
        <div>
          <dt>Zona</dt>
          <dd>{usuario.zona ?? '—'}</dd>
        </div>
        <div>
          <dt>Registro</dt>
          <dd>{fechaHora(usuario.created_at)}</dd>
        </div>
        <div>
          <dt>Último acceso</dt>
          <dd>{fechaHora(usuario.ultimo_acceso_at)}</dd>
        </div>
        <div>
          <dt>Última IP</dt>
          <dd>{usuario.ultima_ip ?? '—'}</dd>
        </div>
      </dl>

      <h4>Publicaciones</h4>
      {cargando && <p className="estado-carga">Cargando…</p>}
      {!cargando && (
        <div className="usuario-publicaciones">
          {DETALLE_MODULOS.map((mod) => {
            const lista = usuario[mod.clave] ?? []
            return (
              <div key={mod.clave} className="usuario-publicaciones-grupo">
                <p className="usuario-publicaciones-titulo">
                  {mod.label} <span className="texto-suave">({lista.length})</span>
                </p>
                {lista.length > 0 && (
                  <ul>
                    {lista.map((x) => (
                      <li key={x.id}>
                        {mod.ruta ? <Link to={`${mod.ruta}/${x.id}`}>{mod.titulo(x)}</Link> : mod.titulo(x)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="usuario-acciones">
        <button type="button" className="btn-secundario" disabled={ocupado} onClick={onAlternarActivo}>
          {usuario.activo ? 'Suspender cuenta' : 'Reactivar cuenta'}
        </button>
        <button type="button" className="btn-secundario" disabled={ocupado} onClick={onResetear}>
          Resetear contraseña
        </button>
        <button type="button" className="btn-peligro" disabled={ocupado} onClick={onEliminar}>
          Eliminar cuenta
        </button>
      </div>
    </div>
  )
}
