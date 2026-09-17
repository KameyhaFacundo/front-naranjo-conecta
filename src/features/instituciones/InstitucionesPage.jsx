import { useState } from 'react'
import CargarMas from '../../shared/components/CargarMas.jsx'
import Icon from '../../shared/components/Icon.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Tarjeta from '../../shared/components/Tarjeta.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import InstitucionForm from './InstitucionForm.jsx'
import { listarInstituciones } from './api.js'

export default function InstitucionesPage() {
  const { user } = useAuth()
  const [mostrarForm, setMostrarForm] = useState(false)
  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(listarInstituciones)

  return (
    <section>
      <header className="seccion-header">
        <h1>Instituciones</h1>
        <p>Escuelas, salud, comuna, clubes e instituciones comunitarias.</p>
      </header>

      {user?.rol === 'admin' && (
        <div className="barra-acciones">
          <button type="button" onClick={() => setMostrarForm(true)}>
            Agregar institución
          </button>
        </div>
      )}

      {mostrarForm && (
        <Modal titulo="Agregar institución" onCerrar={() => setMostrarForm(false)}>
          <InstitucionForm
            onCreado={() => {
              setMostrarForm(false)
              recargar()
            }}
          />
        </Modal>
      )}

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && items.length === 0}>
        <div className="grilla-tarjetas">
          {items.map((institucion) => (
            <Tarjeta
              key={institucion.id}
              icono="edificio"
              titulo={institucion.nombre}
              subtitulo={institucion.tipo}
              descripcion={institucion.descripcion}
              zona={institucion.direccion}
              whatsapp={null}
              enlace={`/instituciones/${institucion.id}`}
              extra={
                institucion.telefono && (
                  <span>
                    <Icon name="telefono" size={15} /> {institucion.telefono}
                  </span>
                )
              }
            />
          ))}
        </div>
        <CargarMas hayMas={hayMas} cargando={cargandoMas} onClick={cargarMas} />
      </ListaEstado>
    </section>
  )
}
