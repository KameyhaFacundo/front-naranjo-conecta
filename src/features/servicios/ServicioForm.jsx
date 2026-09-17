import { useState } from 'react'
import CampoImagen from '../../shared/components/CampoImagen.jsx'
import SelectorUbicacion from '../../shared/components/SelectorUbicacion.jsx'
import { crearServicio } from './api.js'

const vacio = {
  titulo: '',
  descripcion: '',
  experiencia: '',
  whatsapp: '',
  telefono: '',
  horarios: '',
  zona: '',
  foto_url: '',
  lat: null,
  lng: null,
}

export default function ServicioForm({ onCreado }) {
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
      const { data } = await crearServicio(form)
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
      <h3>Publicar un servicio</h3>
      {error && <p className="formulario-error">{error}</p>}

      <label>
        ¿Qué oficio ofrecés?
        <input value={form.titulo} onChange={actualizarCampo('titulo')} required placeholder="Ej: Electricista" />
      </label>
      <label>
        Descripción
        <textarea value={form.descripcion} onChange={actualizarCampo('descripcion')} rows={3} />
      </label>
      <label>
        Experiencia
        <input value={form.experiencia} onChange={actualizarCampo('experiencia')} placeholder="Ej: 5 años" />
      </label>
      <label>
        WhatsApp
        <input value={form.whatsapp} onChange={actualizarCampo('whatsapp')} placeholder="Ej: 3865123456" />
      </label>
      <label>
        Teléfono
        <input value={form.telefono} onChange={actualizarCampo('telefono')} />
      </label>
      <label>
        Horarios
        <input value={form.horarios} onChange={actualizarCampo('horarios')} />
      </label>
      <label>
        Zona (no tu domicilio exacto)
        <input value={form.zona} onChange={actualizarCampo('zona')} placeholder="Ej: Centro, Ruta 301" />
      </label>
      <CampoImagen
        label="Foto (opcional)"
        valor={form.foto_url}
        onChange={(url) => setForm((prev) => ({ ...prev, foto_url: url }))}
      />
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
