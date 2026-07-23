import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bug, AlertTriangle, ShieldCheck, Leaf } from "lucide-react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function Plagas() {
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("sensorData", (data) => setSensor(data));
    return () => socket.disconnect();
  }, []);

  if (!sensor) return <div style={{ padding: "20px" }}>Cargando sensores biológicos...</div>;

  // Lógica dinámica: Las plagas aparecen según el clima del backend
  const riesgoGusano = sensor.temperatura > 30 ? "Alto" : "Bajo";
  const riesgoHongo = sensor.humedad > 80 ? "Alto" : sensor.humedad > 60 ? "Medio" : "Bajo";
  const casosCriticos = (riesgoGusano === "Alto" ? 1 : 0) + (riesgoHongo === "Alto" ? 1 : 0);

  const plagasData = [
    { id: 1, plaga: "Gusano Barrenador", nivel: riesgoGusano, estado: riesgoGusano === "Alto" ? "Crítico" : "Controlado" },
    { id: 2, plaga: "Hongo Roya", nivel: riesgoHongo, estado: riesgoHongo === "Alto" ? "Tratamiento Requerido" : "Monitoreo" },
    { id: 3, plaga: "Pulgón Amarillo", nivel: "Bajo", estado: "Controlado" },
  ];

  return (
    <motion.div className="page-content" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ color: "var(--text-main)", fontSize: "24px", marginBottom: "5px" }}>Control de Plagas</h1>
        <p style={{ color: "var(--text-muted)" }}>Monitoreo fitosanitario en tiempo real basado en clima.</p>
      </div>

      <div className="dashboard-grid">
        <div className="content-card" style={{ padding: "20px", borderRadius: "16px" }}>
          <Bug size={35} color="var(--primary)" />
          <h2 style={{ fontSize: "28px", color: "var(--text-main)", marginTop: "10px" }}>{casosCriticos > 0 ? 3 : 1}</h2>
          <p style={{ color: "var(--text-muted)" }}>Plagas Detectadas</p>
        </div>
        <div className="content-card" style={{ padding: "20px", borderRadius: "16px", borderBottom: casosCriticos > 0 ? "4px solid var(--danger)" : "4px solid var(--success)" }}>
          <AlertTriangle size={35} color={casosCriticos > 0 ? "var(--danger)" : "var(--success)"} />
          <h2 style={{ fontSize: "28px", color: "var(--text-main)", marginTop: "10px" }}>{casosCriticos}</h2>
          <p style={{ color: "var(--text-muted)" }}>Casos Críticos</p>
        </div>
        <div className="content-card" style={{ padding: "20px", borderRadius: "16px" }}>
          <ShieldCheck size={35} color="var(--success)" />
          <h2 style={{ fontSize: "28px", color: "var(--text-main)", marginTop: "10px" }}>{100 - (casosCriticos * 15)}%</h2>
          <p style={{ color: "var(--text-muted)" }}>Control Efectivo</p>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: "20px", padding: "20px", borderRadius: "16px" }}>
        <h2 style={{ color: "var(--text-main)", marginBottom: "15px" }}>Registro de Riesgos Actuales</h2>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr><th>Plaga Amenazante</th><th>Cultivo</th><th>Nivel de Riesgo</th><th>Estado de Acción</th></tr>
            </thead>
            <tbody>
              {plagasData.map((item, index) => (
                <motion.tr key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  <td style={{ color: "var(--text-main)" }}>{item.plaga}</td>
                  <td style={{ color: "var(--text-muted)" }}>Caña de Azúcar</td>
                  <td>
                    <span className={`status ${item.nivel === "Bajo" ? "success" : item.nivel === "Medio" ? "warning" : "danger"}`}>
                      {item.nivel}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-main)" }}>{item.estado}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}