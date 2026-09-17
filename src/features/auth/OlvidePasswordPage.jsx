import { useState } from 'react'
import { Link } from 'react-router-dom'
import SelloCitrico from '../../shared/components/SelloCitrico.jsx'
import { olvidePassword } from './api.js'

export default function OlvidePasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await olvidePassword(email)
      setEnviado(true)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo enviar el link. Probá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="pagina-auth">
      <form className="formulario" onSubmit={enviar}>
        <div className="auth-encabezado">
          <SelloCitrico size={108} />
          <h1>¿Olvidaste tu contraseña?</h1>
          <p>Escribí tu email y te mandamos un link para elegir una nueva.</p>
        </div>

        {enviado ? (
          <p className="formulario-exito">
            Listo, si ese email está registrado te va a llegar un link para restablecer la contraseña.
          </p>
        ) : (
          <>
            {error && <p className="formulario-error">{error}</p>}

            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>

            <button type="submit" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar link'}
            </button>
          </>
        )}

        <p>
          <Link to="/ingresar">Volver a ingresar</Link>
        </p>
      </form>
    </section>
  )
}
