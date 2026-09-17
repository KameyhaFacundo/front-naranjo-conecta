import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SelloCitrico from '../../shared/components/SelloCitrico.jsx'
import { useAuth } from '../../shared/hooks/useAuth.jsx'

const ROLES = [
  ['vecino', 'Vecino'],
  ['prestador', 'Prestador de servicios'],
  ['comerciante', 'Comerciante'],
  ['productor', 'Productor'],
  ['empleador', 'Empleador'],
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'vecino', whatsapp: '' })
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  function actualizarCampo(campo) {
    return (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }))
  }

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo crear la cuenta.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="pagina-auth">
      <form className="formulario" onSubmit={enviar}>
        <div className="auth-encabezado">
          <SelloCitrico size={108} />
          <h1>Crear cuenta</h1>
          <p>Sumate a la comunidad de El Naranjo.</p>
        </div>
        {error && <p className="formulario-error">{error}</p>}

        <label>
          Nombre
          <input value={form.nombre} onChange={actualizarCampo('nombre')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={actualizarCampo('email')} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={form.password} onChange={actualizarCampo('password')} required minLength={8} />
        </label>
        <label>
          ¿Cómo vas a usar la plataforma principalmente?
          <select value={form.rol} onChange={actualizarCampo('rol')}>
            {ROLES.map(([valor, texto]) => (
              <option key={valor} value={valor}>
                {texto}
              </option>
            ))}
          </select>
        </label>
        <label>
          WhatsApp (opcional)
          <input value={form.whatsapp} onChange={actualizarCampo('whatsapp')} />
        </label>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p>
          ¿Ya tenés cuenta? <Link to="/ingresar">Ingresá</Link>
        </p>
      </form>
    </section>
  )
}
