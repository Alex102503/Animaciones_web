import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Gauge, Clock, Waves } from "lucide-react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function Riego() {
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("sensorData", (data) => setSensor(data));
    return () => socket.disconnect();
  }, []);

  if (!sensor) return <div style={{ padding: "20px", color: "var(--text-main)" }}>Cargando datos de la red hídrica...</div>;

  const necesitaRiego = sensor.recomendacionRiego.accion === "regar";
  
  return (
    <motion.div className="page-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ color: "var(--text-main)", fontSize: "24px", marginBottom: "5px" }}>Sistema de Riego</h1>
        <p style={{ color: "var(--text-muted)" }}>Control automatizado basado en sensores de suelo.</p>
      </div>

      <div className="dashboard-grid">
        <div className="content-card" style={{ padding: "20px", borderRadius: "16px", borderBottom: "4px solid var(--info)" }}>
          <Droplets size={30} color="var(--info)" style={{ marginBottom: "10px" }} />
          <h2 style={{ fontSize: "28px", color: "var(--text-main)" }}>{sensor.humedad}%</h2>
          <p style={{ color: "var(--text-muted)" }}>Humedad Promedio</p>
        </div>

        <div className="content-card" style={{ padding: "20px", borderRadius: "16px", borderBottom: `4px solid ${necesitaRiego ? "var(--primary)" : "var(--text-muted)"}` }}>
          <Gauge size={30} color={necesitaRiego ? "var(--primary)" : "var(--text-muted)"} style={{ marginBottom: "10px" }} />
          <h2 style={{ fontSize: "28px", color: "var(--text-main)" }}>{necesitaRiego ? "6" : "0"}</h2>
          <p style={{ color: "var(--text-muted)" }}>Válvulas Activas</p>
        </div>

        <div className="content-card" style={{ padding: "20px", borderRadius: "16px", borderBottom: "4px solid var(--warning)" }}>
          <Clock size={30} color="var(--warning)" style={{ marginBottom: "10px" }} />
          <h2 style={{ fontSize: "20px", color: "var(--text-main)", marginTop: "8px", marginBottom: "6px" }}>
            {sensor.clima === "Lluvioso" ? "Pausado (Lluvia)" : necesitaRiego ? "Ahora" : "Programado"}
          </h2>
          <p style={{ color: "var(--text-muted)" }}>Próximo Riego</p>
        </div>

        <div className="content-card" style={{ padding: "20px", borderRadius: "16px", borderBottom: "4px solid #3b82f6" }}>
          <Waves size={30} color="#3b82f6" style={{ marginBottom: "10px" }} />
          <h2 style={{ fontSize: "28px", color: "var(--text-main)" }}>{sensor.balanceHidrico.riegoTotal * 10} L</h2>
          <p style={{ color: "var(--text-muted)" }}>Consumo Acumulado</p>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: "20px", padding: "20px", borderRadius: "16px" }}>
        <h3 style={{ color: "var(--text-main)", marginBottom: "15px" }}>Diagnóstico de Riego (IA)</h3>
        <div style={{ padding: "15px", background: necesitaRiego ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)", borderRadius: "10px", borderLeft: `4px solid ${necesitaRiego ? "var(--danger)" : "var(--success)"}` }}>
          <strong style={{ color: "var(--text-main)" }}>Recomendación Actual:</strong>
          <p style={{ color: "var(--text-muted)", marginTop: "5px" }}>{sensor.recomendacionRiego.mensaje}</p>
        </div>
      </div>
    </motion.div>
  );
}