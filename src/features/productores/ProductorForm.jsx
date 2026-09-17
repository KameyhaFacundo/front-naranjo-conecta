import { useState } from 'react'
import SelectorUbicacion from '../../shared/components/SelectorUbicacion.jsx'
import { crearProductor } from './api.js'

const vacio = {
  nombre: '',
  que_produce: '',
  que_vende: '',
  disponibilidad: '',
  zona: '',
  whatsapp: '',
  lat: null,
  lng: null,
}

export default function ProductorForm({ onCreado }) {
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
      const { data } = await crearProductor(form)
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
      <h3>Publicar como productor</h3>
      {error && <p className="formulario-error">{error}</p>}

      <label>
        Nombre
        <input value={form.nombre} onChange={actualizarCampo('nombre')} required />
      </label>
      <label>
        ¿Qué producís?
        <textarea value={form.que_produce} onChange={actualizarCampo('que_produce')} rows={2} />
      </label>
      <label>
        ¿Qué vendés?
        <textarea value={form.que_vende} onChange={actualizarCampo('que_vende')} rows={2} />
      </label>
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
      <SelectorUbicacion
        lat={form.lat}
        lng={form.lng}
        onChange={(lat, lng) => setForm((prev) => ({ ...prev, lat, lng }))}
      />

      <button type="submit" disabled={enviando}>
        {enviando ? 'Publicando…' : 'Publicar'}
      </button>
    </form>
  )
}
