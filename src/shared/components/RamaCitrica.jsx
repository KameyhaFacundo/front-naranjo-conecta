export default function RamaCitrica() {
  return (
    <svg viewBox="0 0 320 170" className="rama-citrica" aria-hidden="true" focusable="false">
      <path
        d="M8 140 C 70 155, 120 60, 190 78 S 300 40, 312 18"
        fill="none"
        stroke="var(--tierra-suave)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path d="M96 92c-4-14 4-26 20-30-1 15-8 26-20 30Z" fill="var(--verde-hoja)" />
      <path d="M182 66c-2-15 8-26 24-28-3 15-11 25-24 28Z" fill="var(--verde-hoja)" />
      <path d="M270 34c-3-13 4-23 18-26-2 13-8 22-18 26Z" fill="var(--verde-hoja)" />

      <circle cx="70" cy="128" r="22" fill="var(--naranja)" />
      <circle cx="63" cy="120" r="4.5" fill="#ffffff" fillOpacity="0.25" />

      <circle cx="196" cy="96" r="17" fill="var(--naranja-quemado)" />
      <circle cx="191" cy="90" r="3.5" fill="#ffffff" fillOpacity="0.25" />

      <circle cx="290" cy="52" r="14" fill="var(--naranja)" />
      <circle cx="286" cy="47" r="3" fill="#ffffff" fillOpacity="0.25" />
    </svg>
  )
}
