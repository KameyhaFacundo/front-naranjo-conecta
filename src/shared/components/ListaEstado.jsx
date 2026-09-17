import Icon from './Icon.jsx'

export default function ListaEstado({ cargando, error, vacio, children }) {
  if (cargando) return <p className="estado-carga">Cargando…</p>
  if (error) return <p className="estado-error">No se pudo cargar la información. Probá de nuevo en un rato.</p>
  if (vacio) {
    return (
      <div className="estado-vacio estado-vacio-centrado">
        <span className="estado-vacio-icono">
          <Icon name="buscar" size={26} />
        </span>
        <p>Todavía no hay publicaciones acá.</p>
      </div>
    )
  }
  return children
}
