import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdWaterDrop } from "react-icons/md";
import io from "socket.io-client";
import { toast } from "react-toastify";

const SOCKET_URL = "http://localhost:5000";

const IMAGENES_POR_ETAPA = {
  0: "https://agriculture.basf.com/api/imaging/focalarea/16x9/4096x/dam/jcr%3Afdfecc16-c364-3601-aed6-a90c52db15d5/PY-cana-de-azucar.jpg", // Germinación
  1: "https://bioproi.com/static/uploads/articles/488a2a385e5f5bdc095d5ce833a630ff.png", // Crecimiento
  2: "https://bioproi.com/static/uploads/articles/f2eba1513742041a1f28569c19e63ac6.png", // Maduración
  3: "https://eos.com/wp-content/uploads/2022/11/high-plants-of-sugar-cane.jpg.webp"  // Cosecha
};

export default function Cultivos() {
  const [sensor, setSensor] = useState(null);
  const [isWatering, setIsWatering] = useState(false);
  const [rainDrops, setRainDrops] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const drops = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 0.5,
      duration: Math.random() * 0.4 + 0.4,
    }));
    setRainDrops(drops);
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("sensorData", (data) => {
      setSensor(data);
    });

    return () => socket.disconnect();
  }, []);

  const handleWater = () => {
    if (sensor?.cosechado) return;
    
    setIsWatering(true);
    socketRef.current?.emit("regarPlanta");
    toast.info("💧 Regando cultivo manualmente...", { autoClose: 2000 });

    setTimeout(() => setIsWatering(false), 3000); 
  };

  if (!sensor) return <div style={{ padding: "30px", color: "var(--text-main)" }}>Conectando con el cultivo...</div>;

  const imagenActual = IMAGENES_POR_ETAPA[sensor.etapa.id] || IMAGENES_POR_ETAPA[0];

  return (
    <motion.div className="page-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "var(--text-main)" }}>Gestión del Cultivo</h2>
        <p style={{ color: "var(--text-muted)" }}>Monitoreo visual realista y estado fenológico del cultivo.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "25px" }}>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            borderRadius: "16px", height: "400px", position: "relative",
            overflow: "hidden", boxShadow: "var(--shadow-sm)", background: "#000"
          }}
        >
          <AnimatePresence>
            {isWatering && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: 10
                }}
              >
                {rainDrops.map((drop) => (
                  <motion.div
                    key={drop.id}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 400, opacity: [0, 1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: drop.duration, delay: drop.delay, ease: "linear" }}
                    style={{
                      position: "absolute", left: drop.left, width: "2px", height: "25px",
                      background: "linear-gradient(transparent, #93c5fd)", borderRadius: "10px"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.img
              key={imagenActual} 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.9, scale: isWatering ? 1.05 : 1, filter: isWatering ? "brightness(0.8)" : "brightness(1)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              src={imagenActual} 
              alt={`Cultivo fase ${sensor.etapa.nombre}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
            />
          </AnimatePresence>

          <motion.button
            onClick={handleWater}
            disabled={sensor.cosechado}
            whileHover={{ scale: sensor.cosechado ? 1 : 1.05, backgroundColor: sensor.cosechado ? "#ccc" : "#2563eb" }}
            whileTap={{ scale: sensor.cosechado ? 1 : 0.95 }}
            style={{
              position: "absolute", bottom: "20px", right: "20px", zIndex: 20,
              background: sensor.cosechado ? "#ccc" : "var(--primary)", color: "white", border: "none",
              padding: "15px 25px", borderRadius: "30px", display: "flex",
              alignItems: "center", gap: "10px", cursor: sensor.cosechado ? "not-allowed" : "pointer", fontWeight: "bold",
              boxShadow: "0px 10px 20px rgba(0,0,0,0.5)"
            }}
          >
            <motion.div animate={isWatering ? { y: [0, 5, 0] } : {}} transition={{ repeat: Infinity, duration: 0.3 }}>
              <MdWaterDrop size={24} color={isWatering ? "#93c5fd" : "white"} />
            </motion.div>
            {sensor.cosechado ? "Cosecha Completada" : (isWatering ? "Regando..." : "Regar Manualmente")}
          </motion.button>
        </motion.div>

        <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(128,128,128,0.1)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ color: "var(--text-main)", marginBottom: "20px" }}>Detalles de la Etapa Actual</h3>
          
          <strong style={{ color: "var(--primary)", display: "block", fontSize: "20px" }}>
            {sensor.etapa.icono} Fase: {sensor.etapa.nombre}
          </strong>
          
          {/* El texto cambia automáticamente porque lee sensor.etapa.descripcion */}
          <motion.p 
            key={sensor.etapa.id} // Anima el texto cuando cambia de etapa
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            style={{ color: "var(--text-muted)", marginTop: "15px", lineHeight: "1.6", flexGrow: 1 }}
          >
            {sensor.etapa.descripcion}
          </motion.p>
          
          <div style={{ background: "rgba(128,128,128,0.1)", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <span style={{ color: "var(--text-main)" }}>Humedad Actual</span>
            <span style={{ color: sensor.humedad < sensor.etapa.humedadOptima.min ? "var(--danger)" : "var(--info)", fontWeight: "bold", fontSize: "18px" }}>
              {Math.round(sensor.humedad)}%
            </span>
          </div>

          <div style={{ marginTop: "15px", padding: "15px", background: "rgba(245, 158, 11, 0.1)", borderLeft: "4px solid var(--warning)", borderRadius: "0 10px 10px 0" }}>
            <span style={{ color: "var(--warning)", fontSize: "14px", fontWeight: "bold" }}>
              ⚠️ Rango óptimo sugerido: {sensor.etapa.humedadOptima.min}% - {sensor.etapa.humedadOptima.max}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}