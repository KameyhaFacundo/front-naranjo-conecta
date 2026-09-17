import { apiClient } from './client.js'

/** Sube una imagen y devuelve su URL pública. */
export function subirImagen(archivo) {
  const formData = new FormData()
  formData.append('imagen', archivo)
  return apiClient.post('/uploads', formData).then((res) => res.data)
}
