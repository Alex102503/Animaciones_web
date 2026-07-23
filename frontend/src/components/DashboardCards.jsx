import React from "react";
import { motion } from "framer-motion";
import { MdWaterDrop, MdThermostat, MdEco, MdCloud } from "react-icons/md";

export default function DashboardCards({ humedad, temperatura, calidad, clima }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="dashboard-grid">
      <motion.div variants={itemVariants} className="content-card kpi-card" style={{ padding: '20px', borderRadius: '16px' }}>
        <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Humedad del Suelo</span>
          <div style={{ color: 'var(--primary)', background: 'rgba(82, 183, 136, 0.2)', padding: '8px', borderRadius: '8px' }}>
            <MdWaterDrop size={24} />
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px', color: 'var(--text-main)' }}>{humedad}%</div>
      </motion.div>

      <motion.div variants={itemVariants} className="content-card kpi-card" style={{ padding: '20px', borderRadius: '16px', borderBottom: "4px solid var(--warning)" }}>
        <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Temperatura</span>
          <div style={{ color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.2)', padding: '8px', borderRadius: '8px' }}>
            <MdThermostat size={24} />
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px', color: 'var(--text-main)' }}>{temperatura}°C</div>
      </motion.div>

      <motion.div variants={itemVariants} className="content-card kpi-card" style={{ padding: '20px', borderRadius: '16px', borderBottom: "4px solid var(--success)" }}>
        <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Calidad Estimada</span>
          <div style={{ color: 'var(--success)', background: 'rgba(34, 197, 94, 0.2)', padding: '8px', borderRadius: '8px' }}>
            <MdEco size={24} />
          </div>
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px', color: 'var(--text-main)' }}>{calidad}%</div>
      </motion.div>

      <motion.div variants={itemVariants} className="content-card kpi-card" style={{ padding: '20px', borderRadius: '16px', borderBottom: "4px solid var(--info)" }}>
        <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Clima Actual</span>
          <div style={{ color: 'var(--info)', background: 'rgba(59, 130, 246, 0.2)', padding: '8px', borderRadius: '8px' }}>
            <MdCloud size={24} />
          </div>
        </div>
        <div style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '10px', color: 'var(--text-main)' }}>{clima}</div>
      </motion.div>
    </div>
  );
}