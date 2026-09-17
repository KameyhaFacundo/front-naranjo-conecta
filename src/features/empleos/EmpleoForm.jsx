import { useState } from 'react'
import { crearEmpleo } from './api.js'

const vacio = {
  tipo: 'busco_trabajo',
  titulo: '',
  descripcion: '',
  experiencia: '',
  habilidades: '',
  requisitos: '',
  disponibilidad: '',
  zona: '',
  whatsapp: '',
}

export default function EmpleoForm({ onCreado }) {
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
      const { data } = await crearEmpleo(form)
      setForm(vacio)
      onCreado?.(data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo publicar. Revisá los datos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h3>Publicar en Empleo</h3>
      {error && <p className="formulario-error">{error}</p>}

      <label>
        Tipo de publicación
        <select value={form.tipo} onChange={actualizarCampo('tipo')}>
          <option value="busco_trabajo">Busco trabajo</option>
          <option value="busco_trabajador">Busco trabajador</option>
        </select>
      </label>
      <label>
        Título
        <input
          value={form.titulo}
          onChange={actualizarCampo('titulo')}
          required
          placeholder="Ej: Busco trabajo como albañil"
        />
      </label>
      <label>
        Descripción
        <textarea value={form.descripcion} onChange={actualizarCampo('descripcion')} rows={3} />
      </label>
      {form.tipo === 'busco_trabajo' ? (
        <>
          <label>
            Experiencia
            <input value={form.experiencia} onChange={actualizarCampo('experiencia')} />
          </label>
          <label>
            Habilidades
            <input value={form.habilidades} onChange={actualizarCampo('habilidades')} />
          </label>
        </>
      ) : (
        <label>
          Requisitos
          <input value={form.requisitos} onChange={actualizarCampo('requisitos')} />
        </label>
      )}
      <label>
        Disponibilidad
        <input value={form.disponibilidad} onChange={actualizarCampo('disponibilidad')} />
      </label>
      <label>
        Zona
        <input value={form.zona} onChange={actualizarCampo('zona')} />
      </label>
      <label>
        WhatsApp
        <input value={form.whatsapp} onChange={actualizarCampo('whatsapp')} />
      </label>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Publicando…' : 'Publicar'}
      </button>
    </form>
  )
}
