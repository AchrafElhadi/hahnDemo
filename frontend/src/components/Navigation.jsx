import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        👥 User Management
      </Link>
      <div className="navbar-nav">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          📋 Users List
        </Link>
        <Link 
          to="/add" 
          className={`nav-link ${location.pathname === '/add' ? 'active' : ''}`}
        >
          ➕ Add User
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;