import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import Icon from './Icon.jsx'
import NaranjaMark from './NaranjaMark.jsx'

const enlaces = [
  { to: '/', label: 'Inicio', fin: true, icono: 'pin' },
  { to: '/mapa', label: 'Mapa', icono: 'mapa' },
  { to: '/servicios', label: 'Servicios', icono: 'herramienta' },
  { to: '/comercios', label: 'Comercios', icono: 'tienda' },
  { to: '/productores', label: 'Productores', icono: 'hoja' },
  { to: '/empleos', label: 'Empleo', icono: 'maletin' },
  { to: '/reclamos', label: 'Reclamos', icono: 'alerta' },
  { to: '/instituciones', label: 'Instituciones', icono: 'edificio' },
  { to: '/avisos', label: 'Avisos', icono: 'megafono' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    setMenuAbierto(false)
  }, [location.pathname])

  return (
    <div className="layout">
      <a className="salto-emergencias" href="/emergencias">
        <Icon name="alerta" size={16} /> Emergencias
      </a>

      <header className="header">
        <div className="header-fila">
          <NavLink to="/" className="marca">
            <NaranjaMark size={26} />
            El Naranjo Conecta
          </NavLink>

          <button
            type="button"
            className="btn-menu"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          >
            <Icon name={menuAbierto ? 'cerrar' : 'menu'} size={22} />
          </button>

          <div className={`sesion ${menuAbierto ? 'sesion-abierta' : ''}`}>
            {user ? (
              <>
                <span>{user.nombre}</span>
                <button type="button" onClick={logout}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/ingresar">Ingresar</NavLink>
                <NavLink to="/registrarme" className="btn-registrarme">
                  Crear cuenta
                </NavLink>
              </>
            )}
          </div>
        </div>

        <nav className={`nav ${menuAbierto ? 'nav-abierta' : ''}`}>
          {enlaces.map((enlace) => (
            <NavLink key={enlace.to} to={enlace.to} end={enlace.fin}>
              <Icon name={enlace.icono} size={17} />
              {enlace.label}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/mis-publicaciones">
              <Icon name="lista" size={17} />
              Mis publicaciones
            </NavLink>
          )}
          {user?.rol === 'admin' && (
            <NavLink to="/admin">
              <Icon name="escudo" size={17} />
              Panel
            </NavLink>
          )}
        </nav>
      </header>

      <main className="contenido">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className="footer">
        <p>El Naranjo Conecta — El Naranjo, Burruyacú, Tucumán.</p>
      </footer>
    </div>
  )
}
