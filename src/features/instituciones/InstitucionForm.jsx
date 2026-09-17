import { useState } from 'react'
import { crearInstitucion } from './api.js'

const TIPOS = ['escuela', 'salud', 'comuna', 'organizacion', 'club', 'iglesia', 'otro']
const vacio = { tipo: 'escuela', nombre: '', descripcion: '', direccion: '', telefono: '', horarios: '' }

export default function InstitucionForm({ onCreado }) {
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
      const { data } = await crearInstitucion(form)
      setForm(vacio)
      onCreado?.(data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo publicar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h3>Agregar institución</h3>
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
        Nombre
        <input value={form.nombre} onChange={actualizarCampo('nombre')} required />
      </label>
      <label>
        Descripción
        <textarea value={form.descripcion} onChange={actualizarCampo('descripcion')} rows={2} />
      </label>
      <label>
        Dirección
        <input value={form.direccion} onChange={actualizarCampo('direccion')} />
      </label>
      <label>
        Teléfono
        <input value={form.telefono} onChange={actualizarCampo('telefono')} />
      </label>
      <label>
        Horarios
        <input value={form.horarios} onChange={actualizarCampo('horarios')} />
      </label>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Guardando…' : 'Guardar'}
      </button>
    </form>
  )
}
