import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: "right", color: "var(--text-muted)" }}
    >
      <div style={{ fontSize: "13px", textTransform: "capitalize" }}>
        {formatDate(time)}
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "var(--primary)",
        }}
      >
        {time.toLocaleTimeString("es-ES")}
      </div>
    </motion.div>
  );
}
