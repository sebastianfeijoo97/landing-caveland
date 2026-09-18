/**
 * Caveland — Componentes reutilizables e íconos
 * ------------------------------------------------------------------
 * Todo lo que se dibuja en pantalla sale de aquí, así el HTML
 * se mantiene limpio y los componentes se reutilizan.
 */
(function (window, document) {
  'use strict';

  /* ================================================================
   * ÍCONOS — SVG inline, heredan el color con `currentColor`
   * ============================================================== */
  var S = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
          'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

  var ICONS = {
    tijeras:   '<svg ' + S + '><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/></svg>',
    corona:    '<svg ' + S + '><path d="m2 18 2-11 5 4 3-6 3 6 5-4 2 11z"/><path d="M4 21h16"/></svg>',
    barba:     '<svg ' + S + '><path d="M6 4v5a6 6 0 0 0 12 0V4"/><path d="M6 9c0 6 2.7 11 6 11s6-5 6-11"/><path d="M9 9h.01M15 9h.01"/></svg>',
    navaja:    '<svg ' + S + '><path d="M3 21 14 10l7-7v4L10 18H6z"/><path d="M14 10 10 6"/></svg>',
    rayo:      '<svg ' + S + '><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    nino:      '<svg ' + S + '><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/><path d="M9 2.5c1-1 5-1 6 0"/></svg>',
    facial:    '<svg ' + S + '><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8.5 15a5 5 0 0 0 7 0"/></svg>',
    color:     '<svg ' + S + '><path d="M12 3a9 9 0 1 0 0 18 2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.3h2A4 4 0 0 0 21 10c0-3.9-4-7-9-7Z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></svg>',
    reloj:     '<svg ' + S + '><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    check:     '<svg ' + S + ' stroke-width="2.6"><path d="m5 13 4 4L19 7"/></svg>',
    calendario:'<svg ' + S + '><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    usuario:   '<svg ' + S + '><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    pin:       '<svg ' + S + '><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    telefono:  '<svg ' + S + '><path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3Z"/></svg>',
    mail:      '<svg ' + S + '><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    instagram: '<svg ' + S + '><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
    whatsapp:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.13c-.25.69-1.44 1.32-1.99 1.37-.53.05-1.02.24-3.44-.72-2.89-1.14-4.72-4.1-4.86-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09 1-2.37c.26-.29.57-.36.76-.36l.55.01c.18.01.41-.07.64.49.25.6.83 2.07.9 2.22.07.15.12.32.02.51-.1.19-.15.31-.29.48l-.44.51c-.14.14-.29.3-.12.59.16.29.73 1.2 1.56 1.94 1.07.95 1.97 1.25 2.26 1.39.29.15.45.12.62-.07.17-.19.71-.83.9-1.12.19-.29.38-.24.64-.14.26.09 1.66.78 1.94.93.29.14.48.21.55.33.07.12.07.69-.18 1.38Z"/></svg>',
    alerta:    '<svg ' + S + '><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    flechaAbajo:'<svg ' + S + '><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    flechaDer: '<svg ' + S + '><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    flechaIzq: '<svg ' + S + '><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    estrella:  '<svg ' + S + ' fill="currentColor"><path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 16.8 6.6 19.6l1.2-6L3.3 9.4l6.1-.8z"/></svg>',
    corte:     '<svg ' + S + '><path d="M4 20V10a8 8 0 0 1 16 0v10"/><path d="M4 14h16"/></svg>',
    calendarioX:'<svg ' + S + '><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M10 14l4 4M14 14l-4 4"/></svg>',
    dinero:    '<svg ' + S + '><circle cx="12" cy="12" r="9"/><path d="M12 7v10M14.5 9.5a2.5 2.5 0 0 0-5 .5c0 2.5 5 1.5 5 4a2.5 2.5 0 0 1-5 .5"/></svg>',
    mano:      '<svg ' + S + '><path d="M8 12.5V5.6a1.6 1.6 0 0 1 3.2 0v5.6"/><path d="M11.2 11.2V4.8a1.6 1.6 0 0 1 3.2 0v6.4"/><path d="M14.4 11.6V6.8a1.6 1.6 0 0 1 3.2 0v8.4a5.6 5.6 0 0 1-5.6 5.6h-.8a5.6 5.6 0 0 1-5.6-5.6v-2.4a1.6 1.6 0 0 1 3.2 0"/></svg>',
    gota:      '<svg ' + S + '><path d="M12 3.2s6 6.3 6 10a6 6 0 0 1-12 0c0-3.7 6-10 6-10Z"/><path d="M9.5 13.8a2.8 2.8 0 0 0 2.5 3.4"/></svg>',
    escudo:    '<svg ' + S + '><path d="m12 3 7.2 3v5.5c0 4.4-3.1 8.4-7.2 9.7-4.1-1.3-7.2-5.3-7.2-9.7V6z"/><path d="m9 12 2.1 2.1L15.2 10"/></svg>',
    brote:     '<svg ' + S + '><path d="M12 21v-7.4"/><path d="M12 13.6c0-3.4 2.8-6.2 6.2-6.2 0 3.4-2.8 6.2-6.2 6.2Z"/><path d="M12 13.6C12 10.9 9.8 8.7 7.1 8.7c0 2.7 2.2 4.9 4.9 4.9Z"/><path d="M8.5 21h7"/></svg>',
    burbujas:  '<svg ' + S + '><circle cx="9.5" cy="14.5" r="5.2"/><circle cx="17" cy="7.8" r="2.9"/><circle cx="16.8" cy="16.6" r="2"/></svg>',
    plancha:   '<svg ' + S + '><rect x="3" y="6.8" width="13" height="3.6" rx="1.8"/><rect x="3" y="13.6" width="13" height="3.6" rx="1.8"/><path d="M16 8.6h5M16 15.4h5"/></svg>'
  };

  /**
   * Devuelve el SVG de un ícono con el tamaño indicado.
   * @param {string} nombre  clave dentro de ICONS
   * @param {number} [tam=24] tamaño en px
   */
  function icono(nombre, tam) {
    var svg = ICONS[nombre] || ICONS.tijeras;
    var px = tam || 24;
    return svg.replace('<svg ', '<svg width="' + px + '" height="' + px + '" aria-hidden="true" focusable="false" ');
  }

  /* ================================================================
   * UTILIDADES
   * ============================================================== */

  /** Escapa texto antes de inyectarlo como HTML. */
  function esc(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Convierte "90" minutos en "1 h 30 min". */
  function formatearDuracion(min) {
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60);
    var m = min % 60;
    return h + ' h' + (m ? ' ' + m + ' min' : '');
  }

  /* ================================================================
   * COMPONENTES
   * ============================================================== */

  /** Tarjeta de servicio (botón seleccionable). */
  function tarjetaServicio(servicio, moneda) {
    return (
      '<button type="button" class="service-card" role="button" aria-pressed="false" ' +
        'data-servicio="' + esc(servicio.id) + '">' +
        (servicio.destacado ? '<span class="tag-popular">Más pedido</span>' : '') +
        '<span class="select-check">' + icono('check', 13) + '</span>' +
        '<span class="service-icon">' + icono(servicio.icono, 22) + '</span>' +
        '<span class="service-body">' +
          '<span class="service-name">' + esc(servicio.nombre) + '</span>' +
          '<span class="service-desc">' + esc(servicio.descripcion) + '</span>' +
          '<span class="service-meta">' +
            '<span class="service-price">' + esc(moneda) + esc(servicio.precio) + '</span>' +
            '<span class="service-duration">' + icono('reloj', 14) +
              formatearDuracion(servicio.duracion) +
            '</span>' +
          '</span>' +
        '</span>' +
      '</button>'
    );
  }

  /** Tarjeta de barbero (botón seleccionable). */
  function tarjetaBarbero(barbero, cargaDiferida) {
    return (
      '<button type="button" class="barber-card" role="button" aria-pressed="false" ' +
        'data-barbero="' + esc(barbero.id) + '">' +
        '<span class="select-check">' + icono('check', 13) + '</span>' +
        '<span class="barber-photo-wrap">' +
          '<img src="' + esc(barbero.foto) + '" alt="' + esc(barbero.nombre) +
            ', barbero en Caveland — ' + esc(barbero.especialidad) + '" ' +
            'class="barber-photo" width="600" height="800" ' +
            'loading="' + (cargaDiferida ? 'lazy' : 'eager') + '" decoding="async">' +
        '</span>' +
        '<span class="barber-info">' +
          '<span class="barber-name">' + esc(barbero.nombre) + '</span>' +
          '<span class="barber-role">' + esc(barbero.especialidad) + '</span>' +
        '</span>' +
      '</button>'
    );
  }

  /** Chip de fecha del carrusel. */
  function chipFecha(info) {
    return (
      '<button type="button" class="date-chip" aria-pressed="false" ' +
        'data-fecha="' + esc(info.iso) + '"' +
        (info.cerrado ? ' disabled aria-label="' + esc(info.aria) + ' — cerrado"' :
                        ' aria-label="' + esc(info.aria) + '"') + '>' +
        '<span class="date-dow">' + esc(info.dow) + '</span>' +
        '<span class="date-day">' + esc(info.dia) + '</span>' +
        '<span class="date-month">' + esc(info.mes) + '</span>' +
      '</button>'
    );
  }

  /** Turno de la rejilla de horarios. */
  function turno(hora, ocupado) {
    return (
      '<button type="button" class="slot" aria-pressed="false" data-hora="' + esc(hora) + '"' +
        (ocupado ? ' disabled aria-label="' + esc(hora) + ' — no disponible"'
                 : ' aria-label="Reservar a las ' + esc(hora) + '"') + '>' +
        esc(hora) +
      '</button>'
    );
  }

  /** Fila del resumen de la reserva. */
  function filaResumen(nombreIcono, clave, valor, esTotal) {
    return (
      '<div class="summary-row">' +
        '<span class="summary-key">' + icono(nombreIcono, 16) + esc(clave) + '</span>' +
        '<span class="summary-val' + (esTotal ? ' summary-total' : '') + '">' + esc(valor) + '</span>' +
      '</div>'
    );
  }

  /** Bloque de estado vacío. */
  function estadoVacio(nombreIcono, mensaje) {
    return (
      '<div class="empty-state">' + icono(nombreIcono, 28) +
        '<p>' + esc(mensaje) + '</p>' +
      '</div>'
    );
  }

  /** Placeholders mientras se cargan los horarios. */
  function esqueletoTurnos(cantidad) {
    var html = '';
    for (var i = 0; i < cantidad; i++) html += '<div class="skeleton" aria-hidden="true"></div>';
    return html;
  }

  /* ================================================================
   * EXPORT
   * ============================================================== */
  window.CV = {
    icono: icono,
    esc: esc,
    formatearDuracion: formatearDuracion,
    tarjetaServicio: tarjetaServicio,
    tarjetaBarbero: tarjetaBarbero,
    chipFecha: chipFecha,
    turno: turno,
    filaResumen: filaResumen,
    estadoVacio: estadoVacio,
    esqueletoTurnos: esqueletoTurnos
  };
})(window, document);
