import React from 'react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded shadow-lg flex items-center gap-4 transition-all
      ${type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
    >
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-lg font-bold bg-transparent border-none text-white hover:text-gray-200 focus:outline-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Notification; 