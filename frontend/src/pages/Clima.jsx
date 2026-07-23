import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { MdWbSunny, MdCloud, MdWaterDrop } from "react-icons/md";

const SOCKET_URL = "http://localhost:5000";

export default function Clima() {
  const [pronostico, setPronostico] = useState([]);
  const [recomendacion, setRecomendacion] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("sensorData", (data) => {
      setPronostico(data.pronostico || []);
      setRecomendacion(data.recomendacionRiego || null);
    });
    return () => socket.disconnect();
  }, []);

  const getIcon = (clima) => {
    switch (clima) {
      case 'Soleado': return <MdWbSunny size={30} color="#f59e0b" />;
      case 'Nublado': return <MdCloud size={30} color="#9ca3af" />;
      case 'Lluvioso': return <MdWaterDrop size={30} color="#3b82f6" />;
      default: return <MdWbSunny size={30} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Meteorología y Riego</h2>
        <p style={{ color: 'var(--text-muted)' }}>Pronóstico probabilístico y sugerencias del sistema experto.</p>
      </div>

      {recomendacion && (
        <div style={{ 
          background: recomendacion.accion === 'regar' ? '#fee2e2' : recomendacion.accion === 'esperar' ? '#fef3c7' : '#d1fae5',
          borderLeft: `6px solid ${recomendacion.accion === 'regar' ? '#ef4444' : recomendacion.accion === 'esperar' ? '#f59e0b' : '#10b981'}`,
          padding: '20px 25px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span style={{ fontSize: '24px' }}>
            {recomendacion.accion === 'regar' ? '💧' : recomendacion.accion === 'esperar' ? '⏳' : '✅'}
          </span>
          <div>
            <h4 style={{ margin: '0 0 5px 0' }}>Recomendación Inteligente</h4>
            <p style={{ margin: 0, fontSize: '15px' }}>{recomendacion.mensaje}</p>
          </div>
        </div>
      )}

      <h3 style={{ color: 'var(--text-main)', marginBottom: '20px' }}>Pronóstico próximos 5 días</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
        {pronostico.map((dia, index) => (
          <div key={index} style={{ 
            background: 'var(--surface)', 
            padding: '20px', 
            borderRadius: '16px', 
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Día {dia.dia}</span>
            <div style={{ margin: '10px 0', background: 'var(--bg-app)', padding: '15px', borderRadius: '50%' }}>
              {getIcon(dia.climaMasProbable)}
            </div>
            <strong style={{ color: 'var(--text-main)' }}>{dia.climaMasProbable}</strong>
            <span style={{ color: 'var(--info)', fontSize: '14px', fontWeight: '600' }}>
              Prob. Lluvia: {dia.probabilidadLluvia}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}