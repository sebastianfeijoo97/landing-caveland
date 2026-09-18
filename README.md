# Caveland Barber Studio — Landing de reservas

Landing premium, estática y *mobile first* para reservar cita en menos de
30 segundos. Pensada para recibir tráfico desde el link de Instagram y
desplegarse en Cloudflare Pages.

**Estado: EN VIVO en https://landing-caveland.vercel.app**

---

## 1. Lo que falta antes de publicar

Todo está en **`config/config.js`**, marcado con `← CONFIRMAR`:

| Dato | Valor actual | Qué hacer |
|---|---|---|
| Teléfono | `+593 99 999 9999` | Poner el real |
| WhatsApp | `593999999999` | Poner el real (sin `+` ni espacios) |
| Correo | `hola@cavelandbarber.com` | Poner el real |
| Instagram | `caveland.barberstudio` | Poner el usuario real (sin `@`) |
| Eslogan | «Entra como cliente, sal como leyenda.» | Cambiar si tienen uno propio |
| **Precios y duraciones** | Estimados | **Confirmar los 10 servicios** |
| Especialidades de barberos | Deducidas de sus fotos | Confirmar / ajustar |
| `diasLibres` de cada barbero | Solo domingo | Ajustar si alguno libra otro día |

El teléfono también aparece en el bloque `application/ld+json` de
`index.html` (SEO) — cámbialo ahí también. Y el `<link rel="canonical">`
cuando tengas el dominio final.

### ✅ Datos ya integrados

- **Nombre:** Caveland Barber Studio
- **Dirección:** Calle Diana Quintana Noboa, Urb. Central Park, Samborondón, Guayas
  (obtenida del enlace de Google Maps que enviaste)
- **Coordenadas:** `-2.1286516, -79.8646131`
- **Horario:** Lunes a viernes 10:00–19:00 · Sábados 10:00–18:00 · Domingos cerrado
- **Servicios (10):** corte de cabello, servicio de barba, manicura y pedicura,
  limpieza facial express, tratamiento anticaspa, tratamiento psoriasis,
  tratamiento caída de cabello, limpieza profunda de cuero cabelludo,
  tinturado, alisado express
- **Barberos (4):** Lex, Bryan, Peter, Roberto — con sus fotos reales

---

## 2. Identidad visual — ⚠️ lee esto

El brief pedía **«negro mate, dorado elegante, blanco, gris claro»**, y eso es
lo que está activo. Pero al integrar el logo real vi que **Caveland no usa
dorado**: el logo es blanco/plata sobre negro, con el poste de barbero en rojo
y azul, y el rótulo del local es cromado.

Por eso dejé preparada una **paleta alternativa «chrome»** al final de
`styles/main.css`, fiel al logo. Para activarla solo tienes que **descomentar
ese bloque** — cambia botones, bordes, acentos y degradados de toda la web sin
tocar HTML ni JS.

| Token | Dorado (activo) | Chrome (alternativa) |
|---|---|---|
| `--cv-gold` | `#c9a227` | `#d8d8dc` |
| `--cv-gold-light` | `#e8c766` | `#ffffff` |
| `--cv-gold-dark` | `#8c6d12` | `#8e8e96` |

Tipografías: **Bebas Neue** para títulos (condensada, masculina) e **Inter**
para el cuerpo.

---

## 3. Estructura

```
Landing Caveland/
├── index.html              Único HTML. Semántico + SEO + JSON-LD
├── README.md
├── _headers                Caché y seguridad para Cloudflare Pages
├── dev-server.ps1          Servidor local para previsualizar
├── tailwind.config.js      Config de Tailwind (solo si regeneras el CSS)
├── assets/
│   ├── logo.png            640×328, fondo transparente
│   ├── favicon.png         256×256, cuadrado para la pestaña
│   ├── local-exterior.jpg  1400×1750, fondo del hero
│   ├── local-interior.jpg  1400×1750, sección "Más que un corte"
│   └── barberos/           lex · bryan · peter · roberto (600×800, 3:4)
├── config/
│   └── config.js           ⭐ TODO lo editable vive aquí
├── styles/
│   ├── main.css            Hoja única (tokens + componentes + utilidades)
│   └── tailwind.input.css  Entrada para el CLI de Tailwind
└── js/
    ├── components.js       Íconos SVG y componentes reutilizables
    └── app.js              Wizard de reservas, validación y UX
```

**Regla de oro:** para cambiar textos, precios, horarios o contacto edita solo
`config/config.js`.

### Qué se hizo con las imágenes

Las 7 originales estaban en tu carpeta de Descargas. Se procesaron así:

- **Logo:** se recortó el borde negro sobrante y se hizo **transparente el
  fondo** (alfa proporcional al brillo), para que no se vea un recuadro negro
  encima de la fachada. 640 px de ancho, 153 KB.
- **Favicon:** `favicon.png`, 256×256. El logo es blanco, así que en una
  pestaña de navegador claro desaparecería: va sobre un cuadrado negro
  redondeado.
- **Fachada e interior:** recortadas a 4:5 (1400×1750) con sesgo hacia arriba
  para no perder el rótulo. ~270 KB cada una.
- **Barberos:** recortadas a **3:4 (600×800)**, cada una con un encuadre
  horizontal distinto para que el barbero quede centrado y su cara en el tercio
  superior (donde no la tapa el nombre).

Si cambias alguna foto, respeta esas proporciones o ajusta el recorte.

---

## 4. Verla en local

En este equipo no hay Node ni Python, así que incluí un servidor estático en
PowerShell. Desde la carpeta del proyecto:

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File dev-server.ps1 -Port 8788
```

Y abre <http://localhost:8788>.

---

## 5. Despliegue — YA ESTÁ EN VIVO

**URL de producción: https://landing-caveland.vercel.app**

| | |
|---|---|
| Repositorio | https://github.com/sebastianfeijoo97/landing-caveland |
| Proyecto Vercel | `landing-caveland` (`prj_ZBLB7zoZeDYXs4Hy6CRqcWTEBdMC`) |
| Rama de producción | `main` |

El proyecto es 100 % estático: **no hay build**.

### Cómo publicar un cambio

Está conectado a GitHub, así que **cada push a `main` se despliega solo**:

```bash
git add -A
git commit -m "Actualizo precios"
git push
```

En ~30 segundos el cambio está en vivo. Los pull requests generan además una
URL de preview propia.

### Configuración aplicada

`vercel.json` define las cabeceras y Vercel las está sirviendo (verificado):

- `/assets/*` → `max-age=31536000, immutable`
- `/styles/*` y `/js/*` → `max-age=604800`
- `/config/*` → `max-age=300` (para que tus ediciones se vean enseguida)
- `/index.html` → `max-age=0, must-revalidate`
- Seguridad: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`

> **Vercel Authentication está desactivada** a propósito. Vercel la activa por
> defecto en proyectos nuevos, lo que obligaría a iniciar sesión para ver la
> página — inservible para una landing pública que recibe tráfico de Instagram.
> Si algún día la reactivas, la web dejará de ser accesible para tus clientes.

### Dominio propio

Cuando tengas el dominio, añádelo en Vercel (*Project → Settings → Domains*) y
acuérdate de actualizar el `<link rel="canonical">` de `index.html`, que ahora
apunta a un valor de ejemplo.

> El archivo `_headers` que queda en el repo es de Cloudflare Pages y Vercel lo
> ignora. Lo dejé por si algún día migras; en Vercel manda `vercel.json`.

---

## 6. Cómo funciona la reserva

Wizard de 5 pasos: **Servicio → Barbero → Fecha → Hora → Datos**.

- Tocar una tarjeta en *Servicios* o *Barberos* la guarda y salta al wizard.
  La selección se sincroniza entre la vitrina y el paso correspondiente.
- Se generan los próximos 21 días; se deshabilitan los domingos y los días
  libres del barbero.
- Turnos cada 30 min entre apertura y cierre. Un servicio largo necesita
  bloques consecutivos libres: el **Tinturado (90 min)** un viernes solo se
  ofrece hasta las **17:30**, para que termine a las 19:00.
- Los turnos ocupados salen **deshabilitados y tachados** (estilo Airbnb).
- Hoy no se puede reservar con menos de 60 min de antelación.

### ⚠️ Importante: la disponibilidad es simulada

Al ser un sitio estático **no hay agenda real**. En `modo: 'demo'` los huecos
ocupados se generan con un hash determinista de `fecha + barbero`: siempre se
ven los mismos en un día dado, pero **no reflejan citas reales**.

Al confirmar, el cliente obtiene un resumen y un botón que abre WhatsApp con el
mensaje ya escrito — esa es, hoy, la confirmación real de la cita.

### Conectar una agenda de verdad

En `config/config.js`:

```js
disponibilidad: { modo: 'api', endpoint: '/api/disponibilidad' },
envio:          { modo: 'endpoint', url: '/api/reservas' }
```

Tu endpoint debe responder a
`GET /api/disponibilidad?fecha=2026-09-18&barbero=lex` con:

```json
{ "ocupadas": ["10:00", "10:30", "15:00"] }
```

Y aceptar un `POST /api/reservas` con:

```json
{
  "codigo": "CV-AB12CD",
  "servicio": "tinturado",
  "barbero": "peter",
  "fecha": "2026-09-18",
  "hora": "11:00",
  "cliente": { "nombre": "...", "whatsapp": "...", "email": "..." }
}
```

Se puede montar con *Cloudflare Functions* (carpeta `functions/`) sobre D1 o
KV, o apuntar a un n8n / Google Calendar.

---

## 7. Rendimiento

Ya aplicado:

- **CSS en un solo archivo**, sin frameworks en runtime → una sola petición,
  cero JS de estilos.
- **JS vanilla sin dependencias**, con `defer` y delegación de eventos.
- `loading="lazy"` bajo el pliegue; `fetchpriority="high"` y `preload` en la
  imagen del hero.
- Google Fonts sin bloquear el render (`media="print"` + `onload`), con
  `preconnect` y `display=swap`.
- `width`/`height` reales en todas las imágenes → sin *layout shift* (CLS).
- Animaciones solo sobre `transform` y `opacity`; scroll con
  `requestAnimationFrame`.
- `prefers-reduced-motion` respetado.

Peso total de imágenes: ~900 KB (antes de WebP).

### Pendiente: convertir a WebP

Este equipo no tiene ninguna herramienta de conversión instalada (ni Python, ni
Node, ni ImageMagick; el encoder de .NET solo hace BMP/JPEG/GIF/TIFF/PNG). Para
pasarlas a WebP y ahorrar ~30 %:

1. Sube `assets/` a <https://squoosh.app> y exporta como WebP.
2. Guarda los `.webp` en las mismas carpetas.
3. Actualiza las rutas en `config/config.js` (`imagenes` y `barberos[].foto`).

---

## 8. Accesibilidad

- HTML semántico (`header`, `main`, `section`, `footer`, `table` con `caption`).
- Todas las tarjetas seleccionables son `<button>` con `aria-pressed`.
- Turnos ocupados con `disabled` + `aria-label` explicativo.
- Errores de formulario con `role="alert"` y `aria-invalid`.
- Región `aria-live` que anuncia los cambios de paso y la confirmación.
- Foco visible en todos los elementos interactivos.
- Inputs a 16 px para evitar el zoom automático de iOS.
- Enlace «Saltar al contenido» al inicio.
- En el hero, el `<h1>` con el nombre está en `sr-only` (el logo ya muestra el
  nombre en pantalla, así se evita leerlo dos veces sin perder el SEO).

---

## 9. Regenerar el CSS con Tailwind (opcional)

`styles/main.css` está escrito a mano siguiendo la estructura de Tailwind
(`base` / `components` / `utilities`) y usa sus mismos nombres de clase. Se hizo
así para evitar el CDN de Tailwind, que carga ~120 KB de JavaScript y castiga el
Lighthouse en móvil.

Si prefieres el pipeline real, con Node instalado:

```bash
npm install -D tailwindcss
npx tailwindcss -i styles/tailwind.input.css -o styles/main.css --minify
```

`tailwind.config.js` ya trae la paleta y las tipografías mapeadas. Ojo:
perderías los componentes escritos a mano (`.service-card`, `.slot`,
`.booking-shell`…); tendrías que moverlos a `tailwind.input.css` dentro de
`@layer components` antes de compilar.

### ⚠️ Cuidado al tocar el CSS de imágenes

En `styles/main.css` el color de fondo que rellena el hueco mientras carga una
foto está aplicado **solo** a `.hero-bg`, `.experience-media` y `.barber-photo`
— nunca al selector `img` en general. Si se lo pones a todas las `img`, ese
color se pinta **detrás del logo transparente** y vuelve a aparecer el
rectángulo mate sobre la fachada.
