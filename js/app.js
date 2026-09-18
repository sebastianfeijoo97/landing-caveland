/**
 * Caveland — Lógica de la landing y del wizard de reservas
 * ------------------------------------------------------------------
 * Flujo: Servicio → Barbero → Fecha → Hora → Datos → Confirmación
 */
(function (window, document) {
  'use strict';

  var CFG = window.CAVELAND;
  var C = window.CV;

  if (!CFG || !C) {
    console.error('[Caveland] Falta config.js o components.js');
    return;
  }

  /* ================================================================
   * ATAJOS
   * ============================================================== */
  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) {
    return Array.prototype.slice.call((raiz || document).querySelectorAll(sel));
  }

  var DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  var DIAS_LARGOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  var MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
                      'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  var TOTAL_PASOS = 5;

  /* ================================================================
   * ESTADO
   * ============================================================== */
  var estado = {
    paso: 1,
    servicio: null,
    barbero: null,
    fecha: null,   // 'YYYY-MM-DD'
    hora: null,    // 'HH:MM'
    cliente: { nombre: '', whatsapp: '', email: '' },
    codigo: null
  };

  /* ================================================================
   * FECHAS Y HORAS (siempre en hora local, sin saltos de UTC)
   * ============================================================== */

  /** Date → 'YYYY-MM-DD' usando la fecha local. */
  function aISO(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var dia = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + dia;
  }

  /** 'YYYY-MM-DD' → Date local a medianoche. */
  function desdeISO(iso) {
    var p = iso.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  /** 'HH:MM' → minutos desde medianoche. */
  function aMinutos(hhmm) {
    var p = hhmm.split(':');
    return Number(p[0]) * 60 + Number(p[1]);
  }

  /** Minutos desde medianoche → 'HH:MM'. */
  function aHora(min) {
    var h = Math.floor(min / 60);
    var m = min % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  /** 'YYYY-MM-DD' → 'Sábado 21 de septiembre'. */
  function fechaLarga(iso) {
    var d = desdeISO(iso);
    return DIAS_LARGOS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES_LARGOS[d.getMonth()];
  }

  /** Configuración de horario para un día concreto. */
  function horarioDe(iso) {
    var dow = desdeISO(iso).getDay();
    for (var i = 0; i < CFG.horario.length; i++) {
      if (CFG.horario[i].dia === dow) return CFG.horario[i];
    }
    return null;
  }

  /* ================================================================
   * DISPONIBILIDAD
   * ============================================================== */

  /**
   * Hash determinista de una cadena. Sirve para que el modo demo
   * muestre SIEMPRE los mismos huecos ocupados en un día dado,
   * en lugar de cambiar en cada recarga.
   */
  function hash(texto) {
    var h = 2166136261;
    for (var i = 0; i < texto.length; i++) {
      h ^= texto.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  }

  /**
   * Devuelve un Set con las horas ('HH:MM') ya ocupadas.
   * En modo 'api' esto debería sustituirse por una llamada real.
   */
  function horasOcupadas(iso, barberoId) {
    var ocupadas = {};
    var semilla = hash(iso + '|' + barberoId);
    var h = horarioDe(iso);
    if (!h || h.cerrado) return ocupadas;

    var paso = CFG.reservas.intervaloMinutos;
    var inicio = aMinutos(h.abre);
    var fin = aMinutos(h.cierra);
    var umbral = CFG.disponibilidad.ocupacionDemo * 4294967295;

    for (var m = inicio; m < fin; m += paso) {
      semilla = (semilla * 1664525 + 1013904223) >>> 0;
      if (semilla < umbral) ocupadas[aHora(m)] = true;
    }
    return ocupadas;
  }

  /* ================================================================
   * RENDER DE SECCIONES ESTÁTICAS
   * ============================================================== */

  function pintarServicios() {
    var html = CFG.servicios.map(function (s) {
      return C.tarjetaServicio(s, CFG.negocio.moneda);
    }).join('');

    var vitrina = $('#servicios-grid');
    var wizard = $('#paso-servicio-grid');
    if (vitrina) vitrina.innerHTML = html;
    if (wizard) wizard.innerHTML = html;
  }

  function pintarBarberos() {
    var vitrina = $('#barberos-grid');
    var wizard = $('#paso-barbero-grid');

    if (vitrina) {
      vitrina.innerHTML = CFG.barberos.map(function (b, i) {
        return C.tarjetaBarbero(b, i > 1); // las dos primeras cargan de inmediato
      }).join('');
    }
    if (wizard) {
      wizard.innerHTML = CFG.barberos.map(function (b) {
        return C.tarjetaBarbero(b, true);
      }).join('');
    }
  }

  function pintarHorario() {
    var destinos = $$('#horario-tbody, #horario-tbody-footer');
    if (!destinos.length) return;
    var hoy = new Date().getDay();

    // Empezamos en lunes para que se lea como un horario comercial
    var orden = CFG.horario.slice().sort(function (a, b) {
      return ((a.dia + 6) % 7) - ((b.dia + 6) % 7);
    });

    var html = orden.map(function (h) {
      var texto = h.cerrado
        ? '<span class="hours-closed">Cerrado</span>'
        : h.abre + ' – ' + h.cierra;
      return '<tr' + (h.dia === hoy ? ' class="is-today"' : '') + '>' +
               '<td class="hours-day">' + C.esc(h.etiqueta) + '</td>' +
               '<td class="hours-time">' + texto + '</td>' +
             '</tr>';
    }).join('');

    destinos.forEach(function (cuerpo) { cuerpo.innerHTML = html; });
  }

  /** Rellena los textos que salen del config (contacto, enlaces, etc.). */
  function pintarDatosNegocio() {
    var n = CFG.negocio;
    var wa = 'https://wa.me/' + n.whatsapp;
    var ig = 'https://instagram.com/' + n.instagram;

    $$('[data-cv="nombre"]').forEach(function (el) { el.textContent = n.nombre; });
    $$('[data-cv="nombre-completo"]').forEach(function (el) { el.textContent = n.nombreCompleto; });
    $$('[data-cv="eslogan"]').forEach(function (el) { el.textContent = n.eslogan; });
    $$('[data-cv="descripcion"]').forEach(function (el) { el.textContent = n.descripcion; });
    $$('[data-cv="direccion"]').forEach(function (el) { el.textContent = n.direccion; });
    $$('[data-cv="telefono"]').forEach(function (el) { el.textContent = n.telefono; });
    $$('[data-cv="email"]').forEach(function (el) { el.textContent = n.email; });
    $$('[data-cv="instagram"]').forEach(function (el) { el.textContent = '@' + n.instagram; });
    $$('[data-cv="anio"]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    $$('[data-cv-href="whatsapp"]').forEach(function (el) { el.href = wa; });
    $$('[data-cv-href="instagram"]').forEach(function (el) { el.href = ig; });
    $$('[data-cv-href="telefono"]').forEach(function (el) {
      el.href = 'tel:' + n.telefono.replace(/\s/g, '');
    });
    $$('[data-cv-href="email"]').forEach(function (el) { el.href = 'mailto:' + n.email; });
    $$('[data-cv-href="direcciones"]').forEach(function (el) { el.href = n.mapa.direccionesUrl; });

    var mapa = $('#mapa-iframe');
    if (mapa) mapa.src = n.mapa.embedUrl;

    // Imágenes que dependen del config
    var logos = $$('[data-cv-src="logo"]');
    logos.forEach(function (el) { el.src = CFG.imagenes.logo; });
    $$('[data-cv-src="exterior"]').forEach(function (el) { el.src = CFG.imagenes.localExterior; });
    $$('[data-cv-src="interior"]').forEach(function (el) { el.src = CFG.imagenes.localInterior; });
  }

  /* ================================================================
   * SELECCIÓN (sincroniza vitrina y wizard)
   * ============================================================== */

  function sincronizar(atributo, valor) {
    $$('[data-' + atributo + ']').forEach(function (el) {
      el.setAttribute('aria-pressed', String(el.getAttribute('data-' + atributo) === valor));
    });
  }

  function seleccionarServicio(id, irAlPaso) {
    var servicio = CFG.servicios.filter(function (s) { return s.id === id; })[0];
    if (!servicio) return;

    estado.servicio = servicio;
    // Si cambia el servicio, la hora elegida puede dejar de caber
    estado.hora = null;
    sincronizar('servicio', id);
    actualizarCTA();

    if (irAlPaso) {
      irA(2);
      desplazarAReservas();
    }
    validarPasoActual();
  }

  function seleccionarBarbero(id, irAlPaso) {
    var barbero = CFG.barberos.filter(function (b) { return b.id === id; })[0];
    if (!barbero) return;

    estado.barbero = barbero;
    // El barbero define qué días y horas están libres
    estado.fecha = null;
    estado.hora = null;
    sincronizar('barbero', id);

    if (irAlPaso) {
      irA(3);
      desplazarAReservas();
    }
    validarPasoActual();
  }

  /* ================================================================
   * PASO 3 — FECHAS
   * ============================================================== */

  function pintarFechas() {
    var cont = $('#fechas-scroller');
    if (!cont || !estado.barbero) return;

    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var libres = estado.barbero.diasLibres || [];
    var html = '';
    var primeraDisponible = null;

    for (var i = 0; i < CFG.reservas.diasDisponibles; i++) {
      var d = new Date(hoy);
      d.setDate(hoy.getDate() + i);

      var iso = aISO(d);
      var h = horarioDe(iso);
      var cerrado = !h || h.cerrado || libres.indexOf(d.getDay()) !== -1;

      // Si es hoy y ya no quedan turnos por delante, también se bloquea
      if (!cerrado && i === 0 && !quedanTurnosHoy(iso)) cerrado = true;

      if (!cerrado && !primeraDisponible) primeraDisponible = iso;

      html += C.chipFecha({
        iso: iso,
        dow: i === 0 ? 'Hoy' : DIAS_CORTOS[d.getDay()],
        dia: d.getDate(),
        mes: MESES_CORTOS[d.getMonth()],
        cerrado: cerrado,
        aria: DIAS_LARGOS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES_LARGOS[d.getMonth()]
      });
    }

    cont.innerHTML = html;

    // Preseleccionamos el primer día libre para ahorrarle un clic al cliente
    if (!estado.fecha && primeraDisponible) {
      seleccionarFecha(primeraDisponible);
    } else if (estado.fecha) {
      sincronizar('fecha', estado.fecha);
    }
  }

  /** ¿Queda algún turno hoy respetando la anticipación mínima? */
  function quedanTurnosHoy(iso) {
    var h = horarioDe(iso);
    if (!h || h.cerrado) return false;

    var ahora = new Date();
    var limite = ahora.getHours() * 60 + ahora.getMinutes() + CFG.reservas.minutosDeAnticipacion;
    var duracion = estado.servicio ? estado.servicio.duracion : CFG.reservas.intervaloMinutos;

    return aMinutos(h.cierra) - duracion >= Math.max(aMinutos(h.abre), limite);
  }

  function seleccionarFecha(iso) {
    estado.fecha = iso;
    estado.hora = null;
    sincronizar('fecha', iso);
    pintarTurnos();
    validarPasoActual();
  }

  /* ================================================================
   * PASO 4 — HORAS
   * ============================================================== */

  function pintarTurnos() {
    var cont = $('#turnos-grid');
    var titulo = $('#turnos-fecha');
    if (!cont) return;

    if (!estado.fecha || !estado.barbero || !estado.servicio) {
      cont.innerHTML = C.estadoVacio('calendarioX', 'Elige servicio, barbero y fecha para ver los horarios.');
      return;
    }

    if (titulo) titulo.textContent = fechaLarga(estado.fecha);

    var h = horarioDe(estado.fecha);
    if (!h || h.cerrado) {
      cont.innerHTML = C.estadoVacio('calendarioX', 'Ese día no abrimos. Prueba con otra fecha.');
      return;
    }

    // Pequeño skeleton: en modo demo es instantáneo, pero deja el hueco
    // listo para cuando los horarios vengan de una API real.
    cont.innerHTML = C.esqueletoTurnos(8);

    obtenerOcupadas(estado.fecha, estado.barbero.id, function (ocupadas) {
      var paso = CFG.reservas.intervaloMinutos;
      var abre = aMinutos(h.abre);
      var cierra = aMinutos(h.cierra);
      var duracion = estado.servicio.duracion;
      var bloques = Math.ceil(duracion / paso);

      var esHoy = estado.fecha === aISO(new Date());
      var ahora = new Date();
      var limite = esHoy
        ? ahora.getHours() * 60 + ahora.getMinutes() + CFG.reservas.minutosDeAnticipacion
        : -1;

      var html = '';
      var hayLibres = false;

      for (var m = abre; m + duracion <= cierra; m += paso) {
        var libre = m >= limite;

        // El servicio debe caber entero: todos sus bloques han de estar libres
        for (var b = 0; b < bloques && libre; b++) {
          if (ocupadas[aHora(m + b * paso)]) libre = false;
        }

        if (libre) hayLibres = true;
        html += C.turno(aHora(m), !libre);
      }

      if (!html) {
        cont.innerHTML = C.estadoVacio('calendarioX',
          'No hay turnos que encajen con este servicio ese día.');
        return;
      }

      cont.innerHTML = html;

      if (!hayLibres) {
        mostrarToast('Ese día está completo. Prueba con otra fecha.');
      }
      if (estado.hora) sincronizar('hora', estado.hora);
    });
  }

  /**
   * Obtiene los horarios ocupados. En modo 'demo' los genera localmente;
   * en modo 'api' hace fetch al endpoint configurado.
   */
  function obtenerOcupadas(iso, barberoId, callback) {
    if (CFG.disponibilidad.modo !== 'api') {
      callback(horasOcupadas(iso, barberoId));
      return;
    }

    var url = CFG.disponibilidad.endpoint +
      '?fecha=' + encodeURIComponent(iso) +
      '&barbero=' + encodeURIComponent(barberoId);

    fetch(url, { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (datos) {
        var mapa = {};
        (datos.ocupadas || []).forEach(function (hh) { mapa[hh] = true; });
        callback(mapa);
      })
      .catch(function () {
        // Si la API falla, mostramos todo libre en vez de romper la reserva
        mostrarToast('No pudimos verificar la agenda. Confirmaremos por WhatsApp.');
        callback({});
      });
  }

  function seleccionarHora(hhmm) {
    estado.hora = hhmm;
    sincronizar('hora', hhmm);
    validarPasoActual();
  }

  /* ================================================================
   * PASO 5 — DATOS DEL CLIENTE
   * ============================================================== */

  var VALIDADORES = {
    nombre: function (v) {
      v = v.trim();
      if (!v) return 'Escribe tu nombre completo.';
      if (v.length < 3) return 'El nombre es muy corto.';
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü'´\s.-]+$/.test(v)) return 'Usa solo letras.';
      if (v.split(/\s+/).length < 2) return 'Incluye nombre y apellido.';
      return '';
    },
    whatsapp: function (v) {
      var digitos = v.replace(/\D/g, '');
      if (!digitos) return 'Escribe tu número de WhatsApp.';
      if (digitos.length < 9 || digitos.length > 10) return 'Debe tener entre 9 y 10 dígitos.';
      return '';
    },
    email: function (v) {
      v = v.trim();
      if (!v) return 'Escribe tu correo electrónico.';
      if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v)) return 'Ese correo no parece válido.';
      return '';
    }
  };

  function validarCampo(campo, mostrarError) {
    var input = $('#campo-' + campo);
    if (!input) return true;

    var mensaje = VALIDADORES[campo](input.value);
    var error = $('#error-' + campo);
    var envoltorio = input.closest('.input-prefix');

    if (mostrarError && mensaje) {
      input.setAttribute('aria-invalid', 'true');
      if (envoltorio) envoltorio.setAttribute('data-invalid', 'true');
      if (error) {
        error.innerHTML = C.icono('alerta', 14) + '<span>' + C.esc(mensaje) + '</span>';
        error.classList.add('is-visible');
      }
    } else {
      input.setAttribute('aria-invalid', 'false');
      if (envoltorio) envoltorio.removeAttribute('data-invalid');
      if (error) error.classList.remove('is-visible');
    }
    return !mensaje;
  }

  function validarFormulario(mostrarErrores) {
    var campos = ['nombre', 'whatsapp', 'email'];
    var ok = true;
    campos.forEach(function (c) {
      if (!validarCampo(c, mostrarErrores)) ok = false;
    });
    return ok;
  }

  function leerCliente() {
    estado.cliente = {
      nombre: $('#campo-nombre').value.trim().replace(/\s+/g, ' '),
      whatsapp: $('#campo-whatsapp').value.replace(/\D/g, ''),
      email: $('#campo-email').value.trim()
    };
  }

  /* ================================================================
   * RESUMEN Y CONFIRMACIÓN
   * ============================================================== */

  function pintarResumen() {
    var cont = $('#resumen');
    if (!cont || !estado.servicio || !estado.barbero || !estado.fecha || !estado.hora) return;

    var fin = aHora(aMinutos(estado.hora) + estado.servicio.duracion);

    cont.innerHTML =
      C.filaResumen('tijeras', 'Servicio', estado.servicio.nombre) +
      C.filaResumen('usuario', 'Barbero', estado.barbero.nombre) +
      C.filaResumen('calendario', 'Fecha', fechaLarga(estado.fecha)) +
      C.filaResumen('reloj', 'Hora', estado.hora + ' – ' + fin) +
      C.filaResumen('dinero', 'Total',
        CFG.negocio.moneda + estado.servicio.precio, true);
  }

  function generarCodigo() {
    var letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    for (var i = 0; i < 6; i++) {
      out += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    return 'CV-' + out;
  }

  function mensajeWhatsApp() {
    var fin = aHora(aMinutos(estado.hora) + estado.servicio.duracion);
    return encodeURIComponent(
      '¡Hola ' + CFG.negocio.nombre + '! Quiero confirmar mi reserva:\n\n' +
      '🔖 Código: ' + estado.codigo + '\n' +
      '👤 Nombre: ' + estado.cliente.nombre + '\n' +
      '✂️ Servicio: ' + estado.servicio.nombre + ' (' + C.formatearDuracion(estado.servicio.duracion) + ')\n' +
      '💈 Barbero: ' + estado.barbero.nombre + '\n' +
      '📅 Fecha: ' + fechaLarga(estado.fecha) + '\n' +
      '🕐 Hora: ' + estado.hora + ' – ' + fin + '\n' +
      '💵 Total: ' + CFG.negocio.moneda + estado.servicio.precio + '\n' +
      '📧 Correo: ' + estado.cliente.email + '\n' +
      '📱 WhatsApp: ' + estado.cliente.whatsapp
    );
  }

  function confirmar() {
    if (!validarFormulario(true)) {
      var primerError = $('.input[aria-invalid="true"]');
      if (primerError) primerError.focus();
      return;
    }

    leerCliente();
    estado.codigo = generarCodigo();

    var boton = $('#btn-confirmar');
    if (boton) {
      boton.disabled = true;
      boton.textContent = 'Confirmando…';
    }

    enviarReserva().then(function () {
      pintarConfirmacion();
    }).catch(function () {
      // Aunque falle el envío al servidor, el cliente tiene su resumen
      // y el botón de WhatsApp para cerrar la reserva.
      pintarConfirmacion();
    });
  }

  function enviarReserva() {
    if (CFG.envio.modo !== 'endpoint') return Promise.resolve();

    return fetch(CFG.envio.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo: estado.codigo,
        servicio: estado.servicio.id,
        barbero: estado.barbero.id,
        fecha: estado.fecha,
        hora: estado.hora,
        cliente: estado.cliente
      })
    });
  }

  function pintarConfirmacion() {
    var shell = $('#booking-body');
    var stepper = $('#stepper');
    if (!shell) return;

    if (stepper) stepper.classList.add('hidden');

    var fin = aHora(aMinutos(estado.hora) + estado.servicio.duracion);
    var nombreCorto = estado.cliente.nombre.split(' ')[0];

    shell.innerHTML =
      '<div class="confirm-wrap">' +
        '<div class="confirm-icon">' + C.icono('check', 40) + '</div>' +
        '<h3 class="confirm-title">¡Reserva confirmada!</h3>' +
        '<p class="confirm-text">Gracias, <strong class="text-white">' + C.esc(nombreCorto) +
          '</strong>. Te esperamos en ' + C.esc(CFG.negocio.nombre) +
          '. Recibirás la confirmación por WhatsApp.</p>' +
        '<span class="confirm-code">Código ' + C.esc(estado.codigo) + '</span>' +
        '<div class="summary text-left">' +
          C.filaResumen('usuario', 'Nombre', estado.cliente.nombre) +
          C.filaResumen('tijeras', 'Servicio', estado.servicio.nombre) +
          C.filaResumen('corte', 'Barbero', estado.barbero.nombre) +
          C.filaResumen('calendario', 'Fecha', fechaLarga(estado.fecha)) +
          C.filaResumen('reloj', 'Hora', estado.hora + ' – ' + fin) +
          C.filaResumen('pin', 'Dónde', CFG.negocio.direccion) +
          C.filaResumen('dinero', 'Total', CFG.negocio.moneda + estado.servicio.precio, true) +
        '</div>' +
        '<div class="flex flex-col sm:flex-row gap-3">' +
          '<a class="btn btn-gold btn-block" target="_blank" rel="noopener" ' +
            'href="https://wa.me/' + C.esc(CFG.negocio.whatsapp) + '?text=' + mensajeWhatsApp() + '">' +
            C.icono('whatsapp', 18) + 'Enviar por WhatsApp</a>' +
          '<a class="btn btn-ghost btn-block" data-cv-href="direcciones" target="_blank" rel="noopener" ' +
            'href="' + C.esc(CFG.negocio.mapa.direccionesUrl) + '">' +
            C.icono('pin', 18) + 'Cómo llegar</a>' +
        '</div>' +
        '<button type="button" class="btn btn-sm btn-ghost mt-4" id="btn-otra">Reservar otra cita</button>' +
      '</div>';

    shell.setAttribute('tabindex', '-1');
    shell.focus();
    anunciar('Reserva confirmada para el ' + fechaLarga(estado.fecha) + ' a las ' + estado.hora);
    desplazarAReservas();

    var otra = $('#btn-otra');
    if (otra) otra.addEventListener('click', reiniciar);
  }

  function reiniciar() {
    estado = {
      paso: 1,
      servicio: null,
      barbero: null,
      fecha: null,
      hora: null,
      cliente: { nombre: '', whatsapp: '', email: '' },
      codigo: null
    };
    window.location.reload();
  }

  /* ================================================================
   * WIZARD
   * ============================================================== */

  function irA(paso) {
    paso = Math.min(TOTAL_PASOS, Math.max(1, paso));
    estado.paso = paso;

    $$('.step-panel').forEach(function (panel) {
      panel.classList.toggle('is-active', Number(panel.getAttribute('data-paso')) === paso);
    });

    $$('.step-dot').forEach(function (dot) {
      var n = Number(dot.getAttribute('data-paso'));
      dot.classList.toggle('is-active', n === paso);
      dot.classList.toggle('is-done', n < paso);
      dot.setAttribute('aria-current', n === paso ? 'step' : 'false');
    });

    if (paso === 3) pintarFechas();
    if (paso === 4) pintarTurnos();
    if (paso === 5) pintarResumen();

    var atras = $('#btn-atras');
    if (atras) atras.classList.toggle('hidden', paso === 1);

    validarPasoActual();
    anunciar('Paso ' + paso + ' de ' + TOTAL_PASOS);
  }

  /** ¿Se puede avanzar desde el paso actual? */
  function pasoCompleto() {
    switch (estado.paso) {
      case 1: return !!estado.servicio;
      case 2: return !!estado.barbero;
      case 3: return !!estado.fecha;
      case 4: return !!estado.hora;
      case 5: return validarFormulario(false);
      default: return false;
    }
  }

  function validarPasoActual() {
    var siguiente = $('#btn-siguiente');
    var confirmarBtn = $('#btn-confirmar');
    var listo = pasoCompleto();

    if (siguiente) {
      siguiente.classList.toggle('hidden', estado.paso === TOTAL_PASOS);
      siguiente.disabled = !listo;
    }
    if (confirmarBtn) {
      confirmarBtn.classList.toggle('hidden', estado.paso !== TOTAL_PASOS);
    }
  }

  function siguiente() {
    if (!pasoCompleto()) return;
    irA(estado.paso + 1);
  }

  function atras() {
    irA(estado.paso - 1);
  }

  /* ================================================================
   * UX
   * ============================================================== */

  function desplazarAReservas() {
    var destino = $('#reservar');
    if (!destino) return;
    var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    destino.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
  }

  var temporizadorToast;
  function mostrarToast(mensaje) {
    var toast = $('#toast');
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.add('is-visible');
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3600);
  }

  /** Mensaje para lectores de pantalla. */
  function anunciar(mensaje) {
    var region = $('#anuncios');
    if (region) region.textContent = mensaje;
  }

  function actualizarCTA() {
    var cta = $('#cta-movil-texto');
    if (!cta) return;
    cta.textContent = estado.servicio
      ? 'Reservar · ' + estado.servicio.nombre
      : 'Reservar cita';
  }

  function iniciarNavegacion() {
    var nav = $('#nav');
    var cta = $('#cta-movil');
    var hero = $('#inicio');

    function alHacerScroll() {
      var y = window.scrollY;
      if (nav) nav.classList.toggle('is-scrolled', y > 40);
      if (cta && hero) {
        // La barra fija aparece al salir del hero y se esconde en la reserva
        var reserva = $('#reservar');
        var enReserva = reserva &&
          reserva.getBoundingClientRect().top < window.innerHeight * 0.6 &&
          reserva.getBoundingClientRect().bottom > 0;
        cta.classList.toggle('is-visible', y > hero.offsetHeight * 0.7 && !enReserva);
      }
    }

    var esperando = false;
    window.addEventListener('scroll', function () {
      if (esperando) return;
      esperando = true;
      window.requestAnimationFrame(function () {
        alHacerScroll();
        esperando = false;
      });
    }, { passive: true });

    alHacerScroll();
  }

  function iniciarRevelados() {
    var elementos = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elementos.forEach(function (el) { observador.observe(el); });
  }

  /* ================================================================
   * EVENTOS
   * ============================================================== */

  function iniciarEventos() {
    // Delegación: un único listener para todas las tarjetas y turnos
    document.addEventListener('click', function (e) {
      if (!(e.target instanceof Element)) return;

      var servicio = e.target.closest('[data-servicio]');
      if (servicio) {
        var enWizard = !!servicio.closest('#paso-servicio-grid');
        seleccionarServicio(servicio.getAttribute('data-servicio'), !enWizard);
        return;
      }

      var barbero = e.target.closest('[data-barbero]');
      if (barbero) {
        var barberoEnWizard = !!barbero.closest('#paso-barbero-grid');
        seleccionarBarbero(barbero.getAttribute('data-barbero'), !barberoEnWizard);
        return;
      }

      var fecha = e.target.closest('[data-fecha]');
      if (fecha && !fecha.disabled) {
        seleccionarFecha(fecha.getAttribute('data-fecha'));
        return;
      }

      var hora = e.target.closest('[data-hora]');
      if (hora && !hora.disabled) {
        seleccionarHora(hora.getAttribute('data-hora'));
        return;
      }

      // Enlaces internos con scroll suave
      var ancla = e.target.closest('a[href^="#"]');
      if (ancla) {
        var id = ancla.getAttribute('href');
        if (id.length > 1 && $(id)) {
          e.preventDefault();
          var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          $(id).scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });

    var siguienteBtn = $('#btn-siguiente');
    var atrasBtn = $('#btn-atras');
    var confirmarBtn = $('#btn-confirmar');

    if (siguienteBtn) siguienteBtn.addEventListener('click', siguiente);
    if (atrasBtn) atrasBtn.addEventListener('click', atras);
    if (confirmarBtn) confirmarBtn.addEventListener('click', confirmar);

    // Validación del formulario
    ['nombre', 'whatsapp', 'email'].forEach(function (campo) {
      var input = $('#campo-' + campo);
      if (!input) return;

      input.addEventListener('blur', function () { validarCampo(campo, true); });
      input.addEventListener('input', function () {
        // Mientras escribe solo limpiamos el error; no lo regañamos antes de tiempo
        if (input.getAttribute('aria-invalid') === 'true') validarCampo(campo, true);
        validarPasoActual();
      });
    });

    // Solo dígitos en el WhatsApp
    var tel = $('#campo-whatsapp');
    if (tel) {
      tel.addEventListener('input', function () {
        var limpio = tel.value.replace(/[^\d\s]/g, '');
        if (tel.value !== limpio) tel.value = limpio;
      });
    }

    // Enter dentro del formulario = confirmar
    var form = $('#form-cliente');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        confirmar();
      });
    }
  }

  /* ================================================================
   * ARRANQUE
   * ============================================================== */

  function iniciar() {
    pintarDatosNegocio();
    pintarServicios();
    pintarBarberos();
    pintarHorario();
    iniciarEventos();
    iniciarNavegacion();
    iniciarRevelados();
    irA(1);
    actualizarCTA();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})(window, document);
