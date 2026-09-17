import { useState } from 'react'
import CargarMas from '../../shared/components/CargarMas.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Tarjeta from '../../shared/components/Tarjeta.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import ComercioForm from './ComercioForm.jsx'
import { listarComercios } from './api.js'

export default function ComerciosPage() {
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(listarComercios, { q })

  return (
    <section>
      <header className="seccion-header">
        <h1>Comercios locales</h1>
        <p>Almacenes, kioscos, ferreterías, gastronomía y más.</p>
      </header>

      <div className="barra-acciones">
        <input type="search" placeholder="Buscar un comercio" value={q} onChange={(e) => setQ(e.target.value)} />
        {user && (
          <button type="button" onClick={() => setMostrarForm(true)}>
            Publicar mi comercio
          </button>
        )}
      </div>

      {mostrarForm && (
        <Modal titulo="Publicar un comercio" onCerrar={() => setMostrarForm(false)}>
          <ComercioForm
            onCreado={() => {
              setMostrarForm(false)
              recargar()
            }}
          />
        </Modal>
      )}

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && items.length === 0}>
        <div className="grilla-tarjetas">
          {items.map((comercio) => (
            <Tarjeta
              key={comercio.id}
              icono="tienda"
              titulo={comercio.nombre}
              descripcion={comercio.descripcion}
              zona={comercio.direccion ?? comercio.zona}
              whatsapp={comercio.whatsapp}
              imagen={comercio.logo_url}
              enlace={`/comercios/${comercio.id}`}
              calificacion={comercio.calificacion}
            />
          ))}
        </div>
        <CargarMas hayMas={hayMas} cargando={cargandoMas} onClick={cargarMas} />
      </ListaEstado>
    </section>
  )
}
