import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { user, cargando } = useAuth()
  const location = useLocation()

  if (cargando) return <p className="estado-carga">Cargando…</p>

  if (!user) {
    return <Navigate to="/ingresar" state={{ from: location }} replace />
  }

  if (soloAdmin && user.rol !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
