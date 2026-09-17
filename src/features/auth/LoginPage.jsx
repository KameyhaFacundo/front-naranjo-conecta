import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NaranjaMark from '../../shared/components/NaranjaMark.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await login(form)
      navigate(location.state?.from?.pathname ?? '/', { replace: true })
    } catch {
      setError('Email o contraseña incorrectos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="pagina-auth">
      <form className="formulario" onSubmit={enviar}>
        <div className="auth-encabezado">
          <NaranjaMark size={36} />
          <h1>Ingresar</h1>
          <p>Entrá para publicar y gestionar tus avisos.</p>
        </div>
        {error && <p className="formulario-error">{error}</p>}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
        </label>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p>
          ¿No tenés cuenta? <Link to="/registrarme">Registrate</Link>
        </p>
      </form>
    </section>
  )
}
