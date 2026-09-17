import { Route, Routes } from 'react-router-dom'
import AdminPage from './features/admin/AdminPage.jsx'
import AvisosPage from './features/avisos/AvisosPage.jsx'
import LoginPage from './features/auth/LoginPage.jsx'
import RegisterPage from './features/auth/RegisterPage.jsx'
import ComerciosPage from './features/comercios/ComerciosPage.jsx'
import DetallePage from './features/detalle/DetallePage.jsx'
import EmergenciasPage from './features/emergencias/EmergenciasPage.jsx'
import EmpleosPage from './features/empleos/EmpleosPage.jsx'
import InicioPage from './features/home/InicioPage.jsx'
import InstitucionesPage from './features/instituciones/InstitucionesPage.jsx'
import MapaPage from './features/mapa/MapaPage.jsx'
import MisPublicacionesPage from './features/mis/MisPublicacionesPage.jsx'
import ProductoresPage from './features/productores/ProductoresPage.jsx'
import ReclamosPage from './features/reclamos/ReclamosPage.jsx'
import ServiciosPage from './features/servicios/ServiciosPage.jsx'
import Layout from './shared/components/Layout.jsx'
import ProtectedRoute from './shared/components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<InicioPage />} />
        <Route path="mapa" element={<MapaPage />} />
        <Route path="servicios" element={<ServiciosPage />} />
        <Route path="servicios/:id" element={<DetallePage moduloKey="servicios" />} />
        <Route path="comercios" element={<ComerciosPage />} />
        <Route path="comercios/:id" element={<DetallePage moduloKey="comercios" />} />
        <Route path="productores" element={<ProductoresPage />} />
        <Route path="productores/:id" element={<DetallePage moduloKey="productores" />} />
        <Route path="empleos" element={<EmpleosPage />} />
        <Route path="empleos/:id" element={<DetallePage moduloKey="empleos" />} />
        <Route path="reclamos" element={<ReclamosPage />} />
        <Route path="reclamos/:id" element={<DetallePage moduloKey="reclamos" />} />
        <Route path="instituciones" element={<InstitucionesPage />} />
        <Route path="instituciones/:id" element={<DetallePage moduloKey="instituciones" />} />
        <Route path="avisos" element={<AvisosPage />} />
        <Route path="emergencias" element={<EmergenciasPage />} />
        <Route
          path="mis-publicaciones"
          element={
            <ProtectedRoute>
              <MisPublicacionesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute soloAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="ingresar" element={<LoginPage />} />
        <Route path="registrarme" element={<RegisterPage />} />
        <Route path="*" element={<InicioPage />} />
      </Route>
    </Routes>
  )
}
