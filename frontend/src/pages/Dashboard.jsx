import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WeatherCard from "../components/WeatherCard";
import DashboardCards from "../components/DashboardCards";
import { LineChart, WaterDoughnutChart } from "../components/Charts";
import CropSVG from "../components/CropSVG";

const SOCKET_URL = "http://localhost:5000";

export default function Dashboard() {
  const [dia, setDia] = useState(0);
  const [humedad, setHumedad] = useState(72);
  const [temperatura, setTemperatura] = useState(25);
  const [calidad, setCalidad] = useState(100);
  const [clima, setClima] = useState("Soleado");
  const [etapa, setEtapa] = useState({ id: 0, nombre: "Cargando..." });
  const [cosechado, setCosechado] = useState(false);
  const [historial, setHistorial] = useState([]);

  const socketRef = useRef(null);
  const [isWatering, setIsWatering] = useState(false);
  const [rainDrops, setRainDrops] = useState([]);

  // Generador de gotas de lluvia
  useEffect(() => {
    const drops = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 0.3,
      duration: Math.random() * 0.4 + 0.4,
    }));
    setRainDrops(drops);
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("sensorData", (data) => {
      setDia(data.dia);
      setHumedad(data.humedad);
      setTemperatura(data.temperatura);
      setCalidad(data.calidad);
      setClima(data.clima);
      setEtapa(data.etapa);
      setCosechado(data.cosechado);

      if (data.temperatura > 32) toast.warning("🌡️Temperatura elevada");
      if (data.humedad < 40) toast.error("💧Humedad crítica");
    });

    socket.on("historialInicial", (datos) => setHistorial(datos));
    socket.on("nuevoEventoHistorial", (evento) =>
      setHistorial((prev) => [evento, ...prev].slice(0, 20)),
    );
    socket.on("notificacionCritica", (mensaje) =>
      toast.error(mensaje, { position: "top-right", theme: "colored" }),
    );
    socket.on("cosechaLista", (data) =>
      toast.success(data.mensaje, { position: "top-center", autoClose: false }),
    );

    return () => socket.disconnect();
  }, []);

  const handleWater = () => {
    if (cosechado) return;
    setIsWatering(true); // Inicia la lluvia
    socketRef.current?.emit("regarPlanta");
    toast.info("💧 Regando cultivo...", { autoClose: 2000 });

    // Detiene la lluvia después de 3 segundos
    setTimeout(() => setIsWatering(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="page-content"
    >
      <ToastContainer />

      <div className="dashboard-header" style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "var(--text-main)" }}>Monitoreo en Tiempo Real</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Día de simulación: {dia} | Etapa actual:{" "}
          <strong>{etapa.nombre}</strong>
        </p>
      </div>

      {/* 1. Tarjetas Superiores */}
      <DashboardCards
        humedad={humedad}
        temperatura={temperatura}
        calidad={calidad}
        clima={clima}
      />

      {/* 2. Sección de Gráficos */}
      <div className="charts-container">
        <motion.div
          variants={itemVariants}
          className="content-card"
          style={{ padding: "20px", borderRadius: "16px" }}
        >
          <h3 style={{ marginBottom: "20px", fontSize: "16px" }}>
            Tendencia de Clima y Humedad
          </h3>
          <div style={{ height: "300px" }}>
            <LineChart />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="content-card"
          style={{ padding: "20px", borderRadius: "16px" }}
        >
          <h3 style={{ marginBottom: "20px", fontSize: "16px" }}>
            Balance Hídrico
          </h3>
          <div style={{ height: "300px" }}>
            <WaterDoughnutChart />
          </div>
        </motion.div>
      </div>

      {/* 3. Info Adicional y Estado Visual */}
      <div className="info-grid" style={{ padding: "20px" }}>
        <motion.div
          variants={itemVariants}
          className="content-card"
          style={{ padding: "20px", borderRadius: "16px" }}
        >
          <WeatherCard
            clima={clima}
            temperatura={temperatura}
            humedad={humedad}
            viento={14}
            calidad={calidad}
          />
        </motion.div>

        {/* Tarjeta del Cultivo con Animación de Lluvia */}
        <motion.div
          variants={itemVariants}
          className="content-card"
          style={{
            padding: "20px",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative", // Necesario para que la lluvia no se salga de la tarjeta
            overflow: "hidden", // Corta la lluvia al borde de la tarjeta
          }}
        >
          {/* CAPA DE LLUVIA */}
          <AnimatePresence>
            {isWatering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  zIndex: 5,
                }}
              >
                {rainDrops.map((drop) => (
                  <motion.div
                    key={drop.id}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 300, opacity: [0, 1, 1, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: drop.duration,
                      delay: drop.delay,
                      ease: "linear",
                    }}
                    style={{
                      position: "absolute",
                      left: drop.left,
                      width: "3px",
                      height: "15px",
                      background: "#60a5fa",
                      borderRadius: "10px",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <h3
            style={{
              alignSelf: "flex-start",
              marginBottom: "10px",
              zIndex: 10,
            }}
          >
            Estado Visual
          </h3>
          <div
            style={{ transform: "scale(1.2)", margin: "40px 0", zIndex: 10 }}
          >
            <CropSVG stage={etapa.id} />
          </div>
          <motion.button
            onClick={handleWater}
            disabled={cosechado}
            whileHover={{ scale: cosechado ? 1 : 1.05 }}
            whileTap={{ scale: cosechado ? 1 : 0.95 }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: cosechado ? "#ccc" : "var(--primary)",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: cosechado ? "not-allowed" : "pointer",
              zIndex: 10, // Importante para que el botón se presione por encima de la lluvia
            }}
          >
            {cosechado
              ? "Cosecha Completada"
              : isWatering
                ? "Regando..."
                : "💧 Regar Manualmente"}
          </motion.button>
        </motion.div>
      </div>

      {/* 4. Actividad Reciente */}
      <motion.div
        className="content-card"
        style={{ margin: "20px", padding: "20px", borderRadius: "16px" }}
      >
        <h2 style={{ marginBottom: "15px" }}>Actividad Reciente</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {historial.length === 0 ? (
            <li>No hay actividad registrada.</li>
          ) : (
            historial.slice(0, 5).map((item) => (
              <li
                key={item.id}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(128,128,128,0.2)",
                }}
              >
                <strong>Día {item.dia}</strong> · {item.tipo}{" "}
                {item.mensaje && ` - ${item.mensaje}`}
              </li>
            ))
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
