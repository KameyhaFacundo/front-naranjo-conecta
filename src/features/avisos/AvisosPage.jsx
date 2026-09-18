import { useState } from 'react'
import CargarMas from '../../shared/components/CargarMas.jsx'
import Icon from '../../shared/components/Icon.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import AvisoForm from './AvisoForm.jsx'
import { listarAvisos } from './api.js'
import { ETIQUETAS_TIPO_AVISO } from './tipos.js'

export default function AvisosPage() {
  const { user } = useAuth()
  const [mostrarForm, setMostrarForm] = useState(false)
  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(listarAvisos)

  return (
    <section>
      <header className="seccion-header">
        <h1>Comunicación comunitaria</h1>
        <p>Comunicados, reuniones, eventos, obras y cortes de servicios.</p>
      </header>

      {user?.rol === 'admin' && (
        <div className="barra-acciones">
          <button type="button" onClick={() => setMostrarForm(true)}>
            Publicar un aviso
          </button>
        </div>
      )}

      {mostrarForm && (
        <Modal titulo="Publicar un aviso" onCerrar={() => setMostrarForm(false)}>
          <AvisoForm
            onCreado={() => {
              setMostrarForm(false)
              recargar()
            }}
          />
        </Modal>
      )}

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && items.length === 0} variante="lista" cantidad={4}>
        <ul className="lista-avisos">
          {items.map((aviso) => (
            <li key={aviso.id} className="aviso">
              {aviso.foto_url && <img className="aviso-foto" src={aviso.foto_url} alt="" loading="lazy" />}
              <span className="aviso-tipo">
                <Icon name="megafono" size={15} /> {ETIQUETAS_TIPO_AVISO[aviso.tipo] ?? aviso.tipo}
              </span>
              <h3>{aviso.titulo}</h3>
              <p>{aviso.cuerpo}</p>
              {aviso.fecha_evento && (
                <time dateTime={aviso.fecha_evento}>{new Date(aviso.fecha_evento).toLocaleString('es-AR')}</time>
              )}
            </li>
          ))}
        </ul>
        <CargarMas hayMas={hayMas} cargando={cargandoMas} onClick={cargarMas} />
      </ListaEstado>
    </section>
  )
}
