import { useState } from 'react'
import CargarMas from '../../shared/components/CargarMas.jsx'
import Icon from '../../shared/components/Icon.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Tarjeta from '../../shared/components/Tarjeta.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import { listarServicios } from './api.js'
import ServicioForm from './ServicioForm.jsx'

export default function ServiciosPage() {
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const [ubicacion, setUbicacion] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(listarServicios, { q, ...ubicacion })

  function buscarCercaDeMi() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUbicacion(null),
    )
  }

  return (
    <section>
      <header className="seccion-header">
        <h1>Empleo y Servicios</h1>
        <p>Albañiles, electricistas, plomeros, técnicos y más oficios de El Naranjo.</p>
      </header>

      <div className="barra-acciones">
        <input
          type="search"
          placeholder="Buscar un oficio (ej: electricista)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="button" onClick={buscarCercaDeMi}>
          <Icon name="pin" size={16} /> Buscar cerca de mí
        </button>
        {user && (
          <button type="button" onClick={() => setMostrarForm(true)}>
            Publicar mi servicio
          </button>
        )}
      </div>

      {mostrarForm && (
        <Modal titulo="Publicar un servicio" onCerrar={() => setMostrarForm(false)}>
          <ServicioForm
            onCreado={() => {
              setMostrarForm(false)
              recargar()
            }}
          />
        </Modal>
      )}

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && items.length === 0}>
        <div className="grilla-tarjetas">
          {items.map((servicio) => (
            <Tarjeta
              key={servicio.id}
              icono="herramienta"
              titulo={servicio.titulo}
              subtitulo={servicio.subcategoria}
              descripcion={servicio.descripcion}
              zona={servicio.zona}
              whatsapp={servicio.whatsapp}
              imagen={servicio.foto_url}
              enlace={`/servicios/${servicio.id}`}
              extra={
                servicio.distancia_km != null && (
                  <span>
                    <Icon name="mapa" size={15} /> {Number(servicio.distancia_km).toFixed(1)} km
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
