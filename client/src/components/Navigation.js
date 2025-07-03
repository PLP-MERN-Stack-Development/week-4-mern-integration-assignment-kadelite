import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between mb-8 shadow">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg hover:text-blue-400 transition">Posts</Link>
        <Link to="/create" className="hover:text-blue-400 transition">Create Post</Link>
        <Link to="/categories" className="hover:text-blue-400 transition">Categories</Link>
      </div>
      <div className="flex items-center gap-4">
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
    </nav>
  );
};

export default Navigation; 