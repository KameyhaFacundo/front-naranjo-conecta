import { useState } from 'react'
import { useAuth } from '../../shared/hooks/useAuth.jsx'

// El rol (vecino, prestador, comerciante, etc.) se elige una sola vez al
// crear la cuenta y no se puede tocar desde acá — evita que alguien se
// autoasigne otro rol después de registrarse.
export default function PerfilPage() {
  const { user, actualizarPerfil } = useAuth()
  const [form, setForm] = useState({
    nombre: user.nombre ?? '',
    telefono: user.telefono ?? '',
    whatsapp: user.whatsapp ?? '',
    zona: user.zona ?? '',
  })
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)

  function actualizarCampo(campo) {
    return (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }))
  }

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    setExito(false)
    try {
      const payload = { ...form }

      if (passwordNueva) {
        payload.password = passwordNueva
        payload.password_actual = passwordActual
      }

      await actualizarPerfil(payload)
      setPasswordActual('')
      setPasswordNueva('')
      setExito(true)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo guardar. Revisá los datos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="pagina-auth">
      <form className="formulario" onSubmit={enviar}>
        <div className="auth-encabezado">
          <h1>Mi perfil</h1>
          <p>Actualizá tus datos. El email no se puede cambiar.</p>
        </div>

        {error && <p className="formulario-error">{error}</p>}
        {exito && <p className="formulario-exito">Listo, se guardaron los cambios ✓</p>}

        <label>
          Email
          <input type="email" value={user.email} disabled />
        </label>
        <label>
          Nombre
          <input value={form.nombre} onChange={actualizarCampo('nombre')} required />
        </label>

        <label>
          Teléfono
          <input value={form.telefono} onChange={actualizarCampo('telefono')} />
        </label>
        <label>
          WhatsApp
          <input value={form.whatsapp} onChange={actualizarCampo('whatsapp')} placeholder="Ej: 3865123456" />
        </label>
        <label>
          Zona
          <input value={form.zona} onChange={actualizarCampo('zona')} placeholder="Ej: Centro, Ruta 301" />
        </label>

        <div className="perfil-password">
          <p className="perfil-password-titulo">Cambiar contraseña (opcional)</p>
          <label>
            Contraseña actual
            <input
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <label>
            Contraseña nueva
            <input
              type="password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              minLength={8}
              autoComplete="new-password"
            />
          </label>
        </div>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </section>
  )
}
