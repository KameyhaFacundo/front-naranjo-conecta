import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SelloCitrico from '../../shared/components/SelloCitrico.jsx'
import { resetearPassword } from './api.js'

export default function RestablecerPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') ?? ''
  const email = params.get('email') ?? ''
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await resetearPassword({ token, email, password })
      navigate('/ingresar', { replace: true, state: { recienRestablecida: true } })
    } catch (err) {
      setError(err.response?.data?.errors?.email?.[0] ?? err.response?.data?.message ?? 'No se pudo cambiar la contraseña.')
    } finally {
      setEnviando(false)
    }
  }

  if (!token || !email) {
    return (
      <section className="pagina-auth">
        <div className="formulario">
          <div className="auth-encabezado">
            <SelloCitrico size={108} />
            <h1>Link inválido</h1>
            <p>Este link no es válido. Pedí uno nuevo para restablecer tu contraseña.</p>
          </div>
          <p>
            <Link to="/olvide-password">Pedir un link nuevo</Link>
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="pagina-auth">
      <form className="formulario" onSubmit={enviar}>
        <div className="auth-encabezado">
          <SelloCitrico size={108} />
          <h1>Elegí una nueva contraseña</h1>
          <p>{email}</p>
        </div>
        {error && <p className="formulario-error">{error}</p>}

        <label>
          Contraseña nueva
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      </form>
    </section>
  )
}
