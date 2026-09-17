import { Link } from 'react-router-dom'
import Icon from '../../shared/components/Icon.jsx'
import WhatsappFlotante from '../../shared/components/WhatsappFlotante.jsx'
import AvisosInicio from './AvisosInicio.jsx'
import CarruselAvisos from './CarruselAvisos.jsx'

const ACCESOS = [
  { to: '/mapa', icono: 'mapa', titulo: 'Mapa' },
  { to: '/directorio', icono: 'tienda', titulo: 'Servicios y Comercios' },
  { to: '/empleos', icono: 'maletin', titulo: 'Empleo' },
  { to: '/reclamos', icono: 'alerta', titulo: 'Reclamos' },
  { to: '/instituciones', icono: 'edificio', titulo: 'Instituciones' },
]

export default function InicioPage() {
  return (
    <section>
      <h1 className="sr-only">El Naranjo Conecta</h1>

      <CarruselAvisos />

      <div className="accesos-rapidos">
        {ACCESOS.map((acceso) => (
          <Link key={acceso.to} to={acceso.to} className="acceso-rapido">
            <Icon name={acceso.icono} size={18} />
            {acceso.titulo}
          </Link>
        ))}
      </div>

      <AvisosInicio />
      <WhatsappFlotante />
    </section>
  )
}
