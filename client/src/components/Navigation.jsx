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
    <nav style={{ padding: '1rem', background: '#f5f5f5', marginBottom: '2rem' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Posts</Link>
      <Link to="/create" style={{ marginRight: '1rem' }}>Create Post</Link>
      <Link to="/categories" style={{ marginRight: '1rem' }}>Categories</Link>
      {user ? (
        <>
          <span style={{ marginRight: '1rem' }}>Hello, {user.name || user.email}</span>
          <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navigation; 