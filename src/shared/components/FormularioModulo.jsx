import { useState } from 'react'
import CampoImagen from './CampoImagen.jsx'

function aInputDatetime(iso) {
  const fecha = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(
    fecha.getHours(),
  )}:${pad(fecha.getMinutes())}`
}

function valorInicial(campo, item) {
  const valor = item?.[campo.name]
  if (campo.tipo === 'checkbox') return Boolean(valor)
  if (campo.tipo === 'datetime-local') return valor ? aInputDatetime(valor) : ''
  if (campo.tipo === 'select') return valor ?? campo.opciones?.[0]?.[0] ?? ''
  return valor ?? ''
}

/**
 * Formulario genérico de alta/edición para un módulo. Los campos salen de
 * la config del módulo y el guardado lo resuelve el padre con `onGuardar`,
 * así sirve tanto para el admin como para "Mis publicaciones".
 */
export default function FormularioModulo({ modulo, item, onGuardar, onCancelar }) {
  const [form, setForm] = useState(() =>
    Object.fromEntries(modulo.campos.map((campo) => [campo.name, valorInicial(campo, item)])),
  )
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  function actualizarCampo(campo) {
    return (e) => {
      const valor = campo.tipo === 'checkbox' ? e.target.checked : e.target.value
      setForm((prev) => ({ ...prev, [campo.name]: valor }))
    }
  }

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await onGuardar(form)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo guardar. Revisá los datos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h3>{item ? `Editar ${modulo.label.toLowerCase()}` : `Nueva publicación en ${modulo.label}`}</h3>
      {error && <p className="formulario-error">{error}</p>}

      {modulo.campos.map((campo) => {
        if (campo.tipo === 'imagen') {
          return (
            <CampoImagen
              key={campo.name}
              label={campo.label}
              valor={form[campo.name]}
              onChange={(url) => setForm((prev) => ({ ...prev, [campo.name]: url }))}
            />
          )
        }

        if (campo.tipo === 'checkbox') {
          return (
            <label key={campo.name} className="campo-checkbox">
              <input type="checkbox" checked={form[campo.name]} onChange={actualizarCampo(campo)} />
              {campo.label}
            </label>
          )
        }

        return (
          <label key={campo.name}>
            {campo.label}
            {campo.tipo === 'textarea' ? (
              <textarea
                value={form[campo.name]}
                onChange={actualizarCampo(campo)}
                rows={3}
                required={campo.requerido}
              />
            ) : campo.tipo === 'select' ? (
              <select value={form[campo.name]} onChange={actualizarCampo(campo)}>
                {campo.opciones.map(([valor, texto]) => (
                  <option key={valor} value={valor}>
                    {texto}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={campo.tipo ?? 'text'}
                value={form[campo.name]}
                onChange={actualizarCampo(campo)}
                required={campo.requerido}
              />
            )}
          </label>
        )
      })}

      <div className="acciones-form">
        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar'}
        </button>
        <button type="button" className="btn-secundario" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
