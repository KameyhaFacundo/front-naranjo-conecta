import { useEffect, useState } from 'react'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import { obtenerResumen } from './api.js'

const NOMBRE_ROL = {
  vecino: 'Vecinos',
  prestador: 'Prestadores',
  comerciante: 'Comerciantes',
  productor: 'Productores',
  empleador: 'Empleadores',
  admin: 'Admins',
}

const NOMBRE_PUBLICACION = {
  servicios: 'Servicios',
  comercios: 'Comercios',
  productores: 'Productores',
  empleos: 'Empleo',
  instituciones: 'Instituciones',
  avisos: 'Avisos',
  resenas: 'Reseñas',
}

const NOMBRE_ESTADO = {
  pendiente: 'Pendientes',
  en_revision: 'En revisión',
  en_proceso: 'En proceso',
  resuelto: 'Resueltos',
}

function Tarjeta({ titulo, valor, detalle }) {
  return (
    <div className="resumen-card">
      <span className="resumen-card-valor">{valor}</span>
      <span className="resumen-card-titulo">{titulo}</span>
      {detalle}
    </div>
  )
}

function Desglose({ datos, nombres }) {
  const entradas = Object.entries(datos ?? {})
  if (entradas.length === 0) return null
  return (
    <ul className="resumen-desglose">
      {entradas.map(([clave, valor]) => (
        <li key={clave}>
          <span>{nombres[clave] ?? clave}</span>
          <strong>{valor}</strong>
        </li>
      ))}
    </ul>
  )
}

export default function ResumenPanel() {
  const [data, setData] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    obtenerResumen()
      .then(setData)
      .catch(setError)
      .finally(() => setCargando(false))
  }, [])

  return (
    <ListaEstado cargando={cargando} error={error} vacio={!cargando && !data}>
      {data && (
        <div className="resumen">
          <section>
            <h2>Usuarios</h2>
            <div className="resumen-grid">
              <Tarjeta titulo="Cuentas totales" valor={data.usuarios.total} />
              <Tarjeta titulo="Activas" valor={data.usuarios.activos} />
              <Tarjeta titulo="Suspendidas" valor={data.usuarios.suspendidos} />
              <Tarjeta titulo="Nuevas (30 días)" valor={data.usuarios.nuevos_30_dias} />
            </div>
            <Desglose datos={data.usuarios.por_rol} nombres={NOMBRE_ROL} />
          </section>

          <section>
            <h2>Publicaciones</h2>
            <div className="resumen-grid">
              {Object.entries(data.publicaciones).map(([clave, valor]) => (
                <Tarjeta key={clave} titulo={NOMBRE_PUBLICACION[clave] ?? clave} valor={valor} />
              ))}
            </div>
          </section>

          <section>
            <h2>Reclamos</h2>
            <div className="resumen-grid">
              <Tarjeta titulo="Totales" valor={data.reclamos.total} />
              <Tarjeta titulo="Sin resolver" valor={data.reclamos.pendientes} />
            </div>
            <Desglose datos={data.reclamos.por_estado} nombres={NOMBRE_ESTADO} />
          </section>
        </div>
      )}
    </ListaEstado>
  )
}
