import { Link } from 'react-router-dom'
import Icon from '../../shared/components/Icon.jsx'
import SelloCitrico from '../../shared/components/SelloCitrico.jsx'
import CarruselAvisos from './CarruselAvisos.jsx'

const ACCESOS = [
  { to: '/mapa', icono: 'mapa', titulo: 'Mapa' },
  { to: '/servicios', icono: 'herramienta', titulo: 'Servicios' },
  { to: '/comercios', icono: 'tienda', titulo: 'Comercios' },
  { to: '/productores', icono: 'hoja', titulo: 'Productores' },
  { to: '/empleos', icono: 'maletin', titulo: 'Empleo' },
  { to: '/reclamos', icono: 'alerta', titulo: 'Reclamos' },
  { to: '/instituciones', icono: 'edificio', titulo: 'Instituciones' },
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

      <CarruselAvisos />

      <div className="accesos-rapidos">
        {ACCESOS.map((acceso) => (
          <Link key={acceso.to} to={acceso.to} className="acceso-rapido">
            <Icon name={acceso.icono} size={18} />
            {acceso.titulo}
          </Link>
        ))}
      </div>
    </section>
  )
}
