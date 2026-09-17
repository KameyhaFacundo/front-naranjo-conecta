import Icon from './Icon.jsx'

const NUMERO = import.meta.env.VITE_WHATSAPP_CHATBOT

// Botón flotante al chatbot de WhatsApp. Si no hay número configurado
// (VITE_WHATSAPP_CHATBOT) no se muestra, en vez de llevar a un chat roto.
export default function WhatsappFlotante() {
  if (!NUMERO) return null

  const limpio = NUMERO.replace(/[^\d]/g, '')
  const url = `https://wa.me/${limpio}?text=${encodeURIComponent('Hola, quiero hacer una consulta')}`

  return (
    <a
      className="whatsapp-flotante"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      title="Escribinos por WhatsApp"
    >
      <Icon name="chat" size={26} />
    </a>
  )
}
