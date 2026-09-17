export default function CargarMas({ hayMas, cargando, onClick }) {
  if (!hayMas) return null

  return (
    <div className="cargar-mas">
      <button type="button" className="btn-secundario" onClick={onClick} disabled={cargando}>
        {cargando ? 'Cargando…' : 'Cargar más'}
      </button>
    </div>
  )
}
