import Icon from '../../shared/components/Icon.jsx'

// Acceso rápido a emergencias: interfaz mínima a propósito (ver doc del
// proyecto, sección Emergencias) para que sea rápido de usar desde el celular.
// El teléfono del centro de salud se carga por .env (VITE_TEL_CENTRO_SALUD);
// si queda vacío, se muestra "a completar".
const CENTRO_SALUD = import.meta.env.VITE_TEL_CENTRO_SALUD ?? ''

const CONTACTOS = [
  { nombre: 'Policía', numero: '911' },
  { nombre: 'Ambulancia / SAME', numero: '107' },
  { nombre: 'Bomberos', numero: '100' },
  { nombre: 'Centro de salud de El Naranjo', numero: CENTRO_SALUD },
]

export default function EmergenciasPage() {
  return (
    <section className="emergencias">
      <h1>
        <Icon name="alerta" size={26} /> Emergencias
      </h1>
      <ul>
        {CONTACTOS.map((contacto) => (
          <li key={contacto.nombre}>
            <span>{contacto.nombre}</span>
            {contacto.numero ? (
              <a href={`tel:${contacto.numero}`}>
                <Icon name="telefono" size={18} /> {contacto.numero}
              </a>
            ) : (
              <span className="pendiente">a completar</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
