import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const notifications = [
    { id: 1, title: "Temperatura elevada", message: "Parcela Norte alcanzó 33°C.", time: "Hace 2 min", color: "#ef4444" },
    { id: 2, title: "Riego automático", message: "Sistema activado correctamente.", time: "Hace 7 min", color: "#22c55e" },
    { id: 3, title: "Sensor conectado", message: "Sensor de humedad operativo.", time: "Hace 12 min", color: "#3b82f6" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent", border: "none", cursor: "pointer", 
          position: "relative", color: "var(--text-main)", display: "flex", alignItems: "center"
        }}
      >
        <Bell size={24} />
        <span style={{
          position: "absolute", top: "-6px", right: "-6px", background: "var(--danger)",
          color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "11px", fontWeight: "bold"
        }}>
          {notifications.length}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.4 }}
            style={{
              position: "absolute", top: "40px", right: "0", width: "320px",
              background: "var(--surface)", // ← ESTO ARREGLA EL FONDO
              border: "1px solid rgba(128,128,128,0.2)",
              borderRadius: "12px", padding: "15px", zIndex: 1000,
              boxShadow: "0px 10px 30px rgba(0,0,0,0.5)"
            }}
          >
            <div style={{ borderBottom: "1px solid rgba(128,128,128,0.2)", paddingBottom: "10px", marginBottom: "10px" }}>
              <h3 style={{ color: "var(--text-main)", margin: 0, fontSize: "16px" }}>Notificaciones</h3>
            </div>

            {notifications.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 5, backgroundColor: "rgba(128,128,128,0.1)" }}
                style={{ display: "flex", gap: "12px", padding: "10px", borderRadius: "8px", cursor: "pointer" }}
              >
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, marginTop: "6px", flexShrink: 0 }} />
                <div>
                  {/* ← ESTOS COLORES ARREGLAN EL TEXTO INVISIBLE */}
                  <strong style={{ color: "var(--text-main)", display: "block", fontSize: "14px" }}>{item.title}</strong>
                  <p style={{ color: "var(--text-muted)", margin: "4px 0", fontSize: "13px" }}>{item.message}</p>
                  <small style={{ color: "var(--text-muted)", fontSize: "11px" }}>{item.time}</small>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}