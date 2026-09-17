import { useState } from 'react'
import CampoImagen from '../../shared/components/CampoImagen.jsx'
import Icon from '../../shared/components/Icon.jsx'
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

// Redondeado a ~3 decimales (unos 100m) para que quede una ubicación
// aproximada, nunca el domicilio exacto (ver notas de privacidad del README).
function aproximar(valor) {
  return Math.round(valor * 1000) / 1000
}

export default function ServicioForm({ onCreado }) {
  const [form, setForm] = useState(vacio)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [ubicando, setUbicando] = useState(false)

  function actualizarCampo(campo) {
    return (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }))
  }

  function usarUbicacionAproximada() {
    if (!navigator.geolocation) return
    setUbicando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          lat: aproximar(pos.coords.latitude),
          lng: aproximar(pos.coords.longitude),
        }))
        setUbicando(false)
      },
      () => setUbicando(false),
    )
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
      <label>
        Ubicación aproximada (para que te encuentren "cerca de mí")
        <button type="button" onClick={usarUbicacionAproximada} disabled={ubicando}>
          <Icon name="pin" size={16} />{' '}
          {ubicando ? 'Obteniendo ubicación…' : form.lat ? 'Ubicación guardada ✓' : 'Usar mi ubicación aproximada'}
        </button>
      </label>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Publicando…' : 'Publicar'}
      </button>
    </form>
  )
}
