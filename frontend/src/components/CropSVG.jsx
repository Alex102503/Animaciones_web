import React from "react";
import { motion } from "framer-motion";

// ==========================================
// CONFIGURACIÓN DE FASES (Basado en la agronomía de la Caña)
// ==========================================
const STAGE_CONFIG = {
  0: {
    // Germinación / Siembra del Esqueje
    esquejeOpacity: 1,
    mainStalk: { scale: 0.1, color: "#a3e635" },
    mainLeaves: { scale: 0.2, y: 285, color: "#a3e635" },
    lowLeaves: { scale: 0, y: 295, color: "#a3e635" },
    hijueloL: { scale: 0, color: "#a3e635" },
    hijueloR: { scale: 0, color: "#a3e635" },
    hijueloLLeaves: { scale: 0, y: 295, color: "#a3e635" },
    hijueloRLeaves: { scale: 0, y: 295, color: "#a3e635" },
  },
  1: {
    // Formación de brotes y Crecimiento
    esquejeOpacity: 0,
    mainStalk: { scale: 0.5, color: "#4ade80" },
    mainLeaves: { scale: 0.55, y: 210, color: "#4ade80" },
    lowLeaves: { scale: 0.4, y: 255, color: "#22c55e" },
    hijueloL: { scale: 0, color: "#4ade80" },
    hijueloR: { scale: 0, color: "#4ade80" },
    hijueloLLeaves: { scale: 0, y: 295, color: "#4ade80" },
    hijueloRLeaves: { scale: 0, y: 295, color: "#4ade80" },
  },
  2: {
    // Formación de Hijuelos / Maduración
    esquejeOpacity: 0,
    mainStalk: { scale: 0.85, color: "#22c55e" },
    mainLeaves: { scale: 0.85, y: 140, color: "#22c55e" },
    lowLeaves: { scale: 0.6, y: 205, color: "#16a34a" },
    hijueloL: { scale: 0.5, color: "#4ade80" },
    hijueloR: { scale: 0.6, color: "#4ade80" },
    hijueloLLeaves: { scale: 0.45, y: 225, color: "#4ade80" },
    hijueloRLeaves: { scale: 0.55, y: 200, color: "#4ade80" },
  },
  3: {
    // Cosecha (Madura y Dorada)
    esquejeOpacity: 0,
    mainStalk: { scale: 1, color: "#eab308" }, // Color Dorado/Amarillento
    mainLeaves: { scale: 1, y: 105, color: "#84cc16" }, // Hojas verde-amarillo
    lowLeaves: { scale: 0.75, y: 185, color: "#65a30d" },
    hijueloL: { scale: 0.75, color: "#facc15" },
    hijueloR: { scale: 0.85, color: "#facc15" },
    hijueloLLeaves: { scale: 0.65, y: 190, color: "#84cc16" },
    hijueloRLeaves: { scale: 0.75, y: 160, color: "#84cc16" },
  },
};

// ==========================================
// COMPONENTE: Tallo (Segmentado con nudos)
// ==========================================
const Stalk = ({ x, y, height, width, color, scale }) => {
  return (
    <motion.g
      initial={{ scaleY: 0 }}
      animate={{ x, y, scaleY: scale }}
      transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
      style={{ originY: 1 }} // Crece desde la base (Y)
    >
      <motion.rect
        x={-width / 2}
        y={-height}
        width={width}
        height={height}
        rx={width / 3}
        animate={{ fill: color }}
        transition={{ duration: 1.5 }}
      />
      {/* Nudos característicos de la Caña de Azúcar */}
      {[...Array(7)].map((_, i) => (
        <motion.line
          key={i}
          x1={-width / 2}
          y1={-height + i * (height / 7) + height / 14}
          x2={width / 2}
          y2={-height + i * (height / 7) + height / 14}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth={2}
        />
      ))}
    </motion.g>
  );
};

// ==========================================
// COMPONENTE: Grupo de Hojas (Caídas y curvas)
// ==========================================
const LeafCluster = ({ x, y, scale, color }) => (
  <motion.g
    initial={{ scale: 0 }}
    animate={{ x, y, scale }}
    transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
    style={{ originY: 1 }}
  >
    {/* Hoja central alta */}
    <motion.path
      d="M 0,0 C -10,-60 0,-110 0,-110 C 10,-60 0,0 0,0 Z"
      animate={{ fill: color }}
      transition={{ duration: 1.5 }}
    />
    {/* Hojas superiores */}
    <motion.path
      d="M 0,0 C -20,-40 -50,-60 -80,-40 C -50,-30 -20,-10 0,0 Z"
      animate={{ fill: color }}
      transition={{ duration: 1.5 }}
    />
    <motion.path
      d="M 0,0 C 20,-40 50,-60 80,-40 C 50,-30 20,-10 0,0 Z"
      animate={{ fill: color }}
      transition={{ duration: 1.5 }}
    />
    {/* Hojas medias */}
    <motion.path
      d="M 0,0 C -30,-30 -70,-30 -90,10 C -70,-10 -30,0 0,0 Z"
      animate={{ fill: color }}
      transition={{ duration: 1.5 }}
    />
    <motion.path
      d="M 0,0 C 30,-30 70,-30 90,10 C 70,-10 30,0 0,0 Z"
      animate={{ fill: color }}
      transition={{ duration: 1.5 }}
    />
    {/* Hojas caídas (Drooping - típicas de la caña) */}
    <motion.path
      d="M 0,0 C -40,-20 -90,0 -110,60 C -90,30 -40,10 0,10 Z"
      animate={{ fill: color }}
      transition={{ duration: 1.5 }}
    />
    <motion.path
      d="M 0,0 C 40,-20 90,0 110,60 C 90,30 40,10 0,10 Z"
      animate={{ fill: color }}
      transition={{ duration: 1.5 }}
    />
  </motion.g>
);

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function CropSVG({ stage }) {
  // Asegurarnos de que si la etapa no existe, muestre la 0
  const current = STAGE_CONFIG[stage] || STAGE_CONFIG[0];

  return (
    <div style={{ width: "100%", maxWidth: "250px", margin: "0 auto" }}>
      <svg
        viewBox="0 0 250 350"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        {/* Capa de Tierra Trasera */}
        <ellipse cx="125" cy="300" rx="90" ry="25" fill="#3f2e1c" />

        {/* Esqueje (Fase 0 - Trozo de caña sembrado) */}
        <motion.g
          animate={{ opacity: current.esquejeOpacity }}
          transition={{ duration: 1 }}
        >
          <rect
            x="95"
            y="285"
            width="60"
            height="14"
            rx="4"
            transform="rotate(-15 125 292)"
            fill="#a3e635"
            stroke="#4d7c0f"
            strokeWidth="2"
          />
          <line
            x1="125"
            y1="285"
            x2="125"
            y2="299"
            stroke="#4d7c0f"
            strokeWidth="2"
            transform="rotate(-15 125 292)"
          />
        </motion.g>

        {/* Hijuelo Izquierdo (Brota en etapa 2) */}
        <Stalk
          x={90}
          y={295}
          height={140}
          width={12}
          color={current.hijueloL.color}
          scale={current.hijueloL.scale}
        />
        <LeafCluster
          x={90}
          y={current.hijueloLLeaves.y}
          scale={current.hijueloLLeaves.scale}
          color={current.hijueloLLeaves.color}
        />

        {/* Hijuelo Derecho (Brota en etapa 2) */}
        <Stalk
          x={160}
          y={295}
          height={160}
          width={14}
          color={current.hijueloR.color}
          scale={current.hijueloR.scale}
        />
        <LeafCluster
          x={160}
          y={current.hijueloRLeaves.y}
          scale={current.hijueloRLeaves.scale}
          color={current.hijueloRLeaves.color}
        />

        {/* Tallo Principal */}
        <Stalk
          x={125}
          y={295}
          height={190}
          width={18}
          color={current.mainStalk.color}
          scale={current.mainStalk.scale}
        />
        <LeafCluster
          x={125}
          y={current.lowLeaves.y}
          scale={current.lowLeaves.scale}
          color={current.lowLeaves.color}
        />
        <LeafCluster
          x={125}
          y={current.mainLeaves.y}
          scale={current.mainLeaves.scale}
          color={current.mainLeaves.color}
        />

        {/* Capas de Tierra Delanteras (Para dar profundidad 3D) */}
        <ellipse cx="125" cy="310" rx="100" ry="20" fill="#5c4033" />
        <ellipse cx="125" cy="320" rx="80" ry="15" fill="#452710" />
      </svg>
    </div>
  );
}
