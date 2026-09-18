import { useState } from 'react'
import CargarMas from '../../shared/components/CargarMas.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Tarjeta from '../../shared/components/Tarjeta.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import EmpleoForm from './EmpleoForm.jsx'
import { listarEmpleos } from './api.js'

const TABS = [
  { value: '', label: 'Todo' },
  { value: 'busco_trabajo', label: 'Busco trabajo' },
  { value: 'busco_trabajador', label: 'Busco trabajador' },
]

export default function EmpleosPage() {
  const { user } = useAuth()
  const [tipo, setTipo] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(listarEmpleos, { tipo })

  return (
    <section>
      <header className="seccion-header">
        <h1>Empleo</h1>
        <p>Quien busca trabajo y quien busca trabajador, en un mismo lugar.</p>
      </header>

      <div className="barra-acciones">
        <div className="pestañas">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={tipo === tab.value ? 'activa' : ''}
              onClick={() => setTipo(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {user && (
          <button type="button" onClick={() => setMostrarForm(true)}>
            Publicar
          </button>
        )}
      </div>

      {mostrarForm && (
        <Modal titulo="Publicar en Empleo" onCerrar={() => setMostrarForm(false)}>
          <EmpleoForm
            onCreado={() => {
              setMostrarForm(false)
              recargar()
            }}
          />
        </Modal>
      )}

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && items.length === 0} variante="tarjetas" cantidad={6}>
        <div className="grilla-tarjetas">
          {items.map((empleo) => (
            <Tarjeta
              key={empleo.id}
              icono="maletin"
              titulo={empleo.titulo}
              subtitulo={empleo.tipo === 'busco_trabajo' ? 'Busco trabajo' : 'Busco trabajador'}
              descripcion={empleo.descripcion}
              zona={empleo.zona}
              whatsapp={empleo.whatsapp}
              enlace={`/empleos/${empleo.id}`}
            />
          ))}
        </div>
        <CargarMas hayMas={hayMas} cargando={cargandoMas} onClick={cargarMas} />
      </ListaEstado>
    </section>
  )
}
