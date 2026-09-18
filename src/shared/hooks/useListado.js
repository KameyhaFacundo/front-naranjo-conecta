import { useCallback, useEffect, useState } from 'react'

/**
 * Hook genérico para listar un recurso de la API.
 *
 * `cargarFn` es una función (params) => Promise. Si la respuesta viene
 * paginada (Laravel: `{ data, meta }`), expone `hayMas` y `cargarMas`
 * para traer la página siguiente y acumular los resultados.
 *
 * `habilitado` (default true): en false no pide nada — para listados que
 * solo debe ver cierto rol, así no viaja de más ni un instante antes de
 * saber si el usuario puede verlo.
 */
export function useListado(cargarFn, params = {}, habilitado = true) {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState(null)
  const [cargando, setCargando] = useState(habilitado)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState(null)

  const paramsKey = JSON.stringify(params)

  const cargar = useCallback(
    (page, reemplazar) => {
      if (reemplazar) {
        setCargando(true)
      } else {
        setCargandoMas(true)
      }
      setError(null)

      return cargarFn({ ...JSON.parse(paramsKey), page })
        .then((respuesta) => {
          const nuevos = respuesta.data ?? respuesta
          setMeta(respuesta.meta ?? null)
          setItems((prev) => (reemplazar ? nuevos : [...prev, ...nuevos]))
        })
        .catch((err) => setError(err))
        .finally(() => {
          setCargando(false)
          setCargandoMas(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cargarFn, paramsKey],
  )

  const recargar = useCallback(() => cargar(1, true), [cargar])

  const cargarMas = useCallback(() => {
    if (!meta || meta.current_page >= meta.last_page) return
    cargar(meta.current_page + 1, false)
  }, [cargar, meta])

  useEffect(() => {
    if (habilitado) {
      recargar()
    } else {
      setItems([])
      setCargando(false)
    }
  }, [recargar, habilitado])

  const hayMas = Boolean(meta && meta.current_page < meta.last_page)

  return { items, cargando, cargandoMas, error, recargar, cargarMas, hayMas }
}
