import { useId } from 'react'

const RAYOS = Array.from({ length: 14 }, (_, i) => i)

/**
 * Medallón inspirado en las etiquetas pintadas de los cajones de naranja
 * (packing houses de Tucumán): sello circular con el nombre del pueblo
 * arqueado arriba y abajo, como marca gráfica propia de la app.
 */
export default function SelloCitrico({ size = 220 }) {
  const idArriba = useId()
  const idAbajo = useId()

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="sello-citrico" aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="96" fill="none" stroke="var(--naranja-quemado)" strokeWidth="2" />
      <circle cx="100" cy="100" r="87" fill="none" stroke="var(--borde)" strokeWidth="1.5" strokeDasharray="1.5 5" />

      <path id={idArriba} d="M 32,100 A 68,68 0 0 1 168,100" fill="none" />
      <path id={idAbajo} d="M 32,100 A 68,68 0 0 0 168,100" fill="none" />
      <text className="sello-citrico-texto">
        <textPath href={`#${idArriba}`} startOffset="50%" textAnchor="middle">
          EL NARANJO
        </textPath>
      </text>
      <text className="sello-citrico-texto">
        <textPath href={`#${idAbajo}`} startOffset="50%" textAnchor="middle">
          BURRUYACÚ · TUCUMÁN
        </textPath>
      </text>
      <circle cx="32" cy="100" r="2" fill="var(--naranja-quemado)" />
      <circle cx="168" cy="100" r="2" fill="var(--naranja-quemado)" />

      {RAYOS.map((i) => {
        const angulo = (360 / RAYOS.length) * i
        const largo = i % 2 === 0 ? 66 : 60
        return (
          <line
            key={i}
            x1="100"
            y1="50"
            x2="100"
            y2={100 - largo}
            stroke="var(--amarillo-sol)"
            strokeWidth="3.4"
            strokeLinecap="round"
            transform={`rotate(${angulo} 100 100)`}
          />
        )
      })}

      <circle cx="100" cy="108" r="46" fill="var(--naranja)" />
      <circle cx="86" cy="94" r="8" fill="#ffffff" fillOpacity="0.25" />

      <path d="M85 68c-3-12 4-21 17-24-2 12-8 20-17 24Z" fill="var(--verde-hoja-oscuro)" />
      <path d="M115 68c3-12-4-21-17-24 2 12 8 20 17 24Z" fill="var(--verde-hoja)" />
    </svg>
  )
}
