import Icon from './Icon.jsx'

/**
 * Comparte una publicación: usa la Web Share API del celular cuando está
 * disponible y, si no, cae a WhatsApp Web con el texto y el link.
 */
export default function CompartirButton({ titulo, texto, ruta, className = '' }) {
  const url = `${window.location.origin}${ruta ?? window.location.pathname}`
  const resumen = [titulo, texto].filter(Boolean).join(' — ')

  async function compartir() {
    const data = { title: titulo || 'El Naranjo Conecta', text: resumen, url }

    if (navigator.share) {
      try {
        await navigator.share(data)
        return
      } catch {
        // El usuario canceló o el navegador no pudo: probamos por WhatsApp.
      }
    }

    const mensaje = `${resumen}\n${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener')
  }

  return (
    <button type="button" className={`btn-compartir ${className}`} onClick={compartir} aria-label="Compartir">
      <Icon name="compartir" size={16} />
    </button>
  )
}
