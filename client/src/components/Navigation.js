import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between mb-8 shadow relative">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg hover:text-blue-400 transition">Posts</Link>
        <button className="md:hidden ml-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/create" className="hover:text-blue-400 transition">Create Post</Link>
          <Link to="/categories" className="hover:text-blue-400 transition">Categories</Link>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm">Hello, <span className="font-semibold">{user.name || user.email}</span></span>
            <Link to="/profile" className="hover:text-blue-400 transition">Profile</Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
            <Link to="/register" className="hover:text-blue-400 transition">Register</Link>
          </>
        )}
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 flex flex-col items-start p-4 gap-2 z-50 md:hidden shadow-lg animate-fade-in">
          <Link to="/create" className="w-full py-2 hover:text-blue-400 transition" onClick={() => setMenuOpen(false)}>Create Post</Link>
          <Link to="/categories" className="w-full py-2 hover:text-blue-400 transition" onClick={() => setMenuOpen(false)}>Categories</Link>
          {user ? (
            <>
              <Link to="/profile" className="w-full py-2 hover:text-blue-400 transition" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="w-full py-2 hover:text-blue-400 transition" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="w-full py-2 hover:text-blue-400 transition" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation; 