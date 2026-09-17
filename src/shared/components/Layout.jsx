import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import Icon from './Icon.jsx'
import NaranjaMark from './NaranjaMark.jsx'

const enlaces = [
  { to: '/', label: 'Inicio', fin: true, icono: 'pin' },
  { to: '/mapa', label: 'Mapa', icono: 'mapa' },
  { to: '/directorio', label: 'Servicios y Comercios', icono: 'tienda' },
  { to: '/empleos', label: 'Empleo', icono: 'maletin' },
  { to: '/reclamos', label: 'Reclamos', icono: 'alerta' },
  { to: '/instituciones', label: 'Instituciones', icono: 'edificio' },
  { to: '/avisos', label: 'Avisos', icono: 'megafono' },
]

const RUTAS_AUTH = ['/ingresar', '/registrarme']

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const enPaginaAuth = !user && RUTAS_AUTH.includes(location.pathname)

  useEffect(() => {
    setMenuAbierto(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuAbierto])

  return (
    <div className="layout">
      <header className={`header ${menuAbierto ? 'header-menu-abierto' : ''}`}>
        <div className="header-fila">
          {enPaginaAuth ? (
            <Link to="/" className="volver-flecha" aria-label="Volver al inicio">
              ←
            </Link>
          ) : (
            <div className="marca-fila">
              <NavLink to="/" className="marca">
                <NaranjaMark size={26} />
                El Naranjo Conecta
              </NavLink>

              <Link to="/emergencias" className="btn-emergencia">
                <Icon name="alerta" size={16} /> <span>Emergencias</span>
              </Link>
            </div>
          )}

          {!enPaginaAuth && (
            <button
              type="button"
              className="btn-menu"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-expanded={menuAbierto}
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              <Icon name={menuAbierto ? 'cerrar' : 'menu'} size={22} />
            </button>
          )}

          {!enPaginaAuth && (
            <div className={`sesion ${menuAbierto ? 'sesion-abierta' : ''}`}>
              {user ? (
                <>
                  <NavLink to="/perfil" className="sesion-nombre">
                    <Icon name="usuario" size={15} /> {user.nombre}
                  </NavLink>
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
          )}
        </div>

        {/* En login/registro no hace falta el nav: el foco es completar el
            formulario, y ese form ya tiene su propio link para cambiar
            entre ingresar y crear cuenta. */}
        {!enPaginaAuth && (
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
            {user && (
              <NavLink to="/perfil">
                <Icon name="usuario" size={17} />
                Mi perfil
              </NavLink>
            )}
            {user?.rol === 'admin' && (
              <NavLink to="/admin">
                <Icon name="escudo" size={17} />
                Panel
              </NavLink>
            )}
          </nav>
        )}
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
