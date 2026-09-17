import { useState } from 'react'
import CargarMas from '../../shared/components/CargarMas.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Tarjeta from '../../shared/components/Tarjeta.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import ProductorForm from './ProductorForm.jsx'
import { listarProductores } from './api.js'

export default function ProductoresPage() {
  const { user } = useAuth()
  const [mostrarForm, setMostrarForm] = useState(false)
  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(listarProductores)

  return (
    <section>
      <header className="seccion-header">
        <h1>Productores locales</h1>
        <p>Producción agrícola, ganadera, insumos y servicios rurales.</p>
      </header>

      {user && (
        <div className="barra-acciones">
          <button type="button" onClick={() => setMostrarForm(true)}>
            Publicar como productor
          </button>
        </div>
      )}

      {mostrarForm && (
        <Modal titulo="Publicar como productor" onCerrar={() => setMostrarForm(false)}>
          <ProductorForm
            onCreado={() => {
              setMostrarForm(false)
              recargar()
            }}
          />
        </Modal>
      )}

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && items.length === 0}>
        <div className="grilla-tarjetas">
          {items.map((productor) => (
            <Tarjeta
              key={productor.id}
              icono="hoja"
              titulo={productor.nombre}
              subtitulo={productor.que_produce}
              descripcion={productor.que_vende}
              zona={productor.zona}
              whatsapp={productor.whatsapp}
              enlace={`/productores/${productor.id}`}
              calificacion={productor.calificacion}
            />
          ))}
        </div>
        <CargarMas hayMas={hayMas} cargando={cargandoMas} onClick={cargarMas} />
      </ListaEstado>
    </section>
  )
}
