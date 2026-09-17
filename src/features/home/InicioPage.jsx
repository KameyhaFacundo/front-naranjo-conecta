import { Link } from 'react-router-dom'
import Icon from '../../shared/components/Icon.jsx'
import SelloCitrico from '../../shared/components/SelloCitrico.jsx'

const ACCESOS = [
  { to: '/mapa', icono: 'mapa', titulo: 'Mapa', texto: 'Comercios, servicios, instituciones y reclamos cerca tuyo.' },
  { to: '/servicios', icono: 'herramienta', titulo: 'Empleo y Servicios', texto: 'Encontrá un oficio o publicá el tuyo.' },
  { to: '/comercios', icono: 'tienda', titulo: 'Comercios', texto: 'El directorio de comercios de El Naranjo.' },
  { to: '/reclamos', icono: 'alerta', titulo: 'Reclamos', texto: 'Alumbrado, calles, agua y más.' },
]

export default function InicioPage() {
  return (
    <section>
      <header className="hero">
        <div className="hero-texto">
          <span className="hero-eyebrow">
            <Icon name="hoja" size={15} /> Comunidad de El Naranjo, Tucumán
          </span>
          <h1>Todo El Naranjo, en un solo lugar</h1>
          <p className="hero-sub">
            Encontrá comercios, oficios, productores e instituciones cerca tuyo. Publicá lo tuyo y que te
            contacten directo por WhatsApp.
          </p>
          <div className="hero-cta">
            <Link to="/mapa" className="btn">
              <Icon name="mapa" size={17} /> Ver el mapa
            </Link>
            <Link to="/servicios" className="btn-fantasma">
              Buscar un servicio
            </Link>
          </div>
        </div>
        <SelloCitrico />
      </header>

      <div className="accesos">
        {ACCESOS.map((acceso) => (
          <Link key={acceso.to} to={acceso.to} className="acceso">
            <span className="acceso-icono">
              <Icon name={acceso.icono} size={24} />
            </span>
            <h2>{acceso.titulo}</h2>
            <p>{acceso.texto}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
