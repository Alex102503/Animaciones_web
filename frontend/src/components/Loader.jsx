import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column', 
      background: 'var(--bg-app)' 
    }}>
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 2, 
          ease: "easeInOut", 
          times: [0, 0.5, 1], 
          repeat: Infinity 
        }}
        style={{ fontSize: '70px', transformOrigin: 'bottom center' }}
      >
        🌱
      </motion.div>
      <motion.h3 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ color: 'var(--primary)', marginTop: '20px' }}
      >
        Iniciando AgroVision...
      </motion.h3>
    </div>
  );
}