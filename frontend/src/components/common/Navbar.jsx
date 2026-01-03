/**
 * Navbar component
 * Navigation bar with user menu
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/navbar.css';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const onProfilePage = location.pathname.startsWith('/profile');
  const avatarSrc = user?.avatar || 'https://i.pravatar.cc/100?img=12';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌍 GlobeTrotter
        </Link>

        <div className="navbar-menu">
          {isAuthenticated || onProfilePage ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/create-trip" className="nav-link">
                New Trip
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <div className="user-menu">
                <button 
                  className="user-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <img src={avatarSrc} alt="Profile" className="user-avatar" />
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      Profile
                    </Link>
                    {isAuthenticated && (
                      <button onClick={handleLogout} className="dropdown-item">
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;