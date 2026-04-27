import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-column brand-column">
          <h2 className="footer-brand">ZYNKLY</h2>
          <p className="footer-tagline">India's 15-Minute House Help Service</p>
        </div>
        
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Services</h3>
          <ul>
            <li><Link to="/services">Home Cleaning</Link></li>
            <li><Link to="/services">Office Cleaning</Link></li>
            <li><Link to="/services">Deep Cleaning</Link></li>
            <li><Link to="/services">Recurring Services</Link></li>
          </ul>
        </div>
        
        <div className="footer-column contact-column">
          <h3>Contact</h3>
          <ul>
            <li>📍 India</li>
            <li>📞 +91 7722962773</li>
            <li>✉️ support@zynkly.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Zynkly. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
