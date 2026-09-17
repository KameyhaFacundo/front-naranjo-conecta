import { useState } from 'react'
import CampoImagen from '../../shared/components/CampoImagen.jsx'
import { crearReclamo } from './api.js'

const CATEGORIAS = [
  ['alumbrado', 'Alumbrado público'],
  ['calles', 'Calles en mal estado'],
  ['agua', 'Agua'],
  ['basura', 'Basura'],
  ['electrico', 'Problema eléctrico'],
  ['caminos', 'Caminos'],
  ['espacios_publicos', 'Espacios públicos'],
  ['otro', 'Otro'],
]

const vacio = { categoria: 'alumbrado', descripcion: '', zona: '', foto_url: '' }

export default function ReclamoForm({ onCreado }) {
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
      const { data } = await crearReclamo(form)
      setForm(vacio)
      onCreado?.(data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo enviar el reclamo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h3>Hacer un reclamo</h3>
      {error && <p className="formulario-error">{error}</p>}

      <label>
        Categoría
        <select value={form.categoria} onChange={actualizarCampo('categoria')}>
          {CATEGORIAS.map(([valor, texto]) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
      </label>
      <label>
        Descripción
        <textarea value={form.descripcion} onChange={actualizarCampo('descripcion')} rows={3} required />
      </label>
      <label>
        Zona
        <input value={form.zona} onChange={actualizarCampo('zona')} />
      </label>
      <CampoImagen
        label="Foto del problema (opcional)"
        valor={form.foto_url}
        onChange={(url) => setForm((prev) => ({ ...prev, foto_url: url }))}
      />

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar reclamo'}
      </button>
    </form>
  )
}
