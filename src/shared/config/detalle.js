/**
 * Qué mostrar en la ficha de detalle de cada módulo.
 * `tituloKey` indica de qué campo sale el título y `campos` la lista
 * [campo, etiqueta] que se muestra (los vacíos se omiten).
 */
export const DETALLE = {
  servicios: {
    imagen: 'foto_url',
    tituloKey: 'titulo',
    campos: [
      ['descripcion', 'Descripción'],
      ['experiencia', 'Experiencia'],
      ['zona', 'Zona'],
      ['horarios', 'Horarios'],
      ['telefono', 'Teléfono'],
    ],
  },
  comercios: {
    imagen: 'logo_url',
    tituloKey: 'nombre',
    campos: [
      ['descripcion', 'Descripción'],
      ['direccion', 'Dirección'],
      ['horarios', 'Horarios'],
      ['zona', 'Zona'],
      ['telefono', 'Teléfono'],
    ],
  },
  productores: {
    tituloKey: 'nombre',
    campos: [
      ['que_produce', 'Qué produce'],
      ['que_vende', 'Qué vende'],
      ['disponibilidad', 'Disponibilidad'],
      ['zona', 'Zona'],
      ['telefono', 'Teléfono'],
    ],
  },
  empleos: {
    tituloKey: 'titulo',
    campos: [
      ['descripcion', 'Descripción'],
      ['experiencia', 'Experiencia'],
      ['habilidades', 'Habilidades'],
      ['requisitos', 'Requisitos'],
      ['disponibilidad', 'Disponibilidad'],
      ['horario', 'Horario'],
      ['zona', 'Zona'],
      ['telefono', 'Teléfono'],
    ],
  },
  instituciones: {
    tituloKey: 'nombre',
    campos: [
      ['tipo', 'Tipo'],
      ['descripcion', 'Descripción'],
      ['direccion', 'Dirección'],
      ['telefono', 'Teléfono'],
      ['horarios', 'Horarios'],
    ],
  },
  reclamos: {
    imagen: 'foto_url',
    tituloKey: 'categoria',
    estado: true,
    campos: [
      ['descripcion', 'Descripción'],
      ['zona', 'Zona'],
    ],
  },
}
