const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  // Agregamos esto para que tolere cuando Brave congela la pestaña en segundo plano
  pingTimeout: 60000, 
  pingInterval: 25000 
});

// Ciclo completo del cultivo de caña de azúcar: 12 a 14 meses (~365 a 420 días)
// Fuente: costa norte del Perú (zona Paiján), variedades comerciales.

const CONFIG = {
  // Cuántos milisegundos reales equivalen a 1 día simulado de cultivo.
  // 1000 ms = 1 día -> el ciclo completo (365 días) se ve en ~6 minutos de demo.
  MS_POR_DIA_SIMULADO: 2000,

  DURACION_TOTAL_DIAS: 390, // día en que la caña está lista para cosecha

  // Etapas fenológicas reales del cultivo
  ETAPAS: [
    {
      id: 0,
      nombre: "Germinación",
      icono: "🌱",
      diaInicio: 0,
      diaFin: 30,
      humedadOptima: { min: 70, max: 80 },
      consumoDiario: 1.5, // % de humedad que la planta consume por día
      descripcion:
        "Brotan las yemas de los esquejes y emergen los primeros tallos. Requiere riego frecuente para asegurar el brote.",
    },
    {
      id: 1,
      nombre: "Crecimiento y Amacollamiento",
      icono: "🌿",
      diaInicio: 30,
      diaFin: 120,
      humedadOptima: { min: 60, max: 80 },
      consumoDiario: 2.5, // etapa de mayor demanda hídrica
      descripcion:
        "La planta desarrolla raíces, tallos secundarios (hijuelos) y follaje. Es la etapa de mayor necesidad de agua.",
    },
    {
      id: 2,
      nombre: "Maduración",
      icono: "🎋",
      diaInicio: 120,
      diaFin: 365,
      humedadOptima: { min: 40, max: 50 }, // ¡ojo! menos agua = más sacarosa
      consumoDiario: 1.0,
      descripcion:
        "El crecimiento se frena y la planta concentra azúcar (sacarosa) en los tallos. El exceso de riego aquí DILUYE el azúcar y baja la calidad del lote.",
    },
    {
      id: 3,
      nombre: "Lista para Cosecha",
      icono: "✅",
      diaInicio: 365,
      diaFin: Infinity,
      humedadOptima: { min: 30, max: 45 },
      consumoDiario: 0.5,
      descripcion:
        "Nivel óptimo de sacarosa alcanzado. El lote está listo para ser cosechado y vendido.",
    },
  ],

  // Distribución "de referencia" del clima (se usa solo para elegir el clima
  // inicial del día 0, ya que todavía no hay un día anterior del cual partir).
  CLIMA_PROBABILIDADES_INICIAL: {
    Soleado: 0.55,
    Nublado: 0.3,
    Lluvioso: 0.15,
  },

  TRANSICION_CLIMA: {
    Soleado: { Soleado: 0.72, Nublado: 0.23, Lluvioso: 0.05 },
    Nublado: { Soleado: 0.35, Nublado: 0.4, Lluvioso: 0.25 },
    Lluvioso: { Soleado: 0.1, Nublado: 0.3, Lluvioso: 0.6 },
  },

  // Cuánta humedad extra consume/aporta cada clima
  CLIMA_EFECTO: {
    Soleado: -1.5, 
    Nublado: 0,
    Lluvioso: 18, // la lluvia riega sola
  },

  AGUA_POR_RIEGO_MANUAL: 15, // % de humedad que sube un riego manual
  MAX_HISTORIAL: 100, // eventos guardados en memoria
  DIAS_PRONOSTICO: 5, // cuántos días a futuro se pronostican
};

let estadoCultivo = {
  dia: 0,
  humedad: 72,
  temperatura: 25,
  calidad: 100, // % estimado de calidad / sacarosa
  clima: elegirEstadoInicial(),
  estado: "Saludable",
  cosechado: false,

  aguaLluviaAcumulada: 0,
  aguaRiegoAcumulada: 0,
  aguaLluviaEtapaActual: 0,
  aguaRiegoEtapaActual: 0,
};

let historial = [];

function elegirEstadoInicial() {
  return elegirEstado(CONFIG.CLIMA_PROBABILIDADES_INICIAL);
}

function obtenerEtapaActual(dia) {
  return (
    CONFIG.ETAPAS.find((e) => dia >= e.diaInicio && dia < e.diaFin) ||
    CONFIG.ETAPAS[CONFIG.ETAPAS.length - 1]
  );
}

// Elige un estado al azar dado un objeto { estado: probabilidad, ... }.
// Función genérica: sirve tanto para la distribución inicial como para
// cualquier fila de la matriz de transición.
function elegirEstado(probabilidades) {
  const r = Math.random();
  let acumulado = 0;
  for (const [estado, prob] of Object.entries(probabilidades)) {
    acumulado += prob;
    if (r <= acumulado) return estado;
  }
  const estados = Object.keys(probabilidades);
  return estados[estados.length - 1];
}

// Dado el clima de HOY, sortea el clima de MAÑANA usando la fila
// correspondiente de la cadena de Markov (CONFIG.TRANSICION_CLIMA).
function calcularSiguienteClima(climaActual) {
  const fila =
    CONFIG.TRANSICION_CLIMA[climaActual] || CONFIG.TRANSICION_CLIMA.Soleado;
  return elegirEstado(fila);
}

// No "adivinamos" el futuro real (el motor sigue siendo estocástico día a
// día). En cambio, propagamos la distribución de probabilidad actual a
// través de la matriz de transición, tal como hace un pronóstico
// meteorológico real: te da porcentajes, no certezas.
function generarPronostico(diasAdelante = CONFIG.DIAS_PRONOSTICO) {
  const estados = Object.keys(CONFIG.TRANSICION_CLIMA);

  // Hoy conocemos el clima con certeza total (100% en el estado actual).
  let distribucion = {};
  estados.forEach((e) => (distribucion[e] = e === estadoCultivo.clima ? 1 : 0));

  const pronostico = [];
  for (let i = 1; i <= diasAdelante; i++) {
    const nuevaDistribucion = {};
    estados.forEach((e) => (nuevaDistribucion[e] = 0));

    for (const [estadoActual, prob] of Object.entries(distribucion)) {
      if (prob === 0) continue;
      const fila = CONFIG.TRANSICION_CLIMA[estadoActual];
      for (const [estadoSiguiente, probTransicion] of Object.entries(fila)) {
        nuevaDistribucion[estadoSiguiente] += prob * probTransicion;
      }
    }
    distribucion = nuevaDistribucion;

    const climaMasProbable = estados.reduce((a, b) =>
      distribucion[a] >= distribucion[b] ? a : b,
    );

    // Efecto esperado en humedad ese día = promedio ponderado por probabilidad
    // del efecto de cada clima posible.
    const efectoHumedadEsperado = estados.reduce(
      (acc, e) => acc + distribucion[e] * CONFIG.CLIMA_EFECTO[e],
      0,
    );

    pronostico.push({
      diaRelativo: i,
      dia: estadoCultivo.dia + i,
      climaMasProbable,
      probabilidades: {
        Soleado: Math.round(distribucion.Soleado * 100),
        Nublado: Math.round(distribucion.Nublado * 100),
        Lluvioso: Math.round(distribucion.Lluvioso * 100),
      },
      probabilidadLluvia: Math.round(distribucion.Lluvioso * 100),
      efectoHumedadEsperado: Math.round(efectoHumedadEsperado * 10) / 10,
    });
  }
  return pronostico;
}

function generarRecomendacionRiego(etapa, pronostico) {
  const { min, max } = etapa.humedadOptima;
  const humedad = estadoCultivo.humedad;
  const proximos2 = pronostico.slice(0, 2);
  const probLluviaProxima =
    proximos2.length > 0
      ? Math.max(...proximos2.map((p) => p.probabilidadLluvia))
      : 0;

  if (humedad > max) {
    if (etapa.id === 2) {
      return {
        accion: "no_regar",
        urgencia: "alta",
        mensaje: `Humedad por encima del óptimo (${Math.round(
          humedad,
        )}% vs ${max}% máx). Estás en Maduración: regar ahora diluiría la sacarosa. No riegues.`,
      };
    }
    return {
      accion: "no_regar",
      urgencia: "media",
      mensaje: `Humedad por encima del óptimo (${Math.round(
        humedad,
      )}% vs ${max}% máx). No es necesario regar.`,
    };
  }

  if (humedad < min) {
    if (probLluviaProxima >= 50) {
      return {
        accion: "esperar",
        urgencia: "baja",
        mensaje: `Humedad baja (${Math.round(
          humedad,
        )}%), pero el pronóstico indica ${probLluviaProxima}% de probabilidad de lluvia en los próximos 2 días. Puedes esperar antes de regar manualmente.`,
      };
    }
    return {
      accion: "regar",
      urgencia: "alta",
      mensaje: `Humedad baja (${Math.round(
        humedad,
      )}%) y no se espera lluvia significativa pronto (${probLluviaProxima}% en 2 días). Se recomienda regar ahora.`,
    };
  }

  return {
    accion: "no_regar",
    urgencia: "ninguna",
    mensaje: `Humedad dentro del rango óptimo de ${etapa.nombre} (${min}%-${max}%). No es necesario regar.`,
  };
}

function calcularClimaAleatorio() {
  // Se mantiene por compatibilidad, pero ya no se usa en el tick principal:
  // ahora el clima de cada día depende del clima anterior (ver calcularSiguienteClima).
  return elegirEstado(CONFIG.CLIMA_PROBABILIDADES_INICIAL);
}

function registrarEvento(evento) {
  const entrada = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fechaHora: new Date().toLocaleTimeString(),
    dia: estadoCultivo.dia,
    ...evento,
  };
  historial.unshift(entrada);
  if (historial.length > CONFIG.MAX_HISTORIAL) historial.pop();
  io.emit("nuevoEventoHistorial", entrada);
  return entrada;
}

function construirPayloadSensor() {
  const etapa = obtenerEtapaActual(estadoCultivo.dia);
  const duracionEtapa =
    etapa.diaFin === Infinity ? 1 : etapa.diaFin - etapa.diaInicio;
  const progresoEtapa = Math.min(
    100,
    Math.round(((estadoCultivo.dia - etapa.diaInicio) / duracionEtapa) * 100),
  );
  const progresoTotal = Math.min(
    100,
    Math.round((estadoCultivo.dia / CONFIG.DURACION_TOTAL_DIAS) * 100),
  );

  const pronostico = generarPronostico();
  const recomendacionRiego = generarRecomendacionRiego(etapa, pronostico);

  return {
    dia: estadoCultivo.dia,
    humedad: Math.round(estadoCultivo.humedad),
    temperatura: estadoCultivo.temperatura,
    calidad: Math.round(estadoCultivo.calidad),
    clima: estadoCultivo.clima,
    estado: estadoCultivo.estado,
    cosechado: estadoCultivo.cosechado,
    etapa: {
      id: etapa.id,
      nombre: etapa.nombre,
      icono: etapa.icono,
      descripcion: etapa.descripcion,
      humedadOptima: etapa.humedadOptima,
      progresoEtapa,
    },
    progresoTotal,
    diasParaCosecha: Math.max(
      0,
      CONFIG.DURACION_TOTAL_DIAS - estadoCultivo.dia,
    ),
    pronostico,
    recomendacionRiego,
    balanceHidrico: {
      lluviaTotal: Math.round(estadoCultivo.aguaLluviaAcumulada),
      riegoTotal: Math.round(estadoCultivo.aguaRiegoAcumulada),
      lluviaEtapaActual: Math.round(estadoCultivo.aguaLluviaEtapaActual),
      riegoEtapaActual: Math.round(estadoCultivo.aguaRiegoEtapaActual),
    },
  };
}

function aplicarPenalizacionCalidad(etapa) {
  const { min, max } = etapa.humedadOptima;
  if (estadoCultivo.humedad >= min && estadoCultivo.humedad <= max) return;

  const desviacion =
    estadoCultivo.humedad > max
      ? estadoCultivo.humedad - max
      : min - estadoCultivo.humedad;

  // En maduración (etapa 2), el exceso de agua diluye la sacarosa: penaliza más fuerte
  const factorEtapa = etapa.id === 2 && estadoCultivo.humedad > max ? 3 : 1;
  const penalizacion = Math.min(2, (desviacion / 10) * factorEtapa);

  estadoCultivo.calidad = Math.max(0, estadoCultivo.calidad - penalizacion);
}

function evaluarResultadoCosecha() {
  if (estadoCultivo.calidad >= 80) {
    return {
      resultado: "Premium",
      mensaje:
        "🌟 ¡Caña Premium! Alta concentración de sacarosa, lista para venta al mejor precio.",
    };
  }
  if (estadoCultivo.calidad >= 50) {
    return {
      resultado: "Estándar",
      mensaje: "✅ Caña de calidad Estándar, apta para venta.",
    };
  }
  return {
    resultado: "Rechazado",
    mensaje:
      "⚠️ Lote de baja calidad. El exceso de riego diluyó la sacarosa y el cultivo no cumple el estándar de venta.",
  };
}

setInterval(() => {
  if (estadoCultivo.cosechado) return;

  const etapaAnterior = obtenerEtapaActual(estadoCultivo.dia);

  estadoCultivo.dia += 1;
  // El clima de hoy depende del clima de AYER (cadena de Markov con persistencia).
  estadoCultivo.clima = calcularSiguienteClima(estadoCultivo.clima);

  const etapa = obtenerEtapaActual(estadoCultivo.dia);

  // Consumo natural de la planta + efecto del clima del día
  const efectoClima = CONFIG.CLIMA_EFECTO[estadoCultivo.clima];
  estadoCultivo.humedad = Math.max(
    0,
    Math.min(100, estadoCultivo.humedad - etapa.consumoDiario + efectoClima),
  );

  // Temperatura varía ligeramente (rango realista costa norte 18°C-34°C)
  const variacionTemp = Math.floor(Math.random() * 5) - 2;
  estadoCultivo.temperatura = Math.max(
    18,
    Math.min(34, estadoCultivo.temperatura + variacionTemp),
  );

  aplicarPenalizacionCalidad(etapa);

  // Si la lluvia regó sola, se registra en el historial y se suma al balance hídrico
  if (estadoCultivo.clima === "Lluvioso") {
    estadoCultivo.aguaLluviaAcumulada += CONFIG.CLIMA_EFECTO.Lluvioso;
    estadoCultivo.aguaLluviaEtapaActual += CONFIG.CLIMA_EFECTO.Lluvioso;

    registrarEvento({
      tipo: "Lluvia natural",
      etapa: etapa.nombre,
      humedadResultante: Math.round(estadoCultivo.humedad),
      dentroDeRango:
        estadoCultivo.humedad >= etapa.humedadOptima.min &&
        estadoCultivo.humedad <= etapa.humedadOptima.max,
    });
  }

  // Notificar cambio de etapa
  if (etapa.id !== etapaAnterior.id) {
    estadoCultivo.estado = `Entrando a ${etapa.nombre}`;
    // El balance hídrico "de la etapa" arranca de nuevo en cada etapa
    estadoCultivo.aguaLluviaEtapaActual = 0;
    estadoCultivo.aguaRiegoEtapaActual = 0;

    registrarEvento({
      tipo: "Cambio de etapa",
      etapa: etapa.nombre,
      mensaje: `${etapa.icono} El cultivo avanzó a la etapa: ${etapa.nombre}`,
    });
  } else {
    estadoCultivo.estado =
      estadoCultivo.calidad >= 70 ? "Saludable" : "En riesgo de calidad";
  }

  // Cosecha alcanzada
  if (
    estadoCultivo.dia >= CONFIG.DURACION_TOTAL_DIAS &&
    !estadoCultivo.cosechado
  ) {
    estadoCultivo.cosechado = true;
    const resultado = evaluarResultadoCosecha();
    estadoCultivo.estado = `Cosecha: ${resultado.resultado}`;
    registrarEvento({
      tipo: "Cosecha",
      etapa: etapa.nombre,
      calidadFinal: Math.round(estadoCultivo.calidad),
      ...resultado,
    });
    io.emit("cosechaLista", {
      calidadFinal: Math.round(estadoCultivo.calidad),
      ...resultado,
    });
  }

  io.emit("sensorData", construirPayloadSensor());

  console.log(
    `📅 Día ${estadoCultivo.dia} | ${etapa.icono} ${etapa.nombre} | Humedad: ${Math.round(estadoCultivo.humedad)}% | Clima: ${estadoCultivo.clima} | Calidad: ${Math.round(estadoCultivo.calidad)}%`,
  );
}, CONFIG.MS_POR_DIA_SIMULADO);

io.on("connection", (socket) => {
  // 🔇 COMENTADO: console.log("👨‍🌾 Nuevo supervisor conectado:", socket.id);

  socket.emit("sensorData", construirPayloadSensor());
  socket.emit("historialInicial", historial);

  socket.on("regarPlanta", () => {
    const etapa = obtenerEtapaActual(estadoCultivo.dia);
    const humedadAntes = Math.round(estadoCultivo.humedad);

    // Riego innecesario: suelo ya saturado
    if (estadoCultivo.humedad >= 95) {
      estadoCultivo.estado = "Riesgo de exceso de riego";
      socket.emit(
        "notificacionCritica",
        "⛔ El suelo ya está saturado. Regar ahora puede dañar la raíz y diluir el azúcar.",
      );
      registrarEvento({
        tipo: "Riego manual rechazado",
        etapa: etapa.nombre,
        humedadAntes,
        humedadDespues: humedadAntes,
        dentroDeRango: false,
      });
      io.emit("sensorData", construirPayloadSensor());
      return;
    }

    estadoCultivo.humedad = Math.min(
      100,
      estadoCultivo.humedad + CONFIG.AGUA_POR_RIEGO_MANUAL,
    );

    // Registrar el aporte de agua del riego manual en el balance hídrico
    estadoCultivo.aguaRiegoAcumulada += CONFIG.AGUA_POR_RIEGO_MANUAL;
    estadoCultivo.aguaRiegoEtapaActual += CONFIG.AGUA_POR_RIEGO_MANUAL;

    aplicarPenalizacionCalidad(etapa);

    const dentroDeRango =
      estadoCultivo.humedad >= etapa.humedadOptima.min &&
      estadoCultivo.humedad <= etapa.humedadOptima.max;

    // Advertencia especial: regar de más durante maduración
    if (etapa.id === 2 && estadoCultivo.humedad > etapa.humedadOptima.max) {
      socket.emit(
        "notificacionCritica",
        "⚠️ Estás en etapa de Maduración: el exceso de agua diluye la sacarosa y baja la calidad del lote.",
      );
    }

    estadoCultivo.estado = dentroDeRango
      ? "Muy saludable"
      : "Humedad fuera de rango óptimo";

    registrarEvento({
      tipo: "Riego manual",
      etapa: etapa.nombre,
      humedadAntes,
      humedadDespues: Math.round(estadoCultivo.humedad),
      dentroDeRango,
    });

    io.emit("sensorData", construirPayloadSensor());
  });

  socket.on("disconnect", () => {
    // 🔇 COMENTADO: console.log("❌ Supervisor desconectado:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(
    `🌾 Simulación: 1 día de cultivo cada ${CONFIG.MS_POR_DIA_SIMULADO}ms | Ciclo total: ${CONFIG.DURACION_TOTAL_DIAS} días`,
  );
});