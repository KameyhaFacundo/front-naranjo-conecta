import { Link } from 'react-router-dom'
import CompartirButton from './CompartirButton.jsx'
import Icon from './Icon.jsx'
import WhatsappButton from './WhatsappButton.jsx'

/**
 * Tarjeta genérica para servicios, comercios, productores, empleos, etc.
 * Si se pasa `imagen`, arriba se muestra la foto (o un placeholder de marca
 * cuando el módulo soporta foto pero la publicación no tiene una).
 * `enlace` es la ruta de la ficha de detalle: el título linkea ahí y el
 * botón de compartir arma el link con esa ruta.
 */
export default function Tarjeta({
  titulo,
  icono,
  subtitulo,
  descripcion,
  zona,
  whatsapp,
  extra,
  imagen,
  enlace,
}) {
  const tieneMedia = imagen !== undefined

  return (
    <article className="tarjeta">
      {tieneMedia && (
        <div className="tarjeta-media">
          {imagen ? (
            <img src={imagen} alt={titulo} loading="lazy" />
          ) : (
            <span className="tarjeta-media-placeholder">{icono && <Icon name={icono} size={38} />}</span>
          )}
        </div>
      )}

      <div className="tarjeta-cuerpo">
        <div className="tarjeta-encabezado">
          {icono && (!tieneMedia || imagen) && <Icon name={icono} className="tarjeta-icono" size={20} />}
          <h3>{enlace ? <Link to={enlace}>{titulo}</Link> : titulo}</h3>
          {enlace && <CompartirButton titulo={titulo} texto={descripcion} ruta={enlace} />}
        </div>
        {subtitulo && <p className="tarjeta-subtitulo">{subtitulo}</p>}
        {descripcion && <p className="tarjeta-descripcion">{descripcion}</p>}
        <div className="tarjeta-meta">
          {zona && (
            <span>
              <Icon name="pin" size={15} /> {zona}
            </span>
          )}
          {extra}
        </div>
        <WhatsappButton numero={whatsapp} />
      </div>
    </article>
  )
}
