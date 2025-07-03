import React from 'react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`fixed top-6 right-6 px-6 py-3 rounded shadow-lg z-50 text-white flex items-center gap-4 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold text-lg leading-none">×</button>
    </div>
  );
};

export default Notification; 