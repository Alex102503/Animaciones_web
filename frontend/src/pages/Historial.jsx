import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { MdHistory, MdWaterDrop, MdWarning, MdCheckCircle, MdCloudySnowing } from "react-icons/md";

const SOCKET_URL = "http://localhost:5000";

export default function Historial() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    // Recibir el historial completo al conectar
    socket.on("historialInicial", (eventos) => {
      setHistorial(eventos);
    });

    // Escuchar nuevos eventos en tiempo real
    socket.on("nuevoEventoHistorial", (evento) => {
      setHistorial((prev) => [evento, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  // Asignar un icono y color dependiendo del tipo de evento
  const getEventStyle = (tipo) => {
    if (tipo.includes("Riego manual") && !tipo.includes("rechazado")) {
      return { icon: <MdWaterDrop />, color: "var(--info)", bg: "#dbeafe" };
    }
    if (tipo.includes("rechazado") || tipo.includes("riesgo")) {
      return { icon: <MdWarning />, color: "var(--danger)", bg: "#fee2e2" };
    }
    if (tipo.includes("Lluvia")) {
      return { icon: <MdCloudySnowing />, color: "var(--primary)", bg: "var(--accent)" };
    }
    return { icon: <MdCheckCircle />, color: "var(--success)", bg: "#d1fae5" };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Registro de Operaciones</h2>
        <p style={{ color: 'var(--text-muted)' }}>Trazabilidad completa de eventos y acciones del usuario.</p>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        
        {/* Cabecera de la tabla/lista */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 3fr 1fr', 
          padding: '20px 30px', 
          background: 'var(--accent)', 
          borderBottom: '1px solid #eee',
          fontWeight: '600',
          color: 'var(--text-main)'
        }}>
          <span>Fecha y Hora</span>
          <span>Descripción del Evento</span>
          <span>Día Simulado</span>
        </div>

        {/* Lista de Eventos */}
        <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '10px 0' }}>
          {historial.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <MdHistory size={50} style={{ opacity: 0.5, marginBottom: '10px' }} />
              <p>No hay eventos registrados aún en esta sesión.</p>
            </div>
          ) : (
            historial.map((evento, index) => {
              const style = getEventStyle(evento.tipo || "");
              
              return (
                <motion.div 
                  key={evento.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 3fr 1fr', 
                    padding: '15px 30px', 
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    alignItems: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-app)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    {evento.fechaHora || new Date().toLocaleTimeString()}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '35px', 
                      height: '35px', 
                      borderRadius: '50%', 
                      background: style.bg, 
                      color: style.color,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}>
                      {style.icon}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{evento.tipo || "Evento del sistema"}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                        Etapa: {evento.etapa || "N/A"}
                      </span>
                    </div>
                  </div>

                  <span style={{ 
                    background: 'var(--accent)', 
                    color: 'var(--primary)', 
                    padding: '5px 12px', 
                    borderRadius: '20px', 
                    fontSize: '13px', 
                    fontWeight: 'bold',
                    justifySelf: 'start'
                  }}>
                    Día {evento.dia}
                  </span>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}