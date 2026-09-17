import { useState } from 'react'
import { crearAviso } from './api.js'

const TIPOS = ['comunicado', 'reunion', 'evento', 'obra', 'corte_servicio', 'actividad', 'otro']
const vacio = { tipo: 'comunicado', titulo: '', cuerpo: '', fecha_evento: '' }

export default function AvisoForm({ onCreado }) {
  const [form, setForm] = useState(vacio)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  function actualizarCampo(campo) {
    return (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }))
  }

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const { data } = await crearAviso(form)
      setForm(vacio)
      onCreado?.(data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo publicar el aviso.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h3>Publicar un aviso</h3>
      {error && <p className="formulario-error">{error}</p>}

      <label>
        Tipo
        <select value={form.tipo} onChange={actualizarCampo('tipo')}>
          {TIPOS.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </label>
      <label>
        Título
        <input value={form.titulo} onChange={actualizarCampo('titulo')} required />
      </label>
      <label>
        Texto
        <textarea value={form.cuerpo} onChange={actualizarCampo('cuerpo')} rows={4} required />
      </label>
      <label>
        Fecha del evento (opcional)
        <input type="datetime-local" value={form.fecha_evento} onChange={actualizarCampo('fecha_evento')} />
      </label>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Publicando…' : 'Publicar'}
      </button>
    </form>
  )
}
