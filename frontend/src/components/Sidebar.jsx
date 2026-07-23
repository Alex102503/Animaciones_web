import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdGrass,
  MdWaterDrop,
  MdHistory,
  MdSettings,
  MdMap,
  MdBugReport,
  MdAgriculture,
  MdOpacity,
} from "react-icons/md";

export default function Sidebar({ isOpen }) {
  const menuItems = [
    { path: "/", name: "Dashboard", icon: <MdDashboard size={24} /> },
    { path: "/cultivos", name: "Cultivo", icon: <MdGrass size={24} /> },
    { path: "/parcelas", name: "Parcelas", icon: <MdMap size={22} /> },
    { path: "/plagas", name: "Control de Plagas", icon: <MdBugReport size={22} /> },
    { path: "/produccion", name: "Producción", icon: <MdAgriculture size={22} /> },
    { path: "/riego", name: "Gestión de Riego", icon: <MdOpacity size={22} /> },
    { path: "/clima", name: "Clima y Riego", icon: <MdWaterDrop size={24} /> },
    { path: "/historial", name: "Historial", icon: <MdHistory size={24} /> },
    { path: "/configuracion", name: "Configuración", icon: <MdSettings size={24} /> },
  ];

  return (
    <motion.aside
      className="sidebar-modern"
      initial={{ width: 250 }}
      animate={{ width: isOpen ? 250 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ overflow: "hidden" }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "20px", gap: "15px" }}>
        <motion.img 
          src="https://images.unsplash.com/photo-1586315776885-a176ffccbe01" 
          alt="Logo" 
          style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
        />
        <AnimatePresence>
          {isOpen && (
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ color: "var(--primary)", margin: 0, whiteSpace: "nowrap", fontSize: "20px" }}
            >
              AgroVision
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "active-link nav-item" : "nav-item")}
            title={item.name}
            style={{ textDecoration: "none" }}
          >
            <div className="menu-icon">{item.icon}</div>
            {isOpen && <span className="menu-text" style={{ whiteSpace: "nowrap" }}>{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </motion.aside>
  );
}