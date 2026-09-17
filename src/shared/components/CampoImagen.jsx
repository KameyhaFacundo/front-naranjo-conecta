import { useRef, useState } from 'react'
import { subirImagen } from '../api/uploads.js'

/**
 * Campo de imagen reutilizable: sube el archivo a la API y entrega la URL
 * pública resultante (se guarda en `foto_url` / `logo_url`).
 */
export default function CampoImagen({ label = 'Foto', valor, onChange }) {
  const inputRef = useRef(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)

  async function elegir(e) {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    setSubiendo(true)
    setError(null)
    try {
      const { url } = await subirImagen(archivo)
      onChange(url)
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo subir la imagen.')
    } finally {
      setSubiendo(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="campo-imagen">
      <span className="campo-imagen-label">{label}</span>

      {valor && (
        <div className="campo-imagen-preview">
          <img src={valor} alt="Vista previa" />
          <button type="button" className="btn-secundario" onClick={() => onChange('')}>
            Quitar
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={elegir}
        disabled={subiendo}
      />
      {subiendo && <span className="estado-carga">Subiendo…</span>}
      {error && <span className="formulario-error">{error}</span>}
    </div>
  )
}
