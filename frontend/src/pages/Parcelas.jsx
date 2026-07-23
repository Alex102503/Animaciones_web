import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPinned, Sprout, Droplets, Activity } from "lucide-react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function Parcelas() {
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("sensorData", (data) => setSensor(data));
    return () => socket.disconnect();
  }, []);

  if (!sensor) return <div style={{ padding: "20px" }}>Cargando estado de parcelas...</div>;

  // Hacemos que la tabla reaccione a la humedad real del backend
  const humedadReal = Math.round(sensor.humedad);
  
  const parcelasDinámicas = [
    { id: 1, nombre: "Parcela Norte (Principal)", cultivo: "Caña de Azúcar", hectareas: 12, humedad: humedadReal, estado: humedadReal > 40 && humedadReal < 80 ? "Óptimo" : "Crítico" },
    { id: 2, nombre: "Parcela Sur", cultivo: "Caña de Azúcar", hectareas: 8, humedad: Math.max(0, humedadReal - 12), estado: "Monitoreo" },
    { id: 3, nombre: "Parcela Este", cultivo: "Caña de Azúcar", hectareas: 15, humedad: Math.min(100, humedadReal + 8), estado: "Óptimo" },
  ];

  return (
    <motion.div className="page-content" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ color: "var(--text-main)", fontSize: "24px", marginBottom: "5px" }}>Gestión de Parcelas</h1>
        <p style={{ color: "var(--text-muted)" }}>Visualización sectorizada sincronizada con el servidor.</p>
      </div>

      <div className="dashboard-grid">
        <div className="content-card" style={{ padding: "20px", borderRadius: "16px" }}>
          <MapPinned size={35} color="var(--primary)" />
          <h2 style={{ fontSize: "28px", color: "var(--text-main)", marginTop: "10px" }}>3</h2>
          <p style={{ color: "var(--text-muted)" }}>Sectores Activos</p>
        </div>
        <div className="content-card" style={{ padding: "20px", borderRadius: "16px" }}>
          <Droplets size={35} color="var(--info)" />
          <h2 style={{ fontSize: "28px", color: "var(--text-main)", marginTop: "10px" }}>{humedadReal}%</h2>
          <p style={{ color: "var(--text-muted)" }}>Humedad Promedio</p>
        </div>
        <div className="content-card" style={{ padding: "20px", borderRadius: "16px" }}>
          <Activity size={35} color="var(--success)" />
          <h2 style={{ fontSize: "28px", color: "var(--text-main)", marginTop: "10px" }}>100%</h2>
          <p style={{ color: "var(--text-muted)" }}>Sensores Operativos</p>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: "20px", padding: "20px", borderRadius: "16px" }}>
        <h2 style={{ color: "var(--text-main)", marginBottom: "15px" }}>Listado de Parcelas</h2>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr><th>Parcela</th><th>Cultivo</th><th>Hectáreas</th><th>Humedad Actual</th><th>Estado de Tierra</th></tr>
            </thead>
            <tbody>
              {parcelasDinámicas.map((item, index) => (
                <motion.tr key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  <td style={{ color: "var(--text-main)" }}>{item.nombre}</td>
                  <td style={{ color: "var(--text-muted)" }}>{item.cultivo}</td>
                  <td style={{ color: "var(--text-main)" }}>{item.hectareas} ha</td>
                  <td style={{ fontWeight: "bold", color: item.humedad < 40 ? "var(--danger)" : "var(--info)" }}>
                    {item.humedad}%
                  </td>
                  <td>
                    <span className={`status ${item.estado === "Óptimo" ? "success" : item.estado === "Monitoreo" ? "warning" : "danger"}`}>
                      {item.estado}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}