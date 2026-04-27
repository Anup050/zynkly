import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ onOpenCart }) => {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">ZYNKLY</Link>
      <ul className="navbar-nav">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/services" className="nav-link">Services</Link></li>
        
        {/* Cart is always visible */}
        <li>
          <button type="button" onClick={onOpenCart} className="nav-link cart-link">
            <span>🛒</span> Cart
          </button>
        </li>

        {/* Admin Link */}
        {user?.isAdmin && (
          <li><Link to="/admin" className="nav-link">Admin</Link></li>
        )}

        {/* Unauthenticated State */}
        {!loading && !user && (
          <>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/signup" className="nav-link signup-btn">Sign Up</Link></li>
          </>
        )}

        {/* Authenticated State */}
        {!loading && user && (
          <>
            {!user.isVerified && (
              <li><Link to="/verify-email" className="nav-link">Verify Email</Link></li>
            )}
            <li><button type="button" onClick={logout} className="nav-link logout-btn">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
