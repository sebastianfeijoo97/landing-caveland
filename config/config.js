/**
 * Caveland Barber Studio — Configuración central
 * ------------------------------------------------------------------
 * Este es el ÚNICO archivo que necesitas editar para cambiar textos,
 * precios, servicios, barberos, horarios y datos de contacto.
 * No hace falta tocar el HTML ni el JS.
 *
 * ⚠️  Lo marcado con "← CONFIRMAR" son datos que aún no me diste y
 *     puse estimados. Revísalos antes de publicar.
 */
window.CAVELAND = {
  /* ---------------------------------------------------------------
   * NEGOCIO
   * ------------------------------------------------------------- */
  negocio: {
    nombre: 'Caveland',
    nombreCompleto: 'Caveland Barber Studio',
    eslogan: 'Entra como cliente, sal como leyenda.',   // ← CONFIRMAR
    descripcion:
      'Barber studio en Samborondón. Cortes de precisión, barba impecable y cuidado capilar profesional.',

    telefono: '+593 99 999 9999',        // ← CONFIRMAR
    whatsapp: '593999999999',            // ← CONFIRMAR (internacional, sin + ni espacios)
    email: 'hola@cavelandbarber.com',    // ← CONFIRMAR
    instagram: 'caveland.barberstudio',  // ← CONFIRMAR (sin @)

    // Dirección obtenida del enlace de Google Maps que enviaste
    direccion: 'Calle Diana Quintana Noboa, Urb. Central Park, Samborondón, Guayas',
    ciudad: 'Samborondón',
    pais: 'Ecuador',
    moneda: '$',

    mapa: {
      lat: -2.1286516,
      lng: -79.8646131,
      // Iframe embebido (no requiere API key)
      embedUrl:
        'https://www.google.com/maps?q=-2.1286516,-79.8646131&hl=es&z=17&output=embed',
      // Botón "Cómo llegar" — enlace corto oficial del negocio
      direccionesUrl: 'https://maps.app.goo.gl/sFaM6GVRzzEyX5Ni6'
    }
  },

  /* ---------------------------------------------------------------
   * HORARIO DE ATENCIÓN
   * Lunes a viernes 10:00–19:00 · Sábados 10:00–18:00 · Domingos cerrado
   * dia: 0 = domingo … 6 = sábado
   * ------------------------------------------------------------- */
  horario: [
    { dia: 0, etiqueta: 'Domingo',   cerrado: true,  abre: null,    cierra: null },
    { dia: 1, etiqueta: 'Lunes',     cerrado: false, abre: '10:00', cierra: '19:00' },
    { dia: 2, etiqueta: 'Martes',    cerrado: false, abre: '10:00', cierra: '19:00' },
    { dia: 3, etiqueta: 'Miércoles', cerrado: false, abre: '10:00', cierra: '19:00' },
    { dia: 4, etiqueta: 'Jueves',    cerrado: false, abre: '10:00', cierra: '19:00' },
    { dia: 5, etiqueta: 'Viernes',   cerrado: false, abre: '10:00', cierra: '19:00' },
    { dia: 6, etiqueta: 'Sábado',    cerrado: false, abre: '10:00', cierra: '18:00' }
  ],

  /* ---------------------------------------------------------------
   * RESERVAS
   * ------------------------------------------------------------- */
  reservas: {
    intervaloMinutos: 30,      // Los turnos se generan cada 30 minutos
    diasDisponibles: 21,       // Días hacia adelante que se pueden reservar
    minutosDeAnticipacion: 60  // No reservar con menos de 1 h de antelación
  },

  /* ---------------------------------------------------------------
   * SERVICIOS
   * ⚠️  PRECIOS Y DURACIONES SON ESTIMADOS — ← CONFIRMAR TODOS
   * icono: clave del set SVG (ver js/components.js)
   * duracion: en minutos; define cuántos turnos de 30' ocupa
   * ------------------------------------------------------------- */
  servicios: [
    {
      id: 'corte-cabello',
      nombre: 'Corte de Cabello',
      descripcion: 'Corte a medida con tijera y máquina, lavado y peinado final.',
      duracion: 45,
      precio: 12,
      icono: 'tijeras',
      destacado: true
    },
    {
      id: 'barba',
      nombre: 'Servicio de Barba',
      descripcion: 'Perfilado, recorte y toalla caliente con aceites.',
      duracion: 30,
      precio: 8,
      icono: 'barba',
      destacado: false
    },
    {
      id: 'manicura-pedicura',
      nombre: 'Manicura y Pedicura',
      descripcion: 'Cuidado completo de manos y pies.',
      duracion: 60,
      precio: 18,
      icono: 'mano',
      destacado: false
    },
    {
      id: 'limpieza-facial',
      nombre: 'Limpieza Facial Express',
      descripcion: 'Exfoliación, extracción e hidratación en media hora.',
      duracion: 30,
      precio: 12,
      icono: 'facial',
      destacado: false
    },
    {
      id: 'tratamiento-caspa',
      nombre: 'Tratamiento Anticaspa',
      descripcion: 'Control de descamación y picazón del cuero cabelludo.',
      duracion: 45,
      precio: 20,
      icono: 'gota',
      destacado: false
    },
    {
      id: 'tratamiento-psoriasis',
      nombre: 'Tratamiento Psoriasis',
      descripcion: 'Protocolo calmante para cuero cabelludo sensible.',
      duracion: 45,
      precio: 22,
      icono: 'escudo',
      destacado: false
    },
    {
      id: 'tratamiento-caida',
      nombre: 'Tratamiento Caída de Cabello',
      descripcion: 'Estimulación capilar y fortalecimiento del folículo.',
      duracion: 45,
      precio: 25,
      icono: 'brote',
      destacado: false
    },
    {
      id: 'limpieza-cuero',
      nombre: 'Limpieza Profunda de Cuero Cabelludo',
      descripcion: 'Detox capilar que elimina residuos y exceso de grasa.',
      duracion: 45,
      precio: 18,
      icono: 'burbujas',
      destacado: false
    },
    {
      id: 'tinturado',
      nombre: 'Tinturado',
      descripcion: 'Color, cobertura de canas y matices con producto premium.',
      duracion: 90,
      precio: 30,
      icono: 'color',
      destacado: false
    },
    {
      id: 'alisado-express',
      nombre: 'Alisado Express',
      descripcion: 'Alisado rápido con acabado natural y sin frizz.',
      duracion: 60,
      precio: 28,
      icono: 'plancha',
      destacado: false
    }
  ],

  /* ---------------------------------------------------------------
   * BARBEROS
   * ⚠️  Las especialidades las deduje de lo que hace cada uno en su
   *     foto. ← CONFIRMAR / ajustar.
   *     diasLibres: días que NO trabaja (0 = domingo … 6 = sábado)
   * ------------------------------------------------------------- */
  barberos: [
    {
      id: 'lex',
      nombre: 'Lex',
      especialidad: 'Corte Clásico & Tijera',
      bio: 'Trabajo de tijera y texturizado.',
      foto: 'assets/barberos/lex.jpg',
      diasLibres: [0]
    },
    {
      id: 'bryan',
      nombre: 'Bryan',
      especialidad: 'Barba & Perfilado',
      bio: 'Diseño de barba y afeitado clásico.',
      foto: 'assets/barberos/bryan.jpg',
      diasLibres: [0]
    },
    {
      id: 'peter',
      nombre: 'Peter',
      especialidad: 'Styling & Acabados',
      bio: 'Peinado, secado y acabado final.',
      foto: 'assets/barberos/peter.jpg',
      diasLibres: [0]
    },
    {
      id: 'roberto',
      nombre: 'Roberto',
      especialidad: 'Fades & Corte Infantil',
      bio: 'Degradados y cortes para los más pequeños.',
      foto: 'assets/barberos/roberto.jpg',
      diasLibres: [0]
    }
  ],

  /* ---------------------------------------------------------------
   * IMÁGENES
   * ------------------------------------------------------------- */
  imagenes: {
    logo: 'assets/logo.png',
    localExterior: 'assets/local-exterior.jpg',
    localInterior: 'assets/local-interior.jpg'
  },

  /* ---------------------------------------------------------------
   * DISPONIBILIDAD
   * ------------------------------------------------------------- */
  disponibilidad: {
    /**
     * 'demo' → los horarios ocupados se generan de forma determinista
     *          (el mismo día siempre muestra los mismos huecos).
     *          NO son citas reales. Ver README.
     * 'api'  → se consultan en `endpoint`.
     */
    modo: 'demo',
    endpoint: '/api/disponibilidad',
    ocupacionDemo: 0.22
  },

  /* ---------------------------------------------------------------
   * ENVÍO DE LA RESERVA
   * 'whatsapp' → abre WhatsApp con el resumen listo para enviar
   * 'endpoint' → hace POST a `url`
   * ------------------------------------------------------------- */
  envio: {
    modo: 'whatsapp',
    url: '/api/reservas'
  }
};
