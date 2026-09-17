const TRAZOS = {
  pin: (
    <>
      <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </>
  ),
  telefono: <path d="M8 3h2l1.5 4-2 1.6a12.5 12.5 0 0 0 6 6l1.6-2 4 1.5v2c0 1.1-1 2-2.1 1.9C12.4 17.4 6.6 11.6 6.1 5.1 6 4 7 3 8 3Z" />,
  tienda: (
    <>
      <path d="M4.5 9 5.7 4h12.6l1.2 5" />
      <path d="M4.5 9v1.5a2 2 0 0 0 3.8 1 2 2 0 0 0 3.7 0 2 2 0 0 0 3.7 0 2 2 0 0 0 3.8-1V9" />
      <path d="M5.5 12v8h13v-8" />
      <path d="M10 20v-4.5h4V20" />
    </>
  ),
  hoja: (
    <>
      <path d="M19.5 4.8S9.6 3.6 6.8 10.2c-2.3 5.4 1.8 9.8 7.4 7.5 5.6-2.3 5.6-10.2 5.3-12.9Z" />
      <path d="M8.2 15.6 17 6.8" />
    </>
  ),
  maletin: (
    <>
      <rect x="3.2" y="8" width="17.6" height="11" rx="2" />
      <path d="M9 8V6.3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V8" />
      <path d="M3.2 13.2h17.6" />
    </>
  ),
  herramienta: (
    <path d="M14.6 6.4a4 4 0 0 0-5.2 5.3L3.5 17.6l2.9 2.9 5.9-5.9a4 4 0 0 0 5.3-5.2l-2.6 2.6-2-2Z" />
  ),
  megafono: (
    <>
      <path d="M3.5 9.3v5.4h2.7l6.3 3.6V5.7l-6.3 3.6Z" />
      <path d="M15.6 7.6a4.6 4.6 0 0 1 0 8.8" />
      <path d="M18.3 5a8.2 8.2 0 0 1 0 14" />
    </>
  ),
  edificio: (
    <>
      <path d="M4 21h16" />
      <path d="M6.2 21V10.2l5.8-4.7 5.8 4.7V21" />
      <path d="M9.8 21v-5.2h4.4V21" />
      <path d="M9.8 13h.01M14.2 13h.01M9.8 9.6h.01M14.2 9.6h.01" />
    </>
  ),
  alerta: (
    <>
      <path d="M12 3.2 2.2 20.5h19.6L12 3.2Z" />
      <path d="M12 10.2v3.8" />
      <path d="M12 17h.01" />
    </>
  ),
  chat: (
    <>
      <path d="M12 3.5a8.2 8.2 0 0 0-7.1 12.3L4 20.5l4.9-1A8.2 8.2 0 1 0 12 3.5Z" />
      <circle cx="9" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  buscar: (
    <>
      <circle cx="11" cy="11" r="6.8" />
      <path d="m20.5 20.5-4.2-4.2" />
    </>
  ),
  mapa: (
    <>
      <path d="M9 4.6 4 6.6v13l5-2 6 2 5-2v-13l-5 2-6-2Z" />
      <path d="M9 4.6v13" />
      <path d="M15 6.6v13" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3.2 5 6v5.5c0 4.3 3 7.4 7 9.3 4-1.9 7-5 7-9.3V6l-7-2.8Z" />
      <path d="m9.3 12.2 1.9 1.9 3.6-3.9" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8.3" r="3.3" />
      <path d="M5 19.5c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6.5h16" />
      <path d="M4 12h16" />
      <path d="M4 17.5h16" />
    </>
  ),
  cerrar: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  lista: (
    <>
      <path d="M8 6h12" />
      <path d="M8 12h12" />
      <path d="M8 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </>
  ),
  objetivo: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v3.6M12 17.4V21M3 12h3.6M17.4 12H21" />
    </>
  ),
  compartir: (
    <>
      <circle cx="18" cy="5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="19" r="2.6" />
      <path d="m8.4 10.7 7.2-4.2" />
      <path d="m8.4 13.3 7.2 4.2" />
    </>
  ),
}

export default function Icon({ name, size = 20, className = '', ...props }) {
  const trazo = TRAZOS[name]
  if (!trazo) return null

  return (
    <svg
      className={`icono ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {trazo}
    </svg>
  )
}
