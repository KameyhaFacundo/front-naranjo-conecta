/**
 * Datos de muestra para trabajar el frontend sin depender del backend.
 *
 * Cómo conectar el backend real cuando esté listo:
 *   1. Poné VITE_USE_MOCKS=false en el .env (local y en Vercel) y redeployá.
 *   2. Listo — no hace falta tocar ningún componente. Cada función
 *      listarX()/obtenerPublicacion()/etc. en features/*\/api.js ya sabe
 *      volver a pedirle los datos a la API real apenas la bandera es false.
 *   3. Este archivo puede borrarse en cualquier momento junto con las
 *      ramas "if (USE_MOCKS)" de esos api.js (son fáciles de encontrar
 *      buscando "USE_MOCKS" en el proyecto).
 *
 * Sin la variable definida, USE_MOCKS queda en true por defecto: así el
 * sitio muestra contenido de entrada aunque todavía no haya backend real
 * atrás.
 */
const flag = import.meta.env.VITE_USE_MOCKS
export const USE_MOCKS = flag === undefined ? true : flag !== 'false'

function foto(seed, w = 640, h = 420) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

// Centro de El Naranjo, con un pequeño offset determinístico por item para
// que no queden todos los pines apilados en el mismo punto del mapa.
const CENTRO = [-26.676389, -65.051111]
function ubicacion(i) {
  const anillo = (i % 6) - 2.5
  return {
    lat: Number((CENTRO[0] + anillo * 0.0035 - i * 0.0006).toFixed(6)),
    lng: Number((CENTRO[1] + anillo * 0.0045 + i * 0.0008).toFixed(6)),
  }
}

function calificacionDe(resenas) {
  if (!resenas || resenas.length === 0) return { promedio: 0, total: 0 }
  const total = resenas.length
  const suma = resenas.reduce((acc, r) => acc + r.puntuacion, 0)
  return { promedio: Math.round((suma / total) * 10) / 10, total }
}

function resena(id, nombre, puntuacion, comentario, diasAtras) {
  const fecha = new Date(Date.now() - diasAtras * 86400000)
  return {
    id,
    puntuacion,
    comentario,
    created_at: fecha.toISOString(),
    es_mia: false,
    autor: { nombre },
  }
}

// ---------------------------------------------------------------------
// Servicios
// ---------------------------------------------------------------------

const resenasServicios = {
  1: [
    resena(101, 'Marta Ibáñez', 5, 'Vino rápido y dejó todo funcionando. Muy prolijo.', 6),
    resena(102, 'Hugo Paz', 4, 'Buen trabajo, un poco caro pero cumplió.', 20),
  ],
  2: [resena(103, 'Silvia Toledo', 5, 'Excelente, arregló la pérdida en menos de una hora.', 3)],
  4: [
    resena(104, 'Ramón Acosta', 5, 'Mi hija mejoró un montón en matemática.', 10),
    resena(105, 'Clara Núñez', 5, 'Muy paciente y explica bien.', 25),
    resena(106, 'Beto Farías', 4, 'Buena profe, a veces cuesta coordinar horario.', 40),
  ],
}

export const mockServicios = [
  {
    id: 1,
    titulo: 'Electricista',
    subcategoria: 'Instalaciones y arreglos eléctricos',
    descripcion:
      'Instalaciones nuevas, arreglo de tableros, cortocircuitos y colocación de artefactos. Atiendo en el día para urgencias.',
    experiencia: '8 años',
    whatsapp: '3865123001',
    telefono: '3865123001',
    horarios: 'Lunes a sábado, 8 a 19 hs',
    zona: 'Centro',
    foto_url: foto('naranjo-electricista', 640, 420),
    ...ubicacion(1),
    activo: true,
    calificacion: calificacionDe(resenasServicios[1]),
  },
  {
    id: 2,
    titulo: 'Plomero',
    subcategoria: 'Gasista y plomería',
    descripcion: 'Destapaciones, pérdidas de agua, instalación de termotanques y matriculado para gas.',
    experiencia: '12 años',
    whatsapp: '3865123002',
    telefono: '',
    horarios: 'Todos los días, urgencias 24 hs',
    zona: 'Ruta 301',
    foto_url: foto('naranjo-plomero', 640, 420),
    ...ubicacion(2),
    activo: true,
    calificacion: calificacionDe(resenasServicios[2]),
  },
  {
    id: 3,
    titulo: 'Albañil',
    subcategoria: 'Construcción y refacciones',
    descripcion: 'Levanto paredes, reviste, coloco cerámicos y hago arreglos generales de albañilería.',
    experiencia: '15 años',
    whatsapp: '3865123003',
    telefono: '3865123003',
    horarios: 'Lunes a viernes, 7 a 17 hs',
    zona: 'Barrio Norte',
    foto_url: foto('naranjo-albanil', 640, 420),
    ...ubicacion(3),
    activo: true,
    calificacion: calificacionDe(resenasServicios[3]),
  },
  {
    id: 4,
    titulo: 'Profesora particular',
    subcategoria: 'Apoyo escolar primario y secundario',
    descripcion: 'Clases de apoyo en matemática, lengua y ciencias. A domicilio o en mi casa.',
    experiencia: '6 años',
    whatsapp: '3865123004',
    telefono: '',
    horarios: 'Tarde, a coordinar',
    zona: 'Centro',
    foto_url: foto('naranjo-profesora', 640, 420),
    ...ubicacion(4),
    activo: true,
    calificacion: calificacionDe(resenasServicios[4]),
  },
  {
    id: 5,
    titulo: 'Mecánico',
    subcategoria: 'Motos y autos',
    descripcion: 'Service, frenos, cambio de aceite y diagnóstico. Trabajo en mi taller o voy a domicilio.',
    experiencia: '10 años',
    whatsapp: '3865123005',
    telefono: '3865123005',
    horarios: 'Lunes a sábado, 9 a 18 hs',
    zona: 'El Sunchal',
    foto_url: foto('naranjo-mecanico', 640, 420),
    ...ubicacion(5),
    activo: true,
    calificacion: calificacionDe(resenasServicios[5]),
  },
  {
    id: 6,
    titulo: 'Peluquera a domicilio',
    subcategoria: 'Peluquería y estética',
    descripcion: 'Corte, color, peinados para eventos. Voy a tu casa con todos los materiales.',
    experiencia: '5 años',
    whatsapp: '3865123006',
    telefono: '',
    horarios: 'Martes a domingo',
    zona: 'Centro',
    foto_url: foto('naranjo-peluqueria', 640, 420),
    ...ubicacion(6),
    activo: true,
    calificacion: calificacionDe(resenasServicios[6]),
  },
  // Servicios reales, vistos en el mapa — sin foto propia por ahora.
  {
    id: 7,
    titulo: 'Sublimación / Impresiones WALO',
    subcategoria: 'Diseño e impresión',
    descripcion: '',
    experiencia: '',
    whatsapp: '',
    telefono: '',
    horarios: '',
    zona: 'El Naranjo',
    foto_url: '',
    ...ubicacion(22),
    activo: true,
    calificacion: calificacionDe([]),
  },
  {
    id: 8,
    titulo: 'Impulsa Motor',
    subcategoria: 'Taller mecánico',
    descripcion: '',
    experiencia: '',
    whatsapp: '',
    telefono: '',
    horarios: '',
    zona: 'El Naranjo',
    foto_url: '',
    lat: -26.677325,
    lng: -65.0447718,
    activo: true,
    calificacion: calificacionDe([]),
  },
]

// ---------------------------------------------------------------------
// Comercios
// ---------------------------------------------------------------------

const resenasComercios = {
  1: [
    resena(201, 'Ana Reales', 5, 'Siempre tiene de todo y atiende rebien.', 2),
    resena(202, 'Jorge Luna', 5, 'El almacén de toda la vida.', 15),
  ],
  2: [resena(203, 'Patricia Gómez', 5, 'El pan casero es una masa, recomendado.', 5)],
}

export const mockComercios = [
  {
    id: 1,
    nombre: 'Almacén Doña Rosa',
    descripcion: 'Almacén de ramos generales: fiambres, lácteos, artículos de limpieza y algo más.',
    direccion: 'Calle Principal 145',
    horarios: 'Lunes a sábado, 8 a 21 hs',
    telefono: '3865124001',
    whatsapp: '3865124001',
    zona: 'Centro',
    logo_url: foto('naranjo-almacen', 500, 500),
    ...ubicacion(7),
    activo: true,
    calificacion: calificacionDe(resenasComercios[1]),
  },
  {
    id: 2,
    nombre: 'Panadería El Trigal',
    descripcion: 'Pan casero, facturas y tortas por encargue. Amasamos todos los días bien tempranito.',
    direccion: 'Av. San Martín 320',
    horarios: 'Lunes a domingo, 7 a 13 y 17 a 20 hs',
    telefono: '3865124002',
    whatsapp: '3865124002',
    zona: 'Centro',
    logo_url: foto('naranjo-panaderia', 500, 500),
    ...ubicacion(8),
    activo: true,
    calificacion: calificacionDe(resenasComercios[2]),
  },
  {
    id: 3,
    nombre: 'Carnicería Don Beto',
    descripcion: 'Carne vacuna y de cerdo, achuras y pollo fresco. Cortes para asado y milanesas.',
    direccion: 'Calle Belgrano 89',
    horarios: 'Lunes a sábado, 8 a 13 y 17 a 20:30 hs',
    telefono: '3865124003',
    whatsapp: '',
    zona: 'Barrio Norte',
    logo_url: foto('naranjo-carniceria', 500, 500),
    ...ubicacion(9),
    activo: true,
    calificacion: calificacionDe(resenasComercios[3]),
  },
  {
    id: 4,
    nombre: 'Ferretería San Cayetano',
    descripcion: 'Materiales de construcción, herramientas, pinturas y artículos para el campo.',
    direccion: 'Ruta 301 Km 12',
    horarios: 'Lunes a viernes, 8 a 18 hs. Sábado medio día',
    telefono: '3865124004',
    whatsapp: '3865124004',
    zona: 'Ruta 301',
    logo_url: foto('naranjo-ferreteria', 500, 500),
    ...ubicacion(10),
    activo: true,
    calificacion: calificacionDe(resenasComercios[4]),
  },
  {
    id: 5,
    nombre: 'Kiosco La Esquina',
    descripcion: 'Golosinas, gaseosas, cigarrillos, fotocopias y recarga de celular.',
    direccion: 'Esquina Plaza Principal',
    horarios: 'Todos los días, 8 a 22 hs',
    telefono: '',
    whatsapp: '3865124005',
    zona: 'Centro',
    logo_url: foto('naranjo-kiosco', 500, 500),
    ...ubicacion(11),
    activo: true,
    calificacion: calificacionDe(resenasComercios[5]),
  },
  {
    id: 6,
    nombre: 'Verdulería La Huerta',
    descripcion: 'Verdura y fruta fresca de la zona, todos los días recibimos changuitos nuevos.',
    direccion: 'Calle Belgrano 210',
    horarios: 'Lunes a sábado, 8 a 20 hs',
    telefono: '3865124006',
    whatsapp: '3865124006',
    zona: 'Centro',
    logo_url: foto('naranjo-verduleria', 500, 500),
    ...ubicacion(12),
    activo: true,
    calificacion: calificacionDe(resenasComercios[6]),
  },
  // Comercio real, visto en el mapa — sin foto propia por ahora (mejor sin
  // imagen que poner una foto de stock haciéndose pasar por el local real).
  {
    id: 7,
    nombre: 'Polirrubro Santa Rosa de Lima',
    descripcion: '',
    direccion: 'El Naranjo',
    horarios: '',
    telefono: '',
    whatsapp: '',
    zona: 'El Naranjo',
    logo_url: '',
    ...ubicacion(21),
    activo: true,
    calificacion: calificacionDe([]),
  },
]

// ---------------------------------------------------------------------
// Productores (el backend de este módulo no maneja foto todavía)
// ---------------------------------------------------------------------

const resenasProductores = {
  1: [resena(301, 'Nora Sosa', 5, 'Las naranjas más ricas de la zona, como corresponde al nombre del pueblo.', 8)],
}

export const mockProductores = [
  {
    id: 1,
    nombre: 'Familia Gómez',
    que_produce: 'Naranjas y limones de estación',
    que_vende: 'Bolsas de 10 y 20 kg, y por changuito',
    disponibilidad: 'De marzo a septiembre',
    zona: 'El Sunchal',
    telefono: '3865125001',
    whatsapp: '3865125001',
    activo: true,
    calificacion: calificacionDe(resenasProductores[1]),
  },
  {
    id: 2,
    nombre: 'Apiario Las Abejas del Monte',
    que_produce: 'Miel pura de monte',
    que_vende: 'Frascos de 500 g y 1 kg',
    disponibilidad: 'Todo el año',
    zona: 'Ruta 301',
    telefono: '',
    whatsapp: '3865125002',
    activo: true,
    calificacion: calificacionDe(resenasProductores[2]),
  },
  {
    id: 3,
    nombre: 'Tambo El Rincón',
    que_produce: 'Leche, queso fresco y dulce de leche casero',
    que_vende: 'Por litro, por kilo y por encargue',
    disponibilidad: 'Martes, jueves y sábado',
    zona: 'Centro',
    telefono: '3865125003',
    whatsapp: '3865125003',
    activo: true,
    calificacion: calificacionDe(resenasProductores[3]),
  },
  {
    id: 4,
    nombre: 'Huerta Orgánica Vicente',
    que_produce: 'Verduras de estación sin agroquímicos',
    que_vende: 'Bolsones semanales y venta suelta',
    disponibilidad: 'Todo el año, según cosecha',
    zona: 'Barrio Norte',
    telefono: '',
    whatsapp: '3865125004',
    activo: true,
    calificacion: calificacionDe(resenasProductores[4]),
  },
]

// ---------------------------------------------------------------------
// Empleos
// ---------------------------------------------------------------------

export const mockEmpleos = [
  {
    id: 1,
    tipo: 'busco_trabajador',
    titulo: 'Se busca ayudante de albañil',
    descripcion: 'Para obra en construcción en el centro. Se pagan los viáticos.',
    experiencia: 'No excluyente',
    habilidades: '',
    requisitos: 'Responsable y puntual',
    disponibilidad: 'Inmediata',
    horario: 'Lunes a viernes, 7 a 15 hs',
    zona: 'Centro',
    telefono: '3865126001',
    whatsapp: '3865126001',
    activo: true,
  },
  {
    id: 2,
    tipo: 'busco_trabajo',
    titulo: 'Busco trabajo de niñera',
    descripcion: 'Cuido chicos por hora o jornada completa. Tengo referencias.',
    experiencia: '4 años cuidando niños',
    habilidades: 'Primeros auxilios básicos',
    requisitos: '',
    disponibilidad: 'Lunes a sábado',
    horario: 'Mañana y tarde',
    zona: 'Barrio Norte',
    telefono: '',
    whatsapp: '3865126002',
    activo: true,
  },
  {
    id: 3,
    tipo: 'busco_trabajador',
    titulo: 'Se necesita moto para reparto',
    descripcion: 'Reparto de pedidos de una despensa, moto propia y con carnet.',
    experiencia: 'Deseable',
    habilidades: 'Manejo de moto',
    requisitos: 'Carnet vigente',
    disponibilidad: 'Fines de semana',
    horario: 'Viernes a domingo, 18 a 23 hs',
    zona: 'Centro',
    telefono: '3865126003',
    whatsapp: '3865126003',
    activo: true,
  },
  {
    id: 4,
    tipo: 'busco_trabajo',
    titulo: 'Busco trabajo de jardinero',
    descripcion: 'Corte de pasto, poda y mantenimiento de jardines. Traigo mis herramientas.',
    experiencia: '10 años',
    habilidades: 'Poda, riego, diseño básico',
    requisitos: '',
    disponibilidad: 'Todos los días',
    horario: 'A coordinar',
    zona: 'El Sunchal',
    telefono: '3865126004',
    whatsapp: '',
    activo: true,
  },
]

// ---------------------------------------------------------------------
// Instituciones (sin campo de foto en el backend)
// ---------------------------------------------------------------------

// Instituciones reales de El Naranjo (verificadas por fuentes públicas:
// Wikipedia, guía de escuelas de Tucumán y directorio de la Diócesis de
// Tucumán). Direcciones exactas, teléfonos y horarios no están publicados
// en ningún lado para la mayoría — quedan vacíos en vez de inventados
// hasta que alguien de la comuna los confirme.
export const mockInstituciones = [
  {
    id: 1,
    tipo: 'comuna',
    nombre: 'Comuna El Naranjo y El Sunchal',
    descripcion: 'Delegación comunal: trámites y atención al vecino.',
    direccion: 'El Naranjo, sobre la RP321',
    telefono: '03814280938',
    horarios: '',
    ...ubicacion(13),
    activo: true,
  },
  {
    id: 2,
    tipo: 'escuela',
    nombre: 'Escuela N.º 152 "Dr. Pedro Miguel Araoz"',
    descripcion: 'Nivel inicial y primario.',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    ...ubicacion(14),
    activo: true,
  },
  {
    id: 3,
    tipo: 'escuela',
    nombre: 'Escuela Media de El Naranjo',
    descripcion: 'Nivel secundario.',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    ...ubicacion(15),
    activo: true,
  },
  {
    id: 4,
    tipo: 'iglesia',
    nombre: 'Capilla Santa Rosa de Lima',
    descripcion: 'Depende de la Parroquia Nuestra Señora del Rosario (Burruyacú), Diócesis de Tucumán.',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    lat: -26.6549385,
    lng: -65.0480119,
    activo: true,
  },
  {
    id: 5,
    tipo: 'organizacion',
    nombre: 'Cocina Comunitaria Pan de Vida',
    descripcion: 'Comedor comunitario del barrio.',
    direccion: 'Barrio Matta, El Naranjo',
    telefono: '',
    horarios: '',
    ...ubicacion(17),
    activo: true,
  },
  {
    id: 6,
    tipo: 'club',
    nombre: 'La Isla Fútbol Club',
    descripcion: 'Club de fútbol del barrio La Isla.',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    ...ubicacion(18),
    activo: true,
  },
  {
    id: 7,
    tipo: 'salud',
    nombre: 'C.A.P.S. El Naranjo',
    descripcion: 'Centro de Atención Primaria de la Salud.',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    ...ubicacion(19),
    activo: true,
  },
  {
    id: 8,
    tipo: 'otro',
    nombre: 'Plaza principal El Naranjo',
    descripcion: 'Plaza central del pueblo.',
    direccion: 'El Naranjo, sobre la RP321',
    telefono: '',
    horarios: '',
    ...ubicacion(20),
    activo: true,
  },
  {
    id: 9,
    tipo: 'otro',
    nombre: 'Comisaría de El Naranjo',
    descripcion: '',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    lat: -26.6460287,
    lng: -65.0490286,
    activo: true,
  },
  {
    id: 10,
    tipo: 'otro',
    nombre: 'Parador turístico El Naranjo y El Sunchal',
    descripcion: '',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    lat: -26.7038251,
    lng: -65.0448752,
    activo: true,
  },
  {
    id: 11,
    tipo: 'escuela',
    nombre: 'Escuela N.º 375 "Francisco Molina"',
    descripcion: '',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    lat: -26.7062413,
    lng: -65.0468148,
    activo: true,
  },
  {
    id: 12,
    tipo: 'otro',
    nombre: 'Loma Encantada',
    descripcion: '',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    lat: -26.7098775,
    lng: -65.0439012,
    activo: true,
  },
  {
    id: 13,
    tipo: 'iglesia',
    nombre: 'La Voz Que Clama',
    descripcion: '',
    direccion: 'El Naranjo',
    telefono: '',
    horarios: '',
    lat: -26.6904042,
    lng: -65.0494795,
    activo: true,
  },
  {
    id: 14,
    tipo: 'otro',
    nombre: 'Balneario Dique El Sunchal',
    descripcion: '',
    direccion: 'El Sunchal',
    telefono: '',
    horarios: '',
    lat: -26.6151434,
    lng: -65.043981,
    activo: true,
  },
]

// ---------------------------------------------------------------------
// Avisos
// ---------------------------------------------------------------------

function haceDias(n) {
  return new Date(Date.now() - n * 86400000).toISOString()
}

function enDias(n) {
  return new Date(Date.now() + n * 86400000).toISOString()
}

export const mockAvisos = [
  {
    id: 1,
    tipo: 'corte_servicio',
    titulo: 'Corte de agua programado',
    cuerpo:
      'El jueves se corta el suministro de agua entre las 9 y las 16 hs por trabajos de mantenimiento en la cisterna. Junten agua con anticipación.',
    fecha_evento: null,
    foto_url: null,
    publicado: haceDias(1),
    activo: true,
  },
  {
    id: 2,
    tipo: 'reunion',
    titulo: 'Reunión vecinal en la plaza',
    cuerpo: 'Convocamos a todos los vecinos a una reunión para hablar sobre el arreglo de calles. Se sirve mate cocido.',
    fecha_evento: enDias(5),
    foto_url: foto('naranjo-reunion', 640, 420),
    publicado: haceDias(2),
    activo: true,
  },
  {
    id: 3,
    tipo: 'evento',
    titulo: 'Feria de productores este fin de semana',
    cuerpo: 'Sábado y domingo en la plaza principal: miel, quesos, verduras y artesanías de productores locales.',
    fecha_evento: enDias(3),
    foto_url: foto('naranjo-feria', 640, 420),
    publicado: haceDias(3),
    activo: true,
  },
  {
    id: 4,
    tipo: 'obra',
    titulo: 'Bacheo en Ruta 301',
    cuerpo: 'Comenzó el bacheo entre el km 8 y el km 14. Circular con precaución, hay reducción de un carril.',
    fecha_evento: null,
    foto_url: foto('naranjo-obra', 640, 420),
    publicado: haceDias(6),
    activo: true,
  },
  {
    id: 5,
    tipo: 'actividad',
    titulo: 'Taller de horticultura para vecinos',
    cuerpo: 'Actividad gratuita en la Comuna, organizada junto a la huerta orgánica Vicente. Cupos limitados.',
    fecha_evento: enDias(10),
    foto_url: foto('naranjo-taller', 640, 420),
    publicado: haceDias(4),
    activo: true,
  },
]

// ---------------------------------------------------------------------
// Reclamos (solo para pintar el mapa; no hace falta cargar muchos)
// ---------------------------------------------------------------------

export const mockReclamos = [
  {
    id: 1,
    categoria: 'Alumbrado público',
    descripcion: 'Se quemó la lámpara de la esquina de Belgrano y San Martín, queda muy oscuro.',
    zona: 'Centro',
    estado: 'pendiente',
    foto_url: foto('naranjo-reclamo-luz', 640, 420),
    ...ubicacion(17),
  },
  {
    id: 2,
    categoria: 'Bacheo',
    descripcion: 'Pozo grande en la calle de tierra camino a El Sunchal, complica el paso de vehículos.',
    zona: 'El Sunchal',
    estado: 'en_proceso',
    foto_url: foto('naranjo-reclamo-pozo', 640, 420),
    ...ubicacion(18),
  },
  {
    id: 3,
    categoria: 'Limpieza',
    descripcion: 'Terreno baldío con basura acumulada, atrae mosquitos.',
    zona: 'Barrio Norte',
    estado: 'resuelto',
    foto_url: foto('naranjo-reclamo-basura', 640, 420),
    ...ubicacion(19),
  },
]

// ---------------------------------------------------------------------
// Helpers usados por los api.js de cada módulo
// ---------------------------------------------------------------------

export const MODULOS_MOCK = {
  servicios: mockServicios,
  comercios: mockComercios,
  productores: mockProductores,
  empleos: mockEmpleos,
  instituciones: mockInstituciones,
  avisos: mockAvisos,
  reclamos: mockReclamos,
}

const RESENAS_MOCK = {
  servicios: resenasServicios,
  comercios: resenasComercios,
  productores: resenasProductores,
}

/** Emula la paginación de Laravel ({ data, meta }) filtrando por los params dados. */
export function paginar(items, params = {}) {
  const { page = 1, per_page: porPaginaParam, ...filtros } = params
  const porPagina = Number(porPaginaParam) || 20

  const filtrados = items.filter((item) =>
    Object.entries(filtros).every(([clave, valor]) => {
      if (valor === undefined || valor === null || valor === '') return true
      return String(item[clave]) === String(valor)
    }),
  )

  const total = filtrados.length
  const lastPage = Math.max(1, Math.ceil(total / porPagina))
  const currentPage = Math.min(Number(page) || 1, lastPage)
  const data = filtrados.slice((currentPage - 1) * porPagina, currentPage * porPagina)

  return {
    data,
    meta: { current_page: currentPage, last_page: lastPage, per_page: porPagina, total },
  }
}

export function buscarPorId(items, id) {
  return items.find((item) => String(item.id) === String(id))
}

/** Shape de listarResenas(modulo, id): { data, promedio, total }. */
export function resenasDe(modulo, id) {
  const resenas = RESENAS_MOCK[modulo]?.[id] ?? []
  const { promedio, total } = calificacionDe(resenas)
  return { data: resenas, promedio: total > 0 ? promedio : null, total }
}
