import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '20px',
      color: 'var(--text-muted)',
      fontSize: '13px',
      marginTop: 'auto',
      borderTop: '1px solid rgba(0,0,0,0.05)'
    }}>
      <p>
        <strong style={{ color: 'var(--primary)' }}>AgroVision</strong> — 
        Dashboard de Monitoreo de la Caña de Azucar &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}