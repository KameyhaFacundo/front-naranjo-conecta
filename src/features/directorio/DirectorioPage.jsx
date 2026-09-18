import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Icon from '../../shared/components/Icon.jsx'
import ListaEstado from '../../shared/components/ListaEstado.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Tarjeta from '../../shared/components/Tarjeta.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'
import { listarComercios } from '../comercios/api.js'
import ComercioForm from '../comercios/ComercioForm.jsx'
import { listarProductores } from '../productores/api.js'
import ProductorForm from '../productores/ProductorForm.jsx'
import { listarServicios } from '../servicios/api.js'
import ServicioForm from '../servicios/ServicioForm.jsx'

export const TIPOS_DIRECTORIO = [
  {
    clave: 'servicios',
    etiqueta: 'Servicios',
    etiquetaBoton: 'Servicio',
    icono: 'herramienta',
    listar: listarServicios,
    Form: ServicioForm,
    tituloForm: 'Publicar un servicio',
    aTarjeta: (i) => ({
      titulo: i.titulo,
      subtitulo: i.subcategoria,
      descripcion: i.descripcion,
      zona: i.zona,
      whatsapp: i.whatsapp,
      imagen: i.foto_url,
      calificacion: i.calificacion,
    }),
    buscable: (i) => `${i.titulo ?? ''} ${i.descripcion ?? ''}`,
  },
  {
    clave: 'comercios',
    etiqueta: 'Comercios',
    etiquetaBoton: 'Comercio',
    icono: 'tienda',
    listar: listarComercios,
    Form: ComercioForm,
    tituloForm: 'Publicar un comercio',
    aTarjeta: (i) => ({
      titulo: i.nombre,
      descripcion: i.descripcion,
      zona: i.direccion ?? i.zona,
      whatsapp: i.whatsapp,
      imagen: i.logo_url,
      calificacion: i.calificacion,
    }),
    buscable: (i) => `${i.nombre ?? ''} ${i.descripcion ?? ''}`,
  },
  {
    clave: 'productores',
    etiqueta: 'Productores',
    etiquetaBoton: 'Productor',
    icono: 'hoja',
    listar: listarProductores,
    Form: ProductorForm,
    tituloForm: 'Publicar como productor',
    aTarjeta: (i) => ({
      titulo: i.nombre,
      subtitulo: i.que_produce,
      descripcion: i.que_vende,
      zona: i.zona,
      whatsapp: i.whatsapp,
      calificacion: i.calificacion,
    }),
    buscable: (i) => `${i.nombre ?? ''} ${i.que_produce ?? ''} ${i.que_vende ?? ''}`,
  },
]

/**
 * Servicios, comercios y productores en un solo lugar, filtrable por tipo.
 * Cada fuente trae su primera página (20) y se filtra/mezcla en el cliente
 * porque el backend de estos tres módulos quedó separado a propósito.
 */
export default function DirectorioPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const tipoUrl = searchParams.get('tipo')
  const [tipo, setTipo] = useState(TIPOS_DIRECTORIO.some((t) => t.clave === tipoUrl) ? tipoUrl : 'todos')
  const [q, setQ] = useState('')
  const [porTipo, setPorTipo] = useState({})
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [formAbierto, setFormAbierto] = useState(null)

  const cargar = useCallback(() => {
    setCargando(true)
    setError(null)
    Promise.all(TIPOS_DIRECTORIO.map((t) => t.listar().then((r) => r.data ?? r)))
      .then((resultados) => {
        const nuevo = {}
        TIPOS_DIRECTORIO.forEach((t, i) => {
          nuevo[t.clave] = resultados[i]
        })
        setPorTipo(nuevo)
      })
      .catch(setError)
      .finally(() => setCargando(false))
  }, [])

  useEffect(cargar, [cargar])

  useEffect(() => {
    setSearchParams(tipo === 'todos' ? {} : { tipo }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo])

  const items = useMemo(() => {
    const tiposAMostrar = tipo === 'todos' ? TIPOS_DIRECTORIO : TIPOS_DIRECTORIO.filter((t) => t.clave === tipo)
    const listas = tiposAMostrar.map((t) => (porTipo[t.clave] ?? []).map((item) => ({ tipo: t, item })))

    // Intercalado (round-robin) para que "Todo" se sienta mezclado y no
    // agrupado por tipo (cada fuente ya viene ordenada por más reciente).
    const mezclado = []
    const maxLen = Math.max(0, ...listas.map((l) => l.length))
    for (let i = 0; i < maxLen; i += 1) {
      listas.forEach((lista) => {
        if (lista[i]) mezclado.push(lista[i])
      })
    }

    const texto = q.trim().toLowerCase()
    if (!texto) return mezclado
    return mezclado.filter(({ tipo: t, item }) => t.buscable(item).toLowerCase().includes(texto))
  }, [porTipo, tipo, q])

  return (
    <section>
      <header className="seccion-header">
        <h1>Servicios, comercios y productores</h1>
        <p>Todo lo que ofrecen los vecinos de El Naranjo, en un solo lugar.</p>
      </header>

      <div className="pestañas">
        <button type="button" className={tipo === 'todos' ? 'activa' : ''} onClick={() => setTipo('todos')}>
          Todo
        </button>
        {TIPOS_DIRECTORIO.map((t) => (
          <button
            key={t.clave}
            type="button"
            className={tipo === t.clave ? 'activa' : ''}
            onClick={() => setTipo(t.clave)}
          >
            <Icon name={t.icono} size={16} /> {t.etiqueta}
          </button>
        ))}
      </div>

      <div className="barra-acciones">
        <input type="search" placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} />
        {user && (
          <div className="directorio-publicar">
            {TIPOS_DIRECTORIO.map((t) => (
              <button
                key={t.clave}
                type="button"
                className="btn-secundario"
                onClick={() => setFormAbierto(t.clave)}
              >
                <Icon name={t.icono} size={15} /> {t.etiquetaBoton}
              </button>
            ))}
          </div>
        )}
      </div>

      {formAbierto &&
        (() => {
          const activo = TIPOS_DIRECTORIO.find((t) => t.clave === formAbierto)
          const { Form } = activo
          return (
            <Modal titulo={activo.tituloForm} onCerrar={() => setFormAbierto(null)}>
              <Form
                onCreado={() => {
                  setFormAbierto(null)
                  cargar()
                }}
              />
            </Modal>
          )
        })()}

      <ListaEstado cargando={cargando} error={error} vacio={!cargando && items.length === 0} variante="tarjetas" cantidad={6}>
        <div className="grilla-tarjetas">
          {items.map(({ tipo: t, item }) => (
            <Tarjeta key={`${t.clave}-${item.id}`} icono={t.icono} enlace={`/${t.clave}/${item.id}`} {...t.aTarjeta(item)} />
          ))}
        </div>
      </ListaEstado>
    </section>
  )
}
