import Icon from './Icon.jsx'

const ANCHOS = ['92%', '68%', '84%', '76%']
function ancho(i) {
  return ANCHOS[i % ANCHOS.length]
}

function EsqueletoTarjetas({ cantidad }) {
  return (
    <div className="grilla-tarjetas">
      {Array.from({ length: cantidad }).map((_, i) => (
        <div key={i} className="esqueleto-tarjeta">
          <div className="esqueleto esqueleto-tarjeta-media" />
          <div className="esqueleto-tarjeta-cuerpo">
            <div className="esqueleto esqueleto-linea" style={{ width: '75%' }} />
            <div className="esqueleto esqueleto-linea" style={{ width: '45%' }} />
            <div className="esqueleto esqueleto-linea" style={{ width: ancho(i) }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function EsqueletoLista({ cantidad }) {
  return (
    <ul className="lista-reclamos">
      {Array.from({ length: cantidad }).map((_, i) => (
        <li key={i} className="esqueleto-fila">
          <div className="esqueleto esqueleto-linea" style={{ width: '30%' }} />
          <div className="esqueleto esqueleto-linea" style={{ width: ancho(i) }} />
        </li>
      ))}
    </ul>
  )
}

function EsqueletoTabla({ cantidad }) {
  return (
    <div className="tabla-admin-scroll">
      <div className="esqueleto-tabla">
        {Array.from({ length: cantidad }).map((_, i) => (
          <div key={i} className="esqueleto-tabla-fila">
            <div className="esqueleto esqueleto-tabla-celda esqueleto-tabla-celda-miniatura" />
            <div className="esqueleto esqueleto-tabla-celda" style={{ flex: 2 }} />
            <div className="esqueleto esqueleto-tabla-celda" style={{ flex: 1 }} />
            <div className="esqueleto esqueleto-tabla-celda" style={{ flex: 1, width: ancho(i) }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function EsqueletoResenas({ cantidad }) {
  return (
    <ul className="resenas-lista">
      {Array.from({ length: cantidad }).map((_, i) => (
        <li key={i} className="resena">
          <div className="esqueleto esqueleto-linea" style={{ width: '35%', marginBottom: '0.6rem' }} />
          <div className="esqueleto esqueleto-linea" style={{ width: ancho(i) }} />
        </li>
      ))}
    </ul>
  )
}

function EsqueletoDetalle() {
  return (
    <div>
      <div className="esqueleto detalle-imagen" />
      <div className="esqueleto esqueleto-linea" style={{ width: '30%', height: '1.5rem', margin: '1.25rem 0 0.85rem' }} />
      <div className="detalle-campos">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="detalle-campo">
            <div className="esqueleto esqueleto-linea" style={{ width: '25%', height: '0.7rem', marginBottom: '0.4rem' }} />
            <div className="esqueleto esqueleto-linea" style={{ width: ancho(i) }} />
          </div>
        ))}
      </div>
    </div>
  )
}

const ESQUELETOS = {
  tarjetas: EsqueletoTarjetas,
  lista: EsqueletoLista,
  tabla: EsqueletoTabla,
  resenas: EsqueletoResenas,
  detalle: EsqueletoDetalle,
}

/**
 * `variante` elige la forma del esqueleto de carga (mismo layout que el
 * contenido real, para que no "salte" la página cuando llegan los datos).
 * Sin `variante`, se usa el spinner de texto de siempre.
 */
export default function ListaEstado({ cargando, error, vacio, variante, cantidad, children }) {
  if (cargando) {
    const Esqueleto = variante && ESQUELETOS[variante]
    if (Esqueleto) {
      return (
        <div aria-busy="true">
          <span className="sr-only" role="status">
            Cargando…
          </span>
          <Esqueleto cantidad={cantidad ?? 4} />
        </div>
      )
    }
    return <p className="estado-carga">Cargando…</p>
  }
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
