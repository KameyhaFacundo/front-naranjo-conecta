import { useState } from 'react'
import { Link } from 'react-router-dom'
import CargarMas from '../../shared/components/CargarMas.jsx'
import Icon from '../../shared/components/Icon.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import ReclamoForm from './ReclamoForm.jsx'
import { cambiarEstadoReclamo, ETIQUETAS_ESTADO, listarReclamos } from './api.js'

const ESTADOS = ['pendiente', 'en_revision', 'en_proceso', 'resuelto']

export default function ReclamosPage() {
  const { user } = useAuth()
  const esAdmin = user?.rol === 'admin'
  const [mostrarForm, setMostrarForm] = useState(false)
  // El listado completo es sensible (nombres de zonas, descripciones de
  // vecinos) — solo lo trae/muestra el equipo comunal. Ojo: esto es un
  // filtro de interfaz nomás; cuando haya backend real, el endpoint de
  // reclamos también tiene que exigir rol admin, si no cualquiera puede
  // pedirlo por afuera de la app.
  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(listarReclamos, {}, esAdmin)

  async function actualizarEstado(id, estado) {
    await cambiarEstadoReclamo(id, estado)
    recargar()
  }

  return (
    <section>
      <header className="seccion-header">
        <h1>Servicios públicos y reclamos</h1>
        <p>Alumbrado, calles, agua, basura y otros problemas de la localidad.</p>
      </header>

      {user && (
        <div className="barra-acciones">
          <button type="button" onClick={() => setMostrarForm(true)}>
            Hacer un reclamo
          </button>
        </div>
      )}

      {mostrarForm && (
        <Modal titulo="Hacer un reclamo" onCerrar={() => setMostrarForm(false)}>
          <ReclamoForm
            onCreado={() => {
              setMostrarForm(false)
              recargar()
            }}
          />
        </Modal>
      )}

      {esAdmin ? (
        <ListaEstado cargando={cargando} error={error} vacio={!cargando && items.length === 0} variante="lista" cantidad={4}>
          <ul className="lista-reclamos">
            {items.map((reclamo) => (
              <li key={reclamo.id} className={`reclamo reclamo-${reclamo.estado}`}>
                <div>
                  <strong>{reclamo.categoria}</strong>
                  <p>{reclamo.descripcion}</p>
                  {reclamo.zona && (
                    <span className="reclamo-zona">
                      <Icon name="pin" size={15} /> {reclamo.zona}
                    </span>
                  )}
                </div>

                <select value={reclamo.estado} onChange={(e) => actualizarEstado(reclamo.id, e.target.value)}>
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {ETIQUETAS_ESTADO[estado]}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
          <CargarMas hayMas={hayMas} cargando={cargandoMas} onClick={cargarMas} />
        </ListaEstado>
      ) : (
        <p className="texto-suave">
          El listado completo lo revisa el equipo comunal.
          {user && (
            <>
              {' '}
              Podés ver el estado de los reclamos que hiciste vos en <Link to="/mis-publicaciones">Mis publicaciones</Link>.
            </>
          )}
        </p>
      )}
    </section>
  )
}
