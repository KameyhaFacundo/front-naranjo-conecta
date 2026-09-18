import { useMemo, useState } from 'react'
import CargarMas from '../../shared/components/CargarMas.jsx'
import Icon from '../../shared/components/Icon.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Tarjeta from '../../shared/components/Tarjeta.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { useListado } from '../../shared/hooks/useListado.js'
import InstitucionForm from './InstitucionForm.jsx'
import { listarInstituciones } from './api.js'

const CAMPOS_BUSQUEDA = ['nombre', 'descripcion', 'direccion', 'tipo', 'horarios']

export default function InstitucionesPage() {
  const { user } = useAuth()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [q, setQ] = useState('')
  const { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas } = useListado(listarInstituciones)

  const texto = q.trim().toLowerCase()
  const filtradas = useMemo(() => {
    if (!texto) return items
    return items.filter((i) => CAMPOS_BUSQUEDA.some((campo) => String(i[campo] ?? '').toLowerCase().includes(texto)))
  }, [items, texto])

  return (
    <section>
      <header className="seccion-header">
        <h1>Instituciones</h1>
        <p>Escuelas, salud, comuna, clubes e instituciones comunitarias.</p>
      </header>

      <div className="barra-acciones">
        <input
          type="search"
          placeholder="Buscar institución..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {user?.rol === 'admin' && (
          <button type="button" onClick={() => setMostrarForm(true)}>
            Agregar institución
          </button>
        )}
      </div>

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

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && filtradas.length === 0} variante="tarjetas" cantidad={6}>
        <div className="grilla-tarjetas">
          {filtradas.map((institucion) => (
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
