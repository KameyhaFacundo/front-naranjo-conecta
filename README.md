# El Naranjo Conecta — Frontend (React + Vite, PWA)

## Estructura

```
src/
  app.jsx / main.jsx     Punto de entrada, rutas
  shared/
    api/client.js         Instancia de axios (token, baseURL)
    hooks/useAuth.jsx      Contexto de sesión (login/registro/logout)
    hooks/useListado.js    Hook genérico para listar un recurso
    components/            Layout, Tarjeta, WhatsappButton, ListaEstado, ProtectedRoute
  features/
    auth/          Login, registro
    admin/          Panel administrativo unificado (solo rol admin)
    mis/            Mis publicaciones: editar/borrar lo propio
    mapa/           Mapa interactivo (Leaflet) con filtros por capa
    servicios/      Empleo y Servicios + "buscar cerca de mí"
    comercios/      Comercios locales
    productores/    Productores locales
    empleos/        Busco trabajo / Busco trabajador
    reclamos/       Reclamos con flujo de estados
    instituciones/  Directorio de instituciones (solo admin publica)
    avisos/         Comunicación comunitaria (solo admin publica)
    emergencias/    Acceso rápido a emergencias
```

Cada feature sigue el mismo patrón: `api.js` (llamadas HTTP), `<Modulo>Page.jsx`
(listado) y, si el módulo lo necesita, `<Modulo>Form.jsx` (publicar). Para un
módulo nuevo, copiá ese patrón y sumá la ruta en `src/App.jsx` + el enlace en
`src/shared/components/Layout.jsx`.

## Estilos

El diseño vive en `src/styles/index.css` (clases propias, mobile-first: la
mayoría de los vecinos entra desde el teléfono). Además está **Tailwind CSS
v4** configurado en `src/styles/tailwind.css` para usarlo de forma gradual:
los componentes nuevos pueden usar utilidades (`bg-naranja`, `text-tierra`,
`font-serif`, breakpoints `sm:`/`md:`…). No se importa el reset (preflight)
de Tailwind para no pisar los estilos existentes, y las utilidades quedan en
su capa, así que el CSS propio sigue mandando donde ya hay clases.

## Requisitos

- Node.js >= 18

## Puesta en marcha

```bash
npm install
cp .env.example .env   # apuntá VITE_API_URL al backend (por defecto http://localhost:8000/api)
npm run dev            # http://localhost:5173
```

## Por qué PWA (no app nativa todavía)

Un solo código React sirve como sitio web y como app instalable en el
celular (ícono, funcionamiento offline básico, sin pasar por Google Play).
`vite-plugin-pwa` ya está configurado en `vite.config.js`. Una app nativa
con React Native/Expo se evalúa más adelante, solo si el relevamiento de
campo muestra que hace falta (ver el documento del proyecto).

## Notas

- El mapa (`src/features/mapa`) usa OpenStreetMap + Leaflet, sin costo ni
  API key. El centro del mapa es un valor aproximado de Burruyacú: hay que
  ajustarlo a las coordenadas reales de El Naranjo.
- El contacto siempre pasa por WhatsApp (`WhatsappButton`, links `wa.me`):
  la plataforma no tiene mensajería propia.
- La ubicación que carga cada usuario es aproximada (zona, no domicilio
  exacto) — así está pensado el formulario y el backend.
