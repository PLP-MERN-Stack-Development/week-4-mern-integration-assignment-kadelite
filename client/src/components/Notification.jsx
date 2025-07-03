import React from 'react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      background: type === 'error' ? '#f44336' : '#4caf50',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: 8,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      {message}
      <button onClick={onClose} style={{ marginLeft: 16, background: 'transparent', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>X</button>
    </div>
  );
};

export default Notification; 