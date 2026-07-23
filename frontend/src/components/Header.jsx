import React from "react";
import { MdMenu, MdDarkMode, MdLightMode } from "react-icons/md";
import { useClock } from "../hooks/useClock";
import { useTheme } from "../hooks/useTheme";
import NotificationBell from "./NotificationBell";

export default function Header({ toggleSidebar }) {
  const { formattedTime, formattedDate } = useClock();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="header-modern">
      <div
        className="header-left"
        style={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        <button
          className="icon-btn"
          onClick={toggleSidebar}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-main)",
            display: "flex",
          }}
        >
          <MdMenu size={26} />
        </button>
        <div className="breadcrumb" style={{ color: "var(--text-muted)" }}>
          <span>Inicio</span>{" "}
          <span className="separator" style={{ margin: "0 8px" }}>
            /
          </span>{" "}
          <strong style={{ color: "var(--text-main)" }}>Dashboard</strong>
        </div>
      </div>

      <div
        className="header-right"
        style={{ display: "flex", alignItems: "center", gap: "20px" }}
      >
        {/* Reloj y Fecha */}
        <div
          className="datetime-widget"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span
            className="date"
            style={{
              textTransform: "capitalize",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            {formattedDate}
          </span>
          <span
            className="time"
            style={{ fontWeight: "bold", color: "var(--text-main)" }}
          >
            {formattedTime}
          </span>
        </div>

        {/* Botón de Tema (Modo Claro / Oscuro) */}
        <button
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-main)",
            display: "flex",
            alignItems: "center",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
          {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>

        {/* Campana de Notificaciones (Corregida sin el span bloqueador) */}
        <NotificationBell />
      </div>
    </header>
  );
}
