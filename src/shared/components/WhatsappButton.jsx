import Icon from './Icon.jsx'

// La plataforma no tiene mensajería propia: es un intermediario hacia
// WhatsApp (Buscar → Encontrar → Ver información → WhatsApp).
export default function WhatsappButton({ numero, mensaje = 'Hola, te encontré en El Naranjo Conecta' }) {
  if (!numero) return null

  const limpio = numero.replace(/[^\d]/g, '')
  const url = `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`

  return (
    <a className="btn btn-whatsapp" href={url} target="_blank" rel="noopener noreferrer">
      <Icon name="chat" size={16} /> Contactar por WhatsApp
    </a>
  )
}
