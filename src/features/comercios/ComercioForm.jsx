import { useState } from 'react'
import CampoImagen from '../../shared/components/CampoImagen.jsx'
import SelectorUbicacion from '../../shared/components/SelectorUbicacion.jsx'
import { crearComercio } from './api.js'

const vacio = {
  nombre: '',
  descripcion: '',
  direccion: '',
  horarios: '',
  whatsapp: '',
  telefono: '',
  logo_url: '',
  lat: null,
  lng: null,
}

export default function ComercioForm({ onCreado }) {
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
      const { data } = await crearComercio(form)
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
      <h3>Publicar un comercio</h3>
      {error && <p className="formulario-error">{error}</p>}

      <label>
        Nombre del comercio
        <input value={form.nombre} onChange={actualizarCampo('nombre')} required />
      </label>
      <label>
        Descripción / productos
        <textarea value={form.descripcion} onChange={actualizarCampo('descripcion')} rows={3} />
      </label>
      <label>
        Dirección
        <input value={form.direccion} onChange={actualizarCampo('direccion')} />
      </label>
      <label>
        Horarios
        <input value={form.horarios} onChange={actualizarCampo('horarios')} />
      </label>
      <label>
        WhatsApp
        <input value={form.whatsapp} onChange={actualizarCampo('whatsapp')} />
      </label>
      <label>
        Teléfono
        <input value={form.telefono} onChange={actualizarCampo('telefono')} />
      </label>
      <CampoImagen
        label="Logo (opcional)"
        valor={form.logo_url}
        onChange={(url) => setForm((prev) => ({ ...prev, logo_url: url }))}
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
