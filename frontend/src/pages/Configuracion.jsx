import React from "react";
import { motion } from "framer-motion";
import { MdSettings, MdNotifications, MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../hooks/useTheme";

export default function Configuracion() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Configuración del Sistema</h2>
        <p style={{ color: 'var(--text-muted)' }}>Ajustes generales de la plataforma y preferencias de usuario.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        
        {/* Tarjeta de Apariencia */}
        <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <MdSettings size={24} color="var(--primary)" />
            <h3 style={{ color: 'var(--text-main)', fontSize: '18px' }}>Apariencia</h3>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>Modo Oscuro</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Cambia el tema visual del sistema</span>
            </div>
            <button 
              onClick={toggleTheme}
              style={{
                background: isDarkMode ? 'var(--accent)' : 'var(--primary)',
                color: isDarkMode ? 'var(--primary)' : 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: '0.3s'
              }}
            >
              {isDarkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
              {isDarkMode ? 'Activar Claro' : 'Activar Oscuro'}
            </button>
          </div>
        </div>

        {/* Tarjeta de Notificaciones */}
        <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <MdNotifications size={24} color="var(--primary)" />
            <h3 style={{ color: 'var(--text-main)', fontSize: '18px' }}>Alertas y Notificaciones</h3>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>Alertas Críticas</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Humedad baja o riesgos de calidad</span>
            </div>
            <input type="checkbox" defaultChecked style={{ transform: 'scale(1.5)', accentColor: 'var(--primary)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
            <div>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>Sugerencias de Riego</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Recomendaciones basadas en clima</span>
            </div>
            <input type="checkbox" defaultChecked style={{ transform: 'scale(1.5)', accentColor: 'var(--primary)' }} />
          </div>
        </div>

      </div>
    </motion.div>
  );
}